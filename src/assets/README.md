# Assets

Images imported by pages, so Astro can resize them and serve modern formats.
Anything that should be served byte-for-byte at a fixed URL goes in `public/`
instead — the resume PDF, for one.

## portrait

`portrait.png` is the About photo. The page finds it by name — `.jpg`, `.jpeg`,
`.webp` and `.avif` work equally well — and with no such file it falls back to
the design's `[PHOTO]` frame rather than failing the build.

To replace it, drop a new file in under the same stem and delete the old one.
Nothing else to change.

The frame is 4:5 and cover-crops whatever it is given, from the centre. The
current source is square, so the sides are trimmed and the full height is kept.
Anything much wider than tall will lose the edges of the subject — crop to 4:5
first if that matters. 680px on the long edge or better, so the 2× srcset has
pixels to work with; the build resizes down from there.
