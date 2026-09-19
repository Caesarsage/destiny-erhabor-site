# destinyerhabor.com

My personal site — what I work on, what I have written, and how to reach me.

**[destinyerhabor.com](https://destinyerhabor.com)**

I build cloud native systems and the documentation that makes them usable.
Docs Lead for the Kubernetes v1.38 release, CNCF Ambassador, and a software and
platform engineer at Oris in Lagos.

## About the build

It is a small static site, built with [Astro](https://astro.build) and served
from Cloudflare. Three things about it I liked doing:

**The design came first.** Every page was drawn as an artboard before any of it
was written, and those artboards live in [`design/`](design/). When the build
and the drawing disagree, the drawing wins.

**The writing is data, not markup.** Roles, projects and articles sit in YAML
under [`src/data/`](src/data/). Adding a job or a published piece is an edit to
one file — no templates involved — which is the only reason a personal site
ever stays up to date.

**It reads in the dark.** One palette, two grounds, and it follows whatever
your machine is set to unless you say otherwise. No flash of the wrong one on
the way in.

The CV is part of the repo too: [`cv/cv.html`](cv/cv.html) is the source, and
one command renders it to the PDF the site links to.

## Running it

```sh
npm install
npm run dev     # localhost:4321
npm run build
npm run cv      # rebuild the CV PDF
```

More detail on the layout and the deploy lives in the comments at the top of
the files that need it.
