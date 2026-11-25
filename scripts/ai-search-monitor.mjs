import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function validateClients(clients) {
  if (!Array.isArray(clients) || clients.length < 1 || clients.length > 20) {
    throw new Error('Configure between 1 and 20 clients.');
  }
  const ids = new Set();
  for (const { id, name, domain, city, region, aliases, competitors, prompts } of clients) {
    if (!/^[a-z0-9-]{1,50}$/.test(id ?? '') || ids.has(id) ||
        ![name, city, region].every(isText) ||
        !/^(?:[a-z0-9-]+\.)+[a-z0-9-]+$/i.test(domain ?? '') ||
        !Array.isArray(aliases) || !aliases.every(isText) ||
        !Array.isArray(competitors) || !competitors.every(isText) ||
        !Array.isArray(prompts) || prompts.length < 1 || prompts.length > 12 ||
        !prompts.every(isText) || new Set(prompts).size !== prompts.length) {
      throw new Error('Invalid client configuration. Check IDs, domains, locations, aliases, competitors and unique prompts.');
    }
    ids.add(id);
  }
}

function isText(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 500;
}

async function post(url, key, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) throw new Error(`Search provider returned HTTP ${response.status}.`);
  return response.json();
}

async function searchOpenAI(client, prompt) {
  const model = process.env.OPENAI_SEARCH_MODEL || 'gpt-4.1-mini';
  const result = await post('https://api.openai.com/v1/responses', process.env.OPENAI_API_KEY, {
    model,
    input: prompt,
    tools: [{
      type: 'web_search',
      user_location: { type: 'approximate', country: 'AU', city: client.city, region: client.region },
    }],
    tool_choice: { type: 'web_search' },
    max_output_tokens: 1800,
    store: false,
  });
  const blocks = (result.output ?? []).filter(item => item.type === 'message')
    .flatMap(item => item.content).filter(item => item.type === 'output_text');
  if (result.status !== 'completed') throw new Error('OpenAI search did not complete.');
  return {
    model: result.model ?? model,
    answer: blocks.map(block => block.text).join('\n'),
    sources: blocks.flatMap(block => block.annotations ?? [])
      .filter(item => item.type === 'url_citation').map(item => item.url),
  };
}

async function searchPerplexity(client, prompt) {
  const result = await post('https://api.perplexity.ai/chat/completions', process.env.PERPLEXITY_API_KEY, {
    model: 'sonar',
    messages: [{ role: 'system', content: `The searcher is in ${client.city}, ${client.region}, Australia.` },
      { role: 'user', content: prompt }],
    max_tokens: 1800,
  });
  return {
    model: result.model ?? 'sonar',
    answer: result.choices?.[0]?.message?.content ?? '',
    sources: result.citations ?? [],
  };
}

