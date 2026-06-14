# AGENTS.md

## Cursor Cloud specific instructions

This repo is the **Fieldcraft Consulting** marketing website — a static [Astro](https://astro.build/) site (no backend/database). Standard commands and editing guidance live in `README.md`; only non-obvious notes are below.

### Running & verifying

- Dev server: `npm run dev` (serves on `http://localhost:4321`; `host` is enabled in `astro.config.mjs` so it's reachable on the network too).
- Build: `npm run build` (static output to `dist/`). Preview a build with `npm run preview`.
- Lint / type-check: `npm run check` (`astro check`). It reports **1 "hint"** about the JSON-LD `<script type="application/ld+json">` in `src/layouts/Layout.astro` being treated as inline — this is expected and harmless (it must stay inline), not an error to fix.
- Requires Node 18.20+, 20.3+ or 22+ (the VM uses Node 22).

### Editing content

- Site-wide text, contact details, navigation and the homepage service/level cards are centralised in `src/data/site.ts` — edit there, not in each page.
- Per-page copy is in the matching `src/pages/*.astro` file. Design tokens (colours/spacing) are CSS variables in `src/styles/global.css`.

### Contact form (important caveat)

- The contact form in `src/pages/contact.astro` is **front-end only**. With no endpoint configured it validates input and shows an on-page confirmation but does **not** send anything. To make it deliver messages, set `data-endpoint` on the `<form>` to a form handler URL (Formspree/Netlify/Basin/etc.) — see the comment in that file. Don't assume submissions are stored anywhere until that is wired up.
