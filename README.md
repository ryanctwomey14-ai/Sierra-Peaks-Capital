# Desert Peaks Capital — website

Static marketing site for a private multifamily real estate sponsor. Plain HTML,
one CSS file, two vanilla JS files. No build step, no dependencies, no framework.

**Live draft:** https://ryanctwomey14-ai.github.io/Sierra-Peaks-Capital/

---

## ⚠️ This is a review draft, not a launch build

Every page carries `<meta name="robots" content="noindex, nofollow">` and
`robots.txt` disallows all crawlers, so the placeholder financial figures below
cannot be indexed under the Desert Peaks name. **Remove both before launch.**

### Must be resolved before this goes live

1. **Securities counsel review of every page**, in particular `disclosures.html`,
   the returns calculator, and the 506(b) vs 506(c) determination. The site is
   written assuming **Reg D Rule 506(c)** — that is what permits publishing
   strategy and target returns. Under 506(b) those must come off the public pages.
2. **All performance data is placeholder.** AUM, unit counts, property names,
   markets, realised returns, fee percentages, the co-investment figure and all
   three testimonials are invented for layout purposes.
3. **Both forms submit nowhere.** They validate and show a success state; wire the
   handler in `assets/js/site.js` to a CRM or form endpoint.
4. **The scheduler is a placeholder.** Paste a Calendly / SavvyCal / HubSpot embed
   into `.embed-slot` in `book-a-call.html`.
5. **Targets were reconciled; the calculator still runs low.** Hold is 3–7 years on every
   page and the multiple is 1.9–2.3×, which matches 15–20% IRR with 7–10% distributions
   over a ~5-year hold. The returns calculator's assumptions (8.5% cash, 7.5% equity
   growth) still produce ~14% IRR, below the stated target. Confirm with the client.
6. **Replace `sierrapeakscapital.com`** in canonical URLs, Open Graph tags and the
   sitemap with the live domain.

Real details already in place: `invest@sierrapeakscapital.com`, +1 (775) 437-8854.
The Boise street address is still placeholder.

---

## Structure

```
*.html                 13 pages, flat at the root
assets/css/site.css    design system + every component
assets/js/site.js      nav, reveals, accordion, forms, counters, returns calculator
assets/js/chat.js      investor assistant widget
assets/img/            logo variants, headshots, aerial
assets/video/          hero and strategy background loops (transcoded)
api-chat-example.js    optional serverless endpoint to upgrade the assistant
STRATEGY.md            ICP, objections, per-section rationale, SEO plan
.claude/devserver.py   local no-cache review server
```

Stylesheet and script links carry a `?v=N` query. **Bump it whenever you edit CSS
or JS**, or browsers will serve the old file.

## Running locally

```bash
python .claude/devserver.py 5187
```

Then open http://localhost:5187. This server sends `no-store` on every response,
so you never review a stale page. It is for review only — do not deploy it.

## Design

Typefaces: **Jost** for headings (the wordmark's typeface) and **Hanken Grotesk**
for running text. Emphasis inside headings is carried by gold colour rather than
italic.

Palette follows the Desert Peaks logo: `#0E0E0F` obsidian, `#1C1A17` charcoal,
`#F1EBDF` ivory, `#D6B26B` gold, `#8B857B` smoke. Every text pair was checked
against WCAG AA and every non-text UI element against 3:1.

Logo files live in `assets/img/desert-peaks-*` (SVG with outlined lettering, plus
PNG social and icon images). The stock background videos are warmed with a CSS
filter to sit with the gold palette.

Motion respects `prefers-reduced-motion` throughout. Scroll reveals are
progressive enhancement: without JS, content renders at full opacity rather than
staying invisible.

## Investor assistant

`assets/js/chat.js` answers from a curated knowledge base built from this site's
own FAQ and disclosures. It runs entirely in the browser — no backend, no API key.

Guardrails are deliberate: it refuses personalised advice, refuses to guarantee
returns, and routes anything outside its knowledge to the principals. **Do not
relax these without counsel.**

To upgrade it to a real model, deploy `api-chat-example.js` as a serverless
function and set `window.SP_CHAT_ENDPOINT` before `chat.js` loads. The API key
stays server-side — never put one in `chat.js`, it is public.
