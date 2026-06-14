# Fieldcraft Consulting

Marketing website for **Fieldcraft Consulting** — _Practical strategy. Clear communication. Real-world delivery._

A clean, fast, mobile-friendly and SEO-friendly static site built with [Astro](https://astro.build/). Practical strategy and consulting for small businesses, regional businesses, sporting organisations, community groups and practical industries.

## Pages

Home · About · Services · Business Coaching · Business Turnaround · Tender & Grant Support · Marketing & Communications · Event & Community Growth · Contact

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

1. Set the real domain in `astro.config.mjs` (`site:`) and `public/robots.txt` so canonical URLs and the sitemap are correct.
2. Update contact details in `src/data/site.ts`.
3. Connect the contact form to a form handler (Formspree, Netlify Forms, Basin or your own endpoint) — see the comment in `src/pages/contact.astro`.

## Deployment

`npm run build` outputs a fully static site to `dist/`, which can be hosted on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, etc.).
