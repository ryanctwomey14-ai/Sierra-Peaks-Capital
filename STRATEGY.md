# Desert Peaks Capital — Website Strategy & Build Notes

Everything on this site derives from the decisions below. If you change the strategy, change the pages.

---

## 0. The constraint that shapes everything: securities law

A US fund raising from passive investors is almost certainly running a Reg D private placement, and which exemption you use dictates what the website is legally allowed to be.

| | **506(b)** | **506(c)** — what this site is built for |
|---|---|---|
| Public advertising of the offering | **Prohibited** | Permitted |
| Investor relationship | Must pre-exist the offer | No pre-existing relationship needed |
| Accreditation | Self-certification allowed | **Third-party verification required** |
| Site can therefore be… | Education only. No returns, no deal specifics, no "invest now." | Public strategy, track record, targets — with documents gated |

**This site assumes 506(c).** It publicly discusses strategy, realised results and target returns, and gates the PPM, subscription documents and per-deal projections behind verification.

**If your counsel puts you on 506(b) instead**, you must change: remove target returns and the realised-results tables from public pages, retitle `invest.html` to a relationship-building "join our investor list" flow, and add a waiting period before any offer. Do not skip this — general solicitation under 506(b) blows the exemption.

Every page footer carries the offer disclaimer, the 506(c) notice, the risk statement and the "not an adviser" language. `disclosures.html` carries the long form. **Have securities counsel review all of it before launch — the templates are a starting point, not sign-off.**

---

## 1. The ideal customer

### Primary ICP — "the capped-out professional"

The person who has already won the income game and discovered that winning it does not automatically produce wealth.

| Attribute | Profile |
|---|---|
| Age | 38–58 |
| Household income | $250k–$750k |
| Net worth | $1.5M–$8M, most of it in equities and home equity |
| Occupations | Physicians, dentists, specialists; senior tech ICs and managers with RSUs; attorneys; business owners; engineers; airline pilots |
| Financial state | 401(k), backdoor Roth and HSA all maxed by mid-year. $250k–$2M sitting in a taxable brokerage account. Effective tax rate 32–45% |
| Real estate experience | Often owns 1–3 single-family rentals and is quietly sick of them |
| Cheque size | $50k–$250k, intending to spread across 3–5 sponsors |
| Where they are | Nationwide, concentrated in high-cost metros (CA, NY, WA, MA, CO, TX) |
| Where they learn | White Coat Investor, BiggerPockets, Wealth Formula, Best Ever CRE, peers at work |

**Defining psychology:** they are competent people who feel amateur in this one domain. They do not want to be sold. They want to be *equipped to decide*, and they will punish anything that smells like a pitch.

### Secondary ICPs (worth dedicated paths, not full redesigns)

1. **The 1031 exchange seller** — the highest-intent traffic in this entire category. A 45-day identification clock is running and they are frightened. They convert faster than anyone else. There is a dedicated option in the contact and investor forms, and a "clock running" timeline choice. **Recommended next build: a standalone `1031-exchange.html`.**
2. **The self-directed IRA / solo 401(k) investor** — needs UBIT mechanics and custodian logistics answered before they will move. Covered in the FAQ.
3. **The RIA / family office allocator** — $500k–$5M cheques, wants institutional reporting and a data room. Different sales motion; do not let it distort the main site.

### Who to actively repel

Non-accredited investors, anyone who needs the money inside the hold period, and anyone shopping purely on headline IRR. The site says so out loud in several places. Repelling the wrong lead is the cheapest thing this site does.

---

## 2. Pain, triggers, objections, outcomes

### Pain points, ranked by emotional intensity

1. **"My net worth moves on news I can't control."** Volatility as a felt loss of agency.
2. **"I have no shelters left and my tax bill is brutal."** The single strongest motivator in this segment.
3. **"I'm trading hours for money and I can't buy more hours."** Acute for physicians and attorneys.
4. **"I tried being a landlord — it's a second job."** Not theoretical. They have the scar.
5. **"I can't tell a good sponsor from a bad one."** The sophistication gap, and the reason most of them stall.
6. **"Inflation is eating my cash and bonds did nothing."**
7. **"I don't actually know if I can retire on schedule."**

### Buying triggers — these are events, not moods

Marketing to this segment fails when it targets a *persona* instead of a *moment*.

