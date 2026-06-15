import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fenian-consulting.com.au',
  integrations: [sitemap()],
  server: {
    host: true,
  },
});