function containsName(answer, name) {
  const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])`, 'iu').test(answer);
}

function sourceDomain(source) {
  try {
    const url = new URL(source);
    return ['http:', 'https:'].includes(url.protocol) ? url.hostname.toLowerCase().replace(/^www\./, '') : '';
  } catch {
    return '';
  }
}

export async function collect(clients, providers) {
  validateClients(clients);
  const rows = [];
  for (const client of clients) {
    const domain = client.domain.toLowerCase().replace(/^www\./, '');
    for (const [provider, search] of Object.entries(providers)) {
      for (const prompt of client.prompts) {
        const result = await search(client, prompt);
        if (!result.answer.trim()) throw new Error(`${provider} returned an empty answer.`);
        const sources = [...new Set(result.sources.filter(sourceDomain))];
        rows.push({
          client: client.id, provider, prompt, model: result.model,
          location: `${client.city}, ${client.region}`,
          profile: JSON.stringify([domain, client.name, client.aliases, client.competitors]),
          mentioned: [client.name, ...client.aliases].some(name => containsName(result.answer, name)),
          cited: sources.some(source => {
            const host = sourceDomain(source);
            return host === domain || host.endsWith(`.${domain}`);
          }),
          competitors: client.competitors.filter(name => containsName(result.answer, name)),
          answer: result.answer,
          sources,
        });
      }
    }
  }
  return rows;
}

function rowKey(row) {
  return JSON.stringify([row.client, row.provider, row.prompt, row.model, row.location, row.profile]);
}

export function reportFor(client, current, previous, date, previousDate) {
  const rows = current.filter(row => row.client === client.id);
  const baseline = new Map(previous.map(row => [rowKey(row), row]));
  const lines = [
    `# AI Search Check — ${client.name}`, '',
    `Run date: ${date}`,
    `Previous run: ${previousDate ?? 'None'}`, '',
    'Internal draft. Review factual claims and source relevance before sharing.',
    'These are API samples. Results can differ from consumer AI products and do not measure referrals or enquiries.', '',
  ];
  for (const provider of new Set(rows.map(row => row.provider))) {
    const samples = rows.filter(row => row.provider === provider);
    lines.push(`- ${provider}: ${samples.filter(row => row.mentioned).length}/${samples.length} mentions and ${samples.filter(row => row.cited).length}/${samples.length} site citations.`);
  }
  for (const row of rows) {
    const before = baseline.get(rowKey(row));
    const changes = [];
    if (before) {
      if (before.mentioned !== row.mentioned) changes.push(`business mention ${row.mentioned ? 'appeared' : 'disappeared'}`);
      if (before.cited !== row.cited) changes.push(`site citation ${row.cited ? 'appeared' : 'disappeared'}`);
      const previousSources = new Set(before.sources.map(sourceDomain));
      const currentSources = new Set(row.sources.map(sourceDomain));
      if ([...previousSources].some(host => !currentSources.has(host)) ||
          [...currentSources].some(host => !previousSources.has(host))) changes.push('cited domains changed');
      if (before.competitors.join('\n') !== row.competitors.join('\n')) changes.push('competitor mentions changed');
    }
    lines.push('', `## ${row.provider} · ${row.prompt}`, '',
      `Changes: ${before ? changes.join(', ') || 'none in tracked signals' : 'no comparable previous sample'}`,
      `Business mentioned: ${row.mentioned ? 'yes' : 'no'}. Site cited: ${row.cited ? 'yes' : 'no'}.`,
      `Competitors mentioned: ${row.competitors.join(', ') || 'none tracked'}.`, '',
      ...row.answer.split('\n').map(line => `> ${line}`), '',
      ...row.sources.map(url => `- ${url}`));
  }
  return lines.join('\n') + '\n';
}

async function main() {
  const clients = JSON.parse(process.env.AI_SEARCH_CLIENTS_JSON ?? 'null');
  const providers = {};
  if (process.env.OPENAI_API_KEY) providers['OpenAI web search API'] = searchOpenAI;
  if (process.env.PERPLEXITY_API_KEY) providers['Perplexity Sonar API'] = searchPerplexity;
  if (!Object.keys(providers).length) throw new Error('Configure at least one search API key.');
  const dir = process.argv[2] ?? 'ai-search-output';
  const previous = process.argv[3] ? JSON.parse(await readFile(process.argv[3], 'utf8')) : { rows: [] };
  const date = new Date().toISOString();
  const rows = await collect(clients, providers);
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(resolve(dir, 'snapshot.json'), JSON.stringify({ date, rows }, null, 2), { mode: 0o600 });
  for (const client of clients) {
    await writeFile(resolve(dir, `${client.id}.md`), reportFor(client, rows, previous.rows, date, previous.date), { mode: 0o600 });
  }
  console.log(`Generated ${clients.length} report(s) from ${rows.length} samples.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error(error instanceof SyntaxError ? 'Invalid JSON configuration or snapshot.' : error.message);
    process.exitCode = 1;
  });
}
