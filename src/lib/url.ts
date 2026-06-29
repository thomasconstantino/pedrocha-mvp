// Resolve internal links/asset paths against Astro's configured base path,
// so the site works both at domain root and under a GitHub Pages subpath.
const BASE = import.meta.env.BASE_URL; // e.g. "/" or "/pedrocha-mvp/"

export function url(p = '/'): string {
  if (/^https?:/i.test(p) || p.startsWith('#') || p.startsWith('mailto:')) return p;
  const base = BASE.endsWith('/') ? BASE : BASE + '/';
  const clean = p.replace(/^\//, '');
  return base + clean;
}
