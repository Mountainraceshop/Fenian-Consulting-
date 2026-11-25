# Fenian Consulting

Marketing website for **Fenian Consulting** — _Practical strategy. Clear communication. Real-world recovery._

A clean, fast, mobile-friendly and SEO-friendly static site built with [Astro](https://astro.build/). Practical business coaching, marketing, tender support, operational planning, communications, event growth and turnaround support for small businesses, regional businesses, sporting organisations, community groups and practical industries.

## Pages

Home · About · Services · Business Coaching · Business Audit · Business Turnaround · Tender & Grant Support · Marketing & Communications · Event & Community Growth · Contact

## Requirements

- Node.js 18.20+, 20.3+ or 22+
- npm

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
```

## Commands

| Command           | Action                                            |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the local dev server (`http://localhost:4321`) |
| `npm run build`   | Build the production site to `dist/`              |
| `npm run preview` | Preview the production build locally              |
| `npm run check`   | Type-check the project (`astro check`)            |

## Editing content

The site is built to be easy to edit:

- **Business name, tagline, contact details and navigation** live in `src/data/site.ts`.
- **Homepage service cards and support levels** are also defined in `src/data/site.ts`.
- **Page copy** lives in the matching file under `src/pages/` (e.g. `src/pages/business-coaching.astro`).
- **Colours, fonts and spacing** (the design system) are in `src/styles/global.css` as CSS variables.
- **Shared layout, header and footer** are in `src/layouts/` and `src/components/`.

## Project structure

```
src/
  components/   # Header, Footer, ServiceCard, CtaBand, PageHero
  data/site.ts  # site config, navigation, services, support levels
  layouts/      # Layout.astro (HTML shell, SEO meta, JSON-LD)
  pages/        # one .astro file per page
  styles/       # global.css design tokens
public/         # favicon, robots.txt and other static assets
```

## Before going live

1. Confirm `astro.config.mjs` (`site:`) and `public/robots.txt` still use `https://fenian-consulting.com.au`.
2. Replace the placeholder phone number in `src/data/site.ts` when confirmed.
3. Connect the contact form to a form handler (Formspree, Netlify Forms, Basin or your own endpoint) — see the comment in `src/pages/contact.astro`.

## Deployment

`npm run build` outputs a fully static site to `dist/`, which can be hosted on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, etc.).

## AI Search Monitor

The GitHub Actions workflow runs a fixed set of buyer questions for each client,
records answers and citations, and produces one internal Markdown report per
client plus a JSON snapshot. It flags changes in brand mentions, site citations,
competitor mentions and cited domains compared with the previous comparable run.
Changing the model, location, tracking profile or question starts a new baseline
for that sample. Review the answers for factual errors before sharing a report.

In GitHub **Settings → Secrets and variables → Actions**, add
`AI_SEARCH_REPORT_PASSWORD` (a random password of at least 24 characters),
`AI_SEARCH_CLIENTS_JSON`, and an API key for each provider you want to use:
`OPENAI_API_KEY` and/or `PERPLEXITY_API_KEY`. API requests incur provider fees.
Example client configuration (add up to 12 distinct questions per client):

```json
[
  {
    "id": "mountain-race-shop",
    "name": "Mountain Race Shop",
    "domain": "mountainraceshop.com.au",
    "city": "Cooma",
    "region": "New South Wales",
    "aliases": [],
    "competitors": [],
    "prompts": [
      "Who services motocross suspension near Canberra?",
      "Where can I get an enduro suspension revalve in the Snowy Mountains?"
    ]
  }
]
```

Run **AI Search Monitor** manually from the Actions tab on `main` after
configuring the secrets. Enable the monthly run by setting the repository
variable `AI_SEARCH_MONITOR_ENABLED` to `true`. The workflow uses the most
recent unexpired archive from `main` for comparisons. Keep the password stable
for the comparison window. If you must rotate it, remove the old archive after
backing up any reports you need so the next run starts a fresh baseline.

Download and unzip the `ai-search-monitor` run artifact, then decrypt and extract it
in a private directory. OpenSSL prompts for the report password.

```sh
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in ai-search-reports.tar.gz.enc -out ai-search-reports.tar.gz
tar -xzf ai-search-reports.tar.gz
```

OpenAI web search and Perplexity Sonar are API samples. Check the consumer
interfaces manually when delivering a customer audit, including Google AI Mode.
Website and listing changes, factual verification and referral/enquiry analysis
remain part of the human service. The workflow does not send reports to customers.
