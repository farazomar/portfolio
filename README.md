# Faraz Omar — Portfolio

A one-page portfolio for Faraz Omar, Microsoft-certified Data Analyst (PL-300) based in Toronto. Dark, editorial "data" aesthetic — grid + grain textures, big display typography, monospace labels, and a single chartreuse accent — with scroll-driven and cursor animations throughout.

**Live sections:** Hero → skills marquee → About (animated stat counters) → Experience (scroll-progress timeline) → Toolkit → Education → Contact.

## Tech

- **Vanilla HTML / CSS / JS** — no framework, no build step
- [GSAP 3](https://gsap.com/) + ScrollTrigger — section reveals, stat counters, parallax, timeline scrub
- [Lenis](https://lenis.darkroom.engineering/) — smooth wheel scrolling (native touch scrolling is left untouched)
- Google Fonts — Syne (display), Instrument Serif (italic accents), Manrope (body), JetBrains Mono (labels)

All libraries load from the jsDelivr CDN — there is nothing to install.

## Structure

```
├── index.html              # all content lives here
├── css/style.css           # theme, layout, responsive rules
├── js/main.js              # cursor, preloader, Lenis + ScrollTrigger wiring
├── Faraz_Omar_Resume.pdf   # served by the "Résumé ↓" link in Contact
└── .claude/launch.json     # local dev server config
```

## Run locally

Any static file server works. With Python:

```sh
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Deploy

It's fully static — drop the folder on GitHub Pages, Netlify, Vercel, or Cloudflare Pages as-is. Keep `Faraz_Omar_Resume.pdf` next to `index.html` so the résumé link keeps working.

## Editing notes

- **Content** (jobs, stats, links) is hand-written in `index.html`. If the resume changes, update both the PDF and the HTML.
- **Colors & fonts** are CSS custom properties at the top of `css/style.css` (`--bg`, `--ink`, `--accent`, …).
- **Scroll feel** is the `lerp` value in `js/main.js` (currently `0.16`) — higher is snappier, lower is floatier.
- **Cache busting:** after editing CSS/JS, bump the `?v=N` query on the two asset links in `index.html`; simple static servers let browsers cache aggressively.
- **Do not re-enable `scroll-behavior: smooth` while Lenis is active.** The browser re-eases every per-frame scroll write and the page rubber-bands. `main.js` adds the `lenis` class and inline `scroll-behavior: auto` to `<html>` on purpose.

## Accessibility & performance

- Respects `prefers-reduced-motion` — animations and the preloader are skipped entirely.
- Custom cursor and hover effects disable themselves on touch devices; mobile also gets a static grain layer and no backdrop blur to keep scrolling cheap.
- Content is visible without JavaScript; animations only add hidden states from JS, and the preloader has a pure-CSS fallback timeout.
- Verified down to 320 px-wide viewports with no horizontal overflow.