- A liquidity event: RSU vest, business sale, bonus, inheritance, home sale
- **A 1031 exchange clock starting** — the sharpest trigger there is
- **Tax bill shock in March/April** — drives the Q1 and Q4 search spikes on cost segregation and depreciation
- Selling a rental, or firing a property manager
- A market drawdown or a frightening headline
- **Peer proof** — a colleague mentions their passive deal at work
- Age milestones: turning 45 or 50, a child starting college
- Finishing a book or podcast series on passive income

**Implication:** publish on a Q4/Q1 tax cadence, and make the 1031 path unmissable.

### Objections, in the order they actually surface

1. Who are you, and why would I wire you $100,000? *(always first)*
2. What is your real track record — including the deals that failed?
3. My money is locked up for years. What if I need it?
4. What happens if the market drops, or rates rise again?
5. How do you actually get paid? What are the fees really?
6. Do you have your own money in this?
7. What are the tax consequences? Will my K-1 be late again?
8. Am I even accredited?
9. What is the minimum, and is that too much of my net worth?
10. How do I know this isn't a Ponzi scheme?
11. **Syndicators are blowing up in the news — isn't this the worst possible time?** *(the live 2023–2026 objection; ignoring it is fatal)*

Every one of these is answered explicitly somewhere on the site. See the mapping in §5.

### Desired outcomes

Passive quarterly income · a materially lower tax bill via depreciation · a 1.9–2.3× multiple over a 3–7 year hold · diversification away from equities · an inflation hedge · a credible path to optional work · and — quietly but genuinely — **the identity of being the kind of investor with access to institutional deals.**

---

## 3. Site map

```
PUBLIC LAYER  (SEO + credibility)
├── /                      Home — the full argument in one scroll
├── /why-multifamily       Education pillar. Ranks, and disarms objection 11
├── /strategy              Buy box, markets, business plan, risk rules, waterfall
├── /track-record          Full history + the underperforming deal, in full
├── /about                 The two partners. Answers objection 1
├── /insights              Article hub + lead magnet
└── /faq                   Long-form objection handling

CONVERSION LAYER
├── /book-a-call           Scheduling page ← the nav CTA target
├── /invest                Accreditation qualifier → call  ← the money page
└── /contact               Low-commitment question path

LEGAL LAYER
├── /disclosures           Risk factors, performance and forward-looking notices
└── /privacy               Privacy policy + terms of use

RECOMMENDED NEXT
├── /1031-exchange         Highest-intent segment, currently unserved
├── /insights/<article>    Six article stubs exist as cards; give each a page
└── /portal                Gated investor portal (statements, K-1s, reports)
```

### Navigation rationale

Primary nav is **Home · Strategy · Why Multifamily · About**, plus a persistent brass **Learn More** button pointing at `/book-a-call`.

- **Four items, deliberately.** A short nav concentrates attention on the CTA. Track Record and Insights were pulled from the bar at the client's direction — **both pages still exist** and are reached from the footer, the hero's secondary CTA and inline links throughout.
- ⚠️ **Watch this one.** Track record is the answer to objection 2, the most common objection in this category. It is now two clicks from the homepage instead of one. If enquiry quality drops, restoring it to the nav is the first thing to try.
- **The CTA is a filled button in a nav of plain text links.** One primary action per screen — the button is the only filled element in the bar.
- **FAQ, Contact and legal live in the footer only.** They are destinations people seek deliberately.
- The nav is transparent over the hero and solidifies on scroll, so the hero reads full-bleed without losing persistent access to the CTA.

---

## 4. The user journey

This audience does not convert on one visit. Typical path is 3–6 sessions over 2–8 weeks.

| Stage | State of mind | Entry point | Job of the page | Exit |
|---|---|---|---|---|
| **1. Problem-aware** | "I'm overtaxed and over-exposed to stocks" | Organic search, podcast, peer | Name the pain more precisely than they can | Read a second page |
| **2. Solution-aware** | "Apartments might be the answer" | `/why-multifamily`, an article | Teach the mechanism honestly, including weaknesses | Trust the source |
| **3. Sponsor-evaluating** | "Are *these* people any good?" | `/track-record`, `/about` | Show the miss. Show the co-investment | Download the checklist |
| **4. Objection-resolving** | "What about liquidity, fees, taxes, 2008?" | `/faq`, `/strategy` | Answer without flinching | Request access |
| **5. Qualifying** | "Am I eligible, and is this for me?" | `/invest` | Qualify honestly in both directions | Book the call |
| **6. Diligence** | "Show me the documents" | Verification → gated file | Total transparency | Subscribe |

**The conversion event this site optimises for is the 30-minute call, not the wire.** Nobody wires six figures from a website. Treating the call as the goal is what makes the honesty affordable.

