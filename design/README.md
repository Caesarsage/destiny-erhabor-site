# Design source

The artboards behind this site, one `.dc.html` per screen, plus `canvas.json`
for the canvas layout. **These are the spec.** The build follows them; when the
two disagree, the artboard is right.

They were lost once already — the originals lived in a session scratchpad,
which does not survive — and were recovered from the published canvas. They are
committed here so that cannot happen twice.

| File | Screen |
|---|---|
| `Main.dc.html` | Home, 1440px |
| `Experience.dc.html` | Experience |
| `OpenSource.dc.html` | Open source |
| `Speaking.dc.html` | Speaking |
| `Writing.dc.html` | Writing |
| `About.dc.html` | About |
| `Theme.dc.html` | Theme sheet — the source of `src/styles/tokens.css` |
| `Mobile.dc.html` | Home at 390px |
| `DirectionB.dc.html` | Rejected: Terminal |
| `DirectionC.dc.html` | Rejected: Editorial |

Direction A, "Reference", is what is built. B and C are kept only so the
rejected options stay legible; do not build from them.

## Editing

The canvas is published at

    https://claude.ai/code/artifact/85f67bb0-f072-4db9-98c2-990bc1075dbe

Edit it there, then re-extract over this folder rather than hand-editing these
files, so the canvas and the repo do not drift:

```
node <design-skill>/seed-canvas.mjs --extract <saved-artifact.html> --to design/
```

Never rebuild the canvas from memory. If the published version is ahead of this
folder, the published version wins.

## Reading them

Each file is a standalone artboard: a `<x-dc>` body plus a `data-dc-script`
block holding the light and dark palettes. The `{{t.token}}` placeholders are
canvas templating, not CSS — the shipped equivalents are the custom properties
in `src/styles/tokens.css`.
