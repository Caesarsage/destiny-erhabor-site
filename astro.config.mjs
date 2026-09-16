import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// There is no domain yet, so nothing here invents one. `site` feeds the
// canonical tags and the sitemap, and it is read from the environment:
//
//   SITE_URL      set this once a real domain exists — it wins over everything
//   CF_PAGES_URL  supplied by Cloudflare Pages on every build, so deploys are
//                 already correct with no configuration at all
//
// The localhost fallback is for `npm run dev` and local builds. A local build
// deployed as-is would carry localhost canonicals, so it warns when it lands.
const site = process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'http://localhost:4321';

if (!process.env.SITE_URL && !process.env.CF_PAGES_URL) {
  console.warn(
    '[site] no SITE_URL or CF_PAGES_URL — canonical URLs and the sitemap will point at ' +
      site +
      '. Fine for local work; set SITE_URL before publishing a build from this machine.',
  );
}

// Static output — Cloudflare Pages serves the built files directly, so no adapter.
export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