---

## 5. Homepage, section by section

Every section has one job, one objection it kills, and one reason it improves conversion.

| # | Section | Job | Objection killed | Why it converts |
|---|---|---|---|---|
| 1 | **Hero** — *"Building wealth through strategic multifamily investments."* | Emotional thesis in one line + dual CTA + four target figures over full-bleed video | — | Names the outcome (wealth) and the method (strategic multifamily) in one line, so an investor knows within two seconds whether this is their category. Dual CTA serves both temperatures: ready ("Speak with our team") and researching ("Our strategy"). The rail states target IRR, cash-on-cash, equity multiple and hold period. |
| 3 | **The problem** — *"You out-earned your options."* | Agitate with precision | — | Four numbered pains in the reader's own words. Naming the pain more accurately than they can is the fastest credibility mechanism that exists. Item 03 ("you already tried being the landlord") is the empathy hook that separates you from generic finance copy. |
| 4 | **Three returns** | The core value proposition | — | Reframes one asset as three simultaneous benefits: spendable income, sheltered income, quiet equity. "Income you don't pay tax on" is the highest-converting single card on the page for this segment. |
| 5 | **Why apartments** | Authority and market thesis | 4, 11 | Four structural statistics + a pull quote. Establishes that returns come from *demographics and mechanism*, not from the sponsor being clever. |
| 6 | **How it works** | Remove process anxiety | 3, 8 | Four steps, then explicitly "and then nothing." Uncertainty about *process* stalls more high-ticket deals than doubt about the product. |
| 7 | **Track record** | Hard proof | 2 | The complete table — realised and active — with the underperformer left in and called out by name in a callout box directly beneath. **This is the highest-trust element on the site.** Publishing your worst deal is a credibility signal a competitor cannot cheaply copy. |
| 8 | **Comparison** | Frame the real alternatives | 3, 5 | Four columns: Desert Peaks / public REIT / your own rental / index fund. **We deliberately lose two rows** (liquidity, control). Conceding real weaknesses makes the wins believable, and it pre-qualifies out the people who would have churned at month thirty. |
| 9 | **Team** | Put faces to the wire | 1, 6 | Real photographs, real names, specific credentials, both partners' responsibilities separated. Objection 1 is answered by a face, not a paragraph. |
| 10 | **Testimonials** | Peer proof | 1 | Placeholders sized for real quotes. Peer proof is the strongest trigger in this segment because "a colleague mentioned it" is how most of them arrive. |
| 11 | **Risk & transparency** | Disarm and qualify | 3, 4, 7 | Counterintuitive but decisive: stating the four real downsides *before* the CTA raises conversion on the leads you want and suppresses the leads you don't. Also a securities-law necessity, so it does double duty. |
| 12 | **FAQ** | Long-tail objection handling | 5, 6, 8, 9, 11 | Seven accordions covering fees, co-investment, retirement accounts and the "syndicators are failing" question head-on. Answering the hardest question in public is a positioning move. |
| 13 | **Final CTA** | Convert | — | Single focused action, restated no-obligation promise, and an explicit privacy commitment to reduce form anxiety. |
| 14 | **Footer** | Compliance + secondary navigation | — | Full Reg D disclosures on every page, which is a legal requirement and, for this audience, a further trust signal. |

**Rhythm.** Sections alternate night → paper → night → white → dusk. Each tonal switch acts as a chapter break, which measurably improves scroll depth on long pages, and the dark bands frame the two highest-stakes moments (comparison and final CTA).

---

## 6. CTA strategy

**One primary action, repeated: request investor access.** Every secondary CTA is a lower-commitment step on the same path.

| Placement | CTA | Temperature |
|---|---|---|
| Nav (persistent) | Learn More → `/book-a-call` | Any |
| Hero primary | Review the current offering | Warm |
| Hero secondary | See the track record | Cold |
| After value prop | How the three returns compound | Cold |
| After process | Start with step one | Warm |
| After track record | Read the full case study | Evaluating |
| After risk section | Read the complete risk disclosures | Evaluating |
| Insights | Send me the checklist *(2 fields)* | Cold |
| Final band | Request investor access / Ask a question first | Warm / Hesitant |

**On form length — a deliberate split:**

- **Lead magnet: 2 fields.** Pure volume play at the top of funnel.
- **Investor access: 9 fields including accreditation basis, cheque size and timeline.** This *intentionally* violates the "keep forms short" rule. For a $50k minimum, friction is a feature: it qualifies, it signals seriousness in both directions, and it means the first call is informed rather than exploratory. Optimise this form for *lead quality*, never for submission count.

