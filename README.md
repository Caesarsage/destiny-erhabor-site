# destinyerhabor — personal site

Portfolio and CV for Destiny Erhabor. Astro, static output, deployed on
Cloudflare Pages.

## Running it

```sh
npm install
npm run dev        # localhost:4321
npm run build      # → dist/
npm run preview    # serve the build
npm run check      # astro check
```

## Layout

```
src/data/*.yaml    roles, projects and writing — content lives here, not in templates
src/pages/         one file per page
src/styles/        tokens.css is the palette and page rhythm; site.css the structure
design/            the design canvas this is built from — the artboards are the spec
cv/cv.html         the CV source
```

Adding a role, a project or an article is an edit to a YAML file in
`src/data/`. Templates should not need touching.

## The CV

`npm run cv` renders `cv/cv.html` to `public/destiny-erhabor-cv.pdf`, which is
what the Resume links point at. It must fit two A4 pages — the script exits
non-zero if it does not.

The PDF is committed because the render needs a browser, which the deploy
container does not have. Change the HTML, re-run the script, commit both.

## Deploying

Cloudflare Pages, build `npm run build`, output `dist`. No environment
variables are required: `astro.config.mjs` reads the canonical URL from
`SITE_URL` if set, otherwise from `CF_PAGES_URL`, which Cloudflare supplies on
every build.

## Theme

Three states — explicit light, explicit dark, and following the system. An
inline script in `<head>` stamps a stored choice before first paint so the page
never flashes the wrong ground.
