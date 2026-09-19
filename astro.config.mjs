import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical tags and the sitemap are built from `site`, so the real domain is
// the default: a build cannot ship localhost URLs the way an earlier one did.
// SITE_URL overrides it — for a staging host, or a preview that should name
// itself. A preview left alone points its canonicals at production, which is
// what keeps preview URLs from competing with the real site in search.
//
// CF_PAGES_URL used to be consulted here. It is a Pages-only variable and this
// deploys on Workers, so it was never set and every canonical said localhost.
const site = process.env.SITE_URL ?? 'https://destinyerhabor.com';

// Static output — Cloudflare serves the built files directly, so no adapter.
export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