The accreditation question includes an honest **"None of these yet"** option that routes to an education list rather than pretending. That is both a compliance safeguard and a long-game asset.

---

## 7. Trust elements inventory

Deployed deliberately, in rough order of power for this audience:

1. **The published underperformer** (`track-record.html`) — the single strongest asset on the site
2. **Named principals with photographs and specific, checkable backgrounds**
3. **$4.2M sponsor co-investment**, stated repeatedly with terms ("identical, no preferential liquidation")
4. **Full fee and waterfall disclosure** including the order of payment, not just percentages
5. **The conceded losses in the comparison table**
6. **"How to verify we are legitimate"** in the FAQ — telling people to check EDGAR, call references and confirm escrow
7. Third-party accreditation verification, audited financials, independent third-party reports
8. Named risk section placed *before* the CTA, not after
9. A hard K-1 delivery date (15 March)
10. A phone number a partner answers

**Placeholder content flagged for replacement before launch:** testimonials (3), all performance figures and property names, article bodies, address and phone number.

---

## 8. SEO recommendations

**Positioning:** you will not outrank Fundrise or CrowdStreet on head terms, and you should not try. Win on **long-tail intent** and **local-plus-asset** terms where the searcher is already qualified.

### Priority target queries

| Cluster | Example queries | Target page |
|---|---|---|
| Education | passive multifamily investing, apartment syndication explained, is multifamily a good investment | `/why-multifamily` |
| **Tax (highest value)** | cost segregation apartment investment, bonus depreciation passive investor, K-1 real estate losses, depreciation recapture | Article + `/faq#tax` |
| **1031 (highest intent)** | 1031 exchange into apartment syndication, DST vs syndication, 45-day identification | **Build `/1031-exchange`** |
| Diligence | how to vet a real estate syndicator, questions to ask a sponsor, is my syndication safe | Article + `/faq` |
| Objection | apartment syndications failing, capital call syndication, bridge debt risk | Article + `/faq` |
| Retirement vehicles | self-directed IRA apartment investing, UBIT leveraged real estate, solo 401k real estate | `/faq#tax` |
| Geographic | Boise multifamily investment, Utah apartment investing, Mountain West real estate fund | `/strategy` |

### Already implemented

Unique title and meta description per page · single `<h1>` per page · canonical URLs · Open Graph and Twitter cards · `FinancialService` JSON-LD on the homepage · semantic heading hierarchy · descriptive alt text · `sitemap.xml` and `robots.txt` · fast static HTML with no framework overhead · fully responsive.

### Before and after launch

1. Replace `sierrapeakscapital.com` throughout with the live domain (canonicals, OG tags, sitemap, robots)
2. Add `FAQPage` JSON-LD to `/faq` — it wins rich results in this category
3. Add `Article` schema to each insight once written
4. Build the six stub articles into real pages, one per pillar
5. Publish on a **Q4/Q1 tax cadence** to catch the March/April and year-end planning spikes
6. Compress the two headshots to WebP (currently 388KB and 292KB — the largest payload on the site) and serve at 2× display size
7. Google Business Profile for the Boise office; pursue podcast appearances over backlink outreach — this audience discovers sponsors through audio
8. Do **not** run paid search on "accredited investor" terms before counsel confirms your 506(c) posture

---

## 9. Design direction

**Concept: "Blue Hour."** Deep dusk, warm interior light. The homepage hero plays `assets/video/desert-hero.mp4` full-bleed behind the headline; the hand-built SVG ridgeline sits beneath it as the fallback for a failed load, a blocked autoplay, or a reduced-motion preference.

### Tokens

| Role | Value | Use |
|---|---|---|
| Night | `#0A121C` | Primary dark surface |
| Night-2 | `#0E1927` | Trust bar, table headers |
| Dusk | `#16283C` | Secondary dark surface |
| Paper | `#EFF1F4` | Cool light surface — deliberately *not* the warm cream that reads as AI-default |
| White | `#FFFFFF` | Cards, elevated surfaces |
| Brass | `#C08B3E` | Primary CTA fill |
| Brass lit | `#E8B563` | Accent on dark |
| Accent UI | `#A87528` | Icons, focus rings on light *(contrast-corrected)* |

### Typography

**One family, site-wide: Archivo** (variable, width + weight axes), matched to the logo.

