import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the live domain before deploying so the sitemap and
// canonical URLs are correct.
export default defineConfig({
  site: 'https://www.fieldcraftconsulting.com.au',
  integrations: [sitemap()],
  server: {
    host: true,
  },
});
