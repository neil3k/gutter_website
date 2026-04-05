import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://warboysgutterclearing.co.uk',
  output: 'static',
  integrations: [sitemap()],
});