- **Display** — `wght 700`, `wdth 115`. The wide squared geometry echoes the `SIERRA PEAKS` wordmark directly.
- **Body** — `wght 400`, `wdth 100`.
- **Labels, buttons, table headers** — uppercase, letterspaced, `wdth 105–112`, reproducing the `C A P I T A L` treatment.
- Tabular figures throughout so financial tables don't shift.

Emphasis inside headlines is carried by **colour, not italic** — a geometric grotesque has no elegant italic, and the wordmark has no italic form at all.

*Note: an earlier draft paired Bodoni Moda with Archivo. The serif was removed at the client's direction in favour of a single logo-matched family. Display sizes were reduced ~25% at the same time, because a bold expanded grotesque carries far more visual weight per em than a Didone.*

### Layout and detail

Editorial asymmetric grid, 1240px max · hairline rules instead of card shadows · 2px border radius maximum · generous section rhythm (`clamp(4.5rem, 3rem + 7vw, 9rem)`) · alternating tonal bands · data tables treated as designed objects rather than dumped output.

### Motion

Deliberately restrained. Marketing pages sit in the "rare / first-time" tier, so there is a delight budget — spent in exactly one place.

| Element | Purpose | Ingredients |
|---|---|---|
| Hero load sequence | Explanation | CSS animation, `transform`/`opacity`, 900ms, `cubic-bezier(.23,1,.32,1)`, 90ms stagger |
| **Window glow (signature)** | Explanation | CSS animation, `opacity` only, 60ms stagger across 56 windows, ~2.2s total |
| Scroll reveals | Prevent jarring change | IntersectionObserver + transition, 700ms, 70ms stagger, fires once |
| Stat count-up | State indication | rAF with ease-out cubic, tabular figures prevent layout shift |
| Accordion | State indication | JS-measured `height` transition, 250ms — the sanctioned exception, since there is no transform equivalent |
| Nav solidify | Feedback | `background-color` + `border-color`, 350ms |

`prefers-reduced-motion` is honoured throughout — transforms drop, opacity fades remain. Hover effects are gated behind `@media (hover:hover) and (pointer:fine)`. No `transition: all`, no `ease-in`, no `scale(0)`.

### Accessibility

Every text pair verified against WCAG AA and every non-text UI element against 3:1 — 23 of 23 pairs pass. Skip link, visible focus rings, `aria-expanded` on all disclosures, labelled form fields with inline validation on blur, `role="alert"` errors, minimum 44px touch targets on mobile, no horizontal scroll at 375px. Scroll reveal is progressive enhancement: without JS, content renders at full opacity rather than staying invisible.

---

## 10. Build notes & handoff

**Stack:** plain HTML, CSS and vanilla JS. No build step, no dependencies, no framework. Deploys to any static host (Netlify, Vercel, Cloudflare Pages, S3). Editable by anyone who can read HTML.

```
/                       11 HTML pages
/assets/css/site.css    design system + all components
/assets/js/site.js      nav, reveals, count-up, accordion, form validation
/assets/img/            logo + two headshots
sitemap.xml robots.txt
```

Stylesheet and script links carry a `?v=5` cache-busting query — **bump it whenever you edit CSS or JS.**

### Before launch — required

1. **Securities counsel review of every page**, particularly `disclosures.html`, `privacy.html`, all performance figures and the 506(b)/506(c) determination
1. **Confirm the hero's target-return disclosure is sufficient.** The hero rail publishes target IRR, cash-on-cash, equity multiple and hold period. The inline disclaimer under it was removed at the client's direction; the targeted-returns and past-performance language now appears only in the footer, on every page. Counsel should confirm that placement is adequate for a 506(c) offering.
2. **Replace all placeholder data:** performance figures, property names and markets, AUM and unit counts, the $4.2M co-investment figure, fee percentages, testimonials, address, phone, email
3. **Connect both forms.** They validate client-side and show a success state, but do not submit anywhere. Wire the submit handler in `assets/js/site.js` to your CRM or form endpoint
4. Replace `sierrapeakscapital.com` with the live domain everywhere
5. Convert headshots to WebP
6. Add analytics and a cookie notice consistent with the privacy policy

### Recommended next build, in priority order

1. `/1031-exchange` — the highest-intent traffic in this category is currently unserved
2. The six insight articles as real pages
3. Gated investor portal
4. `FAQPage` schema on `/faq`
5. Paste a real scheduling embed (Calendly / SavvyCal / HubSpot Meetings) into the `.embed-slot` container in `book-a-call.html`
