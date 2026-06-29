import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Static output — deployed to GitHub Pages (project site lives under /pedrocha-mvp).
// To host at a domain root instead (Cloudflare Pages, Vercel, Netlify), remove `base`.
export default defineConfig({
  site: 'https://thomasconstantino.github.io',
  base: '/pedrocha-mvp',
  integrations: [tailwind()],
});
