import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Static output — deployed to Vercel (served at domain root, no base path).
export default defineConfig({
  site: 'https://pedrocha-mvp.vercel.app',
  integrations: [tailwind()],
});
