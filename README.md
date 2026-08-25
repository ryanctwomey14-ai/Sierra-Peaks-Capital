# Sierra Peaks Capital — website

Static marketing site for a private multifamily real estate sponsor. Plain HTML,
one CSS file, two vanilla JS files. No build step, no dependencies, no framework.

**Live draft:** https://ryanctwomey14-ai.github.io/Sierra-Peaks-Capital/

---

## ⚠️ This is a review draft, not a launch build

Every page carries `<meta name="robots" content="noindex, nofollow">` and
`robots.txt` disallows all crawlers, so the placeholder financial figures below
cannot be indexed under the Sierra Peaks name. **Remove both before launch.**

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
5. **Two figures conflict.** Hold period reads 3–7 years on the homepage and FAQ,
   3–5 years on the strategy page. The stated targets are also not internally
   consistent: 15–20% IRR over a 7-year hold implies roughly 2.7–3.6×, well above
   the stated 1.8–2.2× multiple. Reconcile before publishing.
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

One typeface site-wide: **Archivo** (variable width and weight), set at `wdth 115`
for display to match the geometry of the wordmark. Emphasis inside headings is
carried by brass colour rather than italic, since the mark has no italic form.

Palette is "blue hour" — `#0A121C` night, `#16283C` dusk, `#EFF1F4` paper,
`#C08B3E` brass. Every text pair was checked against WCAG AA and every non-text
UI element against 3:1.

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
