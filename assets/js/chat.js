/* ============================================================
   Sierra Peaks Capital — investor assistant
   ------------------------------------------------------------
   Two modes:

   1. LOCAL (default). Answers from the curated knowledge base below,
      which is drawn from this site's own FAQ, strategy and disclosure
      pages. No network, no API key, works on static hosting.

   2. LIVE LLM. Set window.SP_CHAT_ENDPOINT to your own server route
      (see /api-chat-example.js). The key stays on your server — never
      put an API key in this file, it is public.

   Guardrails are deliberate and should not be relaxed without counsel:
   no personalised advice, no performance promises, no offer of
   securities. Anything outside the knowledge base routes to a call.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CALL_URL = 'book-a-call.html';

  /* ---------------- knowledge base ---------------- */
  // weight: how strongly a term implies this intent (2 = distinctive)
  var KB = [
    { id: 'greet', w: { hi: 2, hello: 2, hey: 2, 'good morning': 2, 'good afternoon': 2 },
      a: 'Hello. I can answer questions about how Sierra Peaks invests, what the process looks like, fees, tax treatment and eligibility. What would you like to know?' },

    { id: 'minimum', w: { minimum: 2, min: 1, 'how much': 2, smallest: 2, invest: 1, commitment: 2, ticket: 2 },
      a: 'The minimum commitment is $50,000 per offering. Most limited partners commit between $100,000 and $250,000. There is no maximum, though we may cap any single investor’s share of a raise to keep the partnership diversified.' },

    { id: 'accredited', w: { accredited: 3, accreditation: 3, qualify: 2, eligible: 2, eligibility: 2, verify: 2, verified: 2, 'net worth': 2, income: 1 },
      a: 'You qualify as an accredited investor if you earned over $200,000 individually or $300,000 jointly in each of the last two years and expect the same this year, or if your net worth excluding your primary residence exceeds $1 million. An active Series 7, 65 or 82 licence also qualifies you.\n\nBecause this is a Rule 506(c) offering, self-certification is not sufficient — an independent third party verifies your status. We only receive a pass or fail result, never your underlying financial documents.' },

    { id: 'returns', w: { return: 2, returns: 2, irr: 3, multiple: 2, target: 2, yield: 2, 'cash on cash': 3, performance: 1, projection: 2 },
      a: 'We underwrite to a 1.9× to 2.3× equity multiple with a 7–10% annual cash-on-cash distribution once an asset is stabilised.\n\nThese are underwriting targets derived from our assumptions — not guarantees, and not a prediction of actual results. Our realised results across four full-cycle assets have ranged from 1.41× to 2.14×. There is an illustrative calculator on the Investor Experience page if you would like to model a specific amount.' },

    { id: 'fees', w: { fee: 3, fees: 3, cost: 2, charge: 2, promote: 3, waterfall: 3, 'how do you make money': 3, split: 2 },
      a: 'A 1.5% acquisition fee on purchase price at closing, a 1.5% annual asset management fee on collected revenue, and a 25% performance promote on profits — but only after limited partners have received all of their capital back plus an 8% preferred return, compounded.\n\nThe order matters more than the percentages: we do not participate in the upside until you have been made whole and paid your preferred return first. Every fee is disclosed in full in the offering documents.' },

    { id: 'hold', w: { hold: 2, 'how long': 3, duration: 2, term: 2, timeline: 2, exit: 2, 'when do i get my money': 3, years: 1 },
      a: 'Each investment is structured with a defined exit strategy from the outset. Hold periods generally run three to seven years depending on the asset and market conditions.\n\nYou should treat the capital as committed for the full term — there is no secondary market and no redemption right.' },

    { id: 'liquidity', w: { liquid: 3, liquidity: 3, 'get out': 2, withdraw: 2, sell: 2, early: 2, redeem: 2, 'need the money': 3 },
      a: 'These interests are illiquid. There is no public market and none is expected to develop, and transfers require sponsor consent and are permitted only in limited circumstances such as estate planning.\n\nIf there is a realistic chance you will need this capital before the end of the hold period, this is the wrong investment for you and we would say so directly.' },

    { id: 'tax', w: { tax: 3, taxes: 3, 'k-1': 3, k1: 3, depreciation: 3, 'cost segregation': 3, recapture: 3, writeoff: 2, 'write off': 2, shelter: 2 },
      a: 'Real property is depreciated for tax purposes while the asset may appreciate. A cost segregation study accelerates part of that depreciation into the early years, and the resulting losses pass through to you on a Schedule K-1 — often showing a taxable loss in years that are simultaneously paying cash distributions.\n\nTwo honest caveats: depreciation is recaptured on sale, so this is deferral rather than elimination; and passive losses generally offset only passive income. Your own CPA is the right person to model this against your return — we are not tax advisers.' },

    { id: 'distributions', w: { distribution: 3, distributions: 3, 'cash flow': 2, paid: 2, payment: 2, quarterly: 2, monthly: 1, 'when do i get paid': 3 },
      a: 'Distributions are paid quarterly by ACH, within 30 days of each quarter end, to the account you nominate. On a stabilised acquisition they typically begin in the first full quarter after closing; on a heavier value-add project they may be deferred while capital goes into the building.\n\nDistributions come from cash flow and are not promised — they can be reduced or suspended if a property needs the capital.' },

    { id: 'strategy', w: { strategy: 3, 'what do you buy': 3, criteria: 2, 'buy box': 3, underwriting: 2, 'business plan': 2, 'value add': 2, approach: 2 },
      a: 'We acquire underperforming workforce apartment communities — generally 150 to 400 units, built 1985 to 2010, at Class B workforce rents — where there is a specific, measurable operational inefficiency to correct.\n\nEvery acquisition uses fixed-rate agency debt with a minimum five-year term, is underwritten on trailing three-month collections rather than projected rents, and carries twelve months of debt service in reserve at closing. The full criteria are on the Strategy page.' },

    { id: 'markets', w: { market: 2, markets: 2, where: 2, location: 2, city: 2, state: 2, geography: 2, region: 2 },
      a: 'We target emerging markets where growth is still ahead of pricing — areas with committed economic development, constrained new supply, deep rental demand, and population and job growth in the 1.5–2% range year over year.\n\nSpecific markets and submarkets under evaluation are discussed with verified accredited investors during diligence.' },

    { id: 'team', w: { who: 2, team: 3, founder: 3, principal: 2, austin: 3, lamberth: 3, dale: 3, harding: 3, background: 2, experience: 1 },
      a: 'Sierra Peaks Capital was founded by Austin Lamberth, who leads acquisitions and underwriting, with co-founder Dale Harding, who focuses on execution and asset management.\n\nBoth principals underwrite every acquisition personally and handle investor communication directly — there is no intermediary between you and the people making the decisions.' },

    { id: 'risk', w: { risk: 3, risks: 3, lose: 3, 'lose money': 3, safe: 2, danger: 2, downside: 3, 'worst case': 3, fail: 2, guarantee: 2 },
      a: 'This is a speculative investment and you can lose some or all of your capital. The principal risks are illiquidity, leverage — which magnifies losses as well as gains — real estate market conditions, operator and key-person risk, concentration, and the possibility that distributions are reduced or suspended.\n\nNothing here is guaranteed. The complete risk factors are set out on our Disclosures page and in the offering documents, and you should read them in full.' },

    { id: 'process', w: { process: 2, start: 2, begin: 2, 'how do i': 2, steps: 2, next: 2, apply: 2, subscribe: 2, onboarding: 2 },
      a: 'Four steps. First, a 30-minute call to understand your objectives — if this is not a fit, we say so then. Second, third-party accreditation verification. Third, you receive the full offering file: memorandum, underwriting model, third-party reports and operating agreement, to review for as long as you need. Fourth, you sign electronically and wire to a segregated escrow account.\n\nMost investors move from first call to funded in ten to fourteen days.' },

    { id: 'retirement', w: { ira: 3, '401k': 3, 'solo 401': 3, retirement: 3, custodian: 2, ubit: 3, 'self directed': 3, sdira: 3 },
      a: 'Yes — self-directed IRAs, solo 401(k)s, trusts and LLCs are all accepted, and we work with the major custodians regularly.\n\nOne caution worth raising early: a leveraged real estate investment inside an IRA can generate unrelated business taxable income, and the depreciation benefit is largely wasted inside an already tax-deferred account. A solo 401(k) is generally exempt from UBIT on leveraged real estate. Ask your CPA before choosing the vehicle.' },

    { id: '1031', w: { '1031': 3, exchange: 3, 'like kind': 3, dst: 2, 'capital gains': 2, '45 day': 3, deadline: 2 },
      a: '1031 exchange matters are time-sensitive — 45 days to identify and 180 to close. Structuring an exchange into a private placement has specific requirements, so the sooner we speak the more options remain open.\n\nPlease call +1 (775) 437-8854 directly rather than emailing, and say that a 1031 deadline applies.',
      cta: true },

    { id: 'reporting', w: { report: 2, reporting: 3, updates: 2, communication: 2, transparency: 2, statements: 2, portal: 2 },
      a: 'Quarterly distributions by ACH, quarterly asset-level reporting covering occupancy, collections, renovation progress and budget variance, audited annual financial statements, and an annual Schedule K-1.\n\nIf a property misses its budget you hear it that quarter with the cause and the plan — not smoothed into a year-end summary.' },

    { id: 'coinvest', w: { 'skin in the game': 3, coinvest: 3, 'co-invest': 3, 'your own money': 3, alignment: 2, aligned: 2 },
      a: 'Yes, on identical terms. The principals commit a minimum of 3% of every raise from their own capital, with no preferential treatment on distributions or liquidation. When a distribution is reduced, ours is reduced too.' },

    { id: 'structure', w: { fund: 2, structure: 2, syndication: 2, llc: 2, 'reg d': 3, '506': 3, partnership: 2, entity: 2 },
      a: 'Each acquisition is offered as a private placement under Rule 506(c) of Regulation D. Investors hold limited partnership interests in an entity that owns the specific property, which means you can evaluate each asset individually rather than committing to a blind pool.\n\nParticipation is limited to accredited investors whose status has been verified by an independent third party.' },

    { id: 'whymultifamily', w: { multifamily: 2, apartment: 2, apartments: 2, 'why real estate': 3, 'asset class': 2, 'why not': 2 },
      a: 'Apartments produce return through three independent mechanisms at once: current income from rent, tax-deferred treatment through depreciation, and equity appreciation driven by increasing net operating income.\n\nDemand is demographic rather than economic — it depends on how many households exist, not on employer or consumer confidence — and leases reset every twelve months, so income re-prices to inflation annually.' },

    { id: 'contact', w: { contact: 3, email: 3, phone: 3, call: 2, reach: 2, speak: 2, talk: 2, number: 2 },
      a: 'You can reach the principals directly at invest@sierrapeakscapital.com or +1 (775) 437-8854, Monday to Friday, 8am to 5pm Mountain Time.\n\nBoth principals monitor the inbox and respond within one business day.',
      cta: true },

    /* ---------- guardrails ---------- */
    { id: 'advice', guard: true, w: { 'should i invest': 4, 'should i': 3, 'is this right for me': 4, 'do you recommend': 4, 'what would you do': 4, 'is it a good investment': 4, advise: 3, advice: 3 },
      a: 'I am not able to give personalised investment advice, and Sierra Peaks is not a registered investment adviser. Whether this suits you depends on your tax position, liquidity needs and the rest of your portfolio — questions for you and your own adviser.\n\nWhat I can do is set out how the investment works so you can assess it properly, and the principals will give you a straight view on fit during an introductory call.',
      cta: true },

    { id: 'guarantee', guard: true, w: { guarantee: 4, guaranteed: 4, 'promise': 3, 'risk free': 4, 'sure thing': 3, 'how much will i make': 4 },
      a: 'Nothing here is guaranteed, and I would be careful of anyone in this industry who tells you otherwise. Our stated figures are underwriting targets based on assumptions that may prove incorrect, and past performance does not indicate future results. You can lose some or all of your capital.\n\nThe complete risk factors are on our Disclosures page.' },

    { id: 'thanks', w: { thanks: 2, thank: 2, cheers: 2, appreciate: 2, bye: 2, goodbye: 2 },
      a: 'You are welcome. If anything else comes up, I am here — and the principals are happy to take your questions directly on a call.' }
  ];

  var FALLBACK = 'That one is better answered by a person than by me — I would rather not guess on something that affects a real investment decision.\n\nThe principals answer these directly, usually within a business day. You can also reach them at invest@sierrapeakscapital.com or +1 (775) 437-8854.';

  var NUDGES = [
    null,
    null,
    'If it would help to go through this properly, a 30-minute call with the principals is usually the fastest way.',
    'Happy to keep going — though at this point a short call would probably answer more than I can.'
  ];

  /* ---------------- matching ---------------- */
  function normalise(s) {
    return ' ' + s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }

  function match(input) {
    var q = normalise(input);
    var best = null, bestScore = 0;
    KB.forEach(function (item) {
      var score = 0;
      Object.keys(item.w).forEach(function (term) {
        if (q.indexOf(' ' + term) !== -1 || q.indexOf(term + ' ') !== -1) score += item.w[term];
      });
      // A guardrail must win a tie against an informational answer — being
      // asked to guarantee returns is a compliance moment, not a FAQ lookup.
      if (score > 0 && item.guard) score += 3;
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return bestScore >= 2 ? best : null;
  }

  /* ---------------- markup ---------------- */
  var MARK = 'assets/img/sierra-peaks-mark.png';
  // pages all sit at the root, so a plain relative path is fine
  var root = document.createElement('div');
  root.className = 'spchat';
  root.innerHTML =
    '<button class="spchat__launch" type="button" aria-expanded="false" aria-controls="spchat-panel"' +
    ' aria-label="Open the Sierra Peaks investor assistant">' +
      '<img class="spchat__mark" src="' + MARK + '" alt="" width="403" height="305">' +
      '<span class="spchat__close" aria-hidden="true"></span>' +
    '</button>' +
    '<div class="spchat__panel" id="spchat-panel" role="dialog" aria-modal="false"' +
    ' aria-label="Sierra Peaks investor assistant" hidden>' +
      '<div class="spchat__head">' +
        '<img src="' + MARK + '" alt="" width="403" height="305">' +
        '<div><strong>Investor assistant</strong><span>Typically replies instantly</span></div>' +
        '<button class="spchat__x" type="button" aria-label="Close assistant">&times;</button>' +
      '</div>' +
      '<div class="spchat__log" id="spchat-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="spchat__chips" id="spchat-chips"></div>' +
      '<form class="spchat__form" autocomplete="off">' +
        '<label class="visually-hidden" for="spchat-input">Ask a question</label>' +
        '<input id="spchat-input" type="text" placeholder="Ask about minimums, fees, tax…" maxlength="300">' +
        '<button type="submit" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</button>' +
      '</form>' +
      '<p class="spchat__fine">Automated assistant. Not investment, legal or tax advice, and not an offer of securities. ' +
      '<a href="disclosures.html">Disclosures</a>.</p>' +
    '</div>';
  document.body.appendChild(root);

  var launch = root.querySelector('.spchat__launch');
  var panel = root.querySelector('.spchat__panel');
  var log = root.querySelector('#spchat-log');
  var chips = root.querySelector('#spchat-chips');
  var form = root.querySelector('.spchat__form');
  var input = root.querySelector('#spchat-input');
  var closeX = root.querySelector('.spchat__x');

  var turns = 0;
  var opened = false;

  function bubble(who, text, withCta) {
    var wrap = document.createElement('div');
    wrap.className = 'spchat__msg spchat__msg--' + who;
    text.split('\n\n').forEach(function (para) {
      var p = document.createElement('p');
      p.textContent = para;
      wrap.appendChild(p);
    });
    if (withCta) {
      var a = document.createElement('a');
      a.className = 'spchat__cta';
      a.href = CALL_URL;
      a.textContent = 'Schedule a call';
      wrap.appendChild(a);
    }
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function typing() {
    var t = document.createElement('div');
    t.className = 'spchat__msg spchat__msg--bot spchat__typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }

  var SUGGESTIONS = [
    ['Minimum investment?', 'What is the minimum investment?'],
    ['Target returns', 'What returns do you target?'],
    ['Fees', 'What fees do you charge?'],
    ['Tax treatment', 'How does the tax treatment work?'],
    ['Am I eligible?', 'Am I an accredited investor?']
  ];

  function renderChips() {
    chips.innerHTML = '';
    SUGGESTIONS.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'spchat__chip';
      b.textContent = s[0];
      b.addEventListener('click', function () { send(s[1]); });
      chips.appendChild(b);
    });
  }

  /* ---------------- optional live LLM ---------------- */
  function askEndpoint(question) {
    return fetch(window.SP_CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question })
    }).then(function (r) {
      if (!r.ok) throw new Error('bad status');
      return r.json();
    }).then(function (d) { return d.answer; });
  }

  function respond(question) {
    var t = typing();
    var finish = function (text, cta) {
      t.remove();
      turns++;
      var nudge = NUDGES[Math.min(turns, NUDGES.length - 1)];
      var showCta = cta || turns >= 3;
      bubble('bot', nudge ? text + '\n\n' + nudge : text, showCta);
    };

    if (window.SP_CHAT_ENDPOINT) {
      askEndpoint(question)
        .then(function (a) { finish(a, false); })
        .catch(function () {
          var hit = match(question);
          finish(hit ? hit.a : FALLBACK, hit ? !!hit.cta : true);
        });
      return;
    }

    var hit = match(question);
    window.setTimeout(function () {
      finish(hit ? hit.a : FALLBACK, hit ? !!hit.cta : true);
    }, reduce ? 0 : 420 + Math.random() * 320);
  }

  function send(text) {
    var q = (text || input.value).trim();
    if (!q) return;
    bubble('you', q);
    input.value = '';
    chips.hidden = true;
    respond(q);
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); send(); });

  /* ---------------- open / close ---------------- */
  function open() {
    panel.hidden = false;
    // next frame so the transition runs from the collapsed state
    requestAnimationFrame(function () { root.classList.add('is-open'); });
    launch.setAttribute('aria-expanded', 'true');
    launch.setAttribute('aria-label', 'Close the Sierra Peaks investor assistant');
    if (!opened) {
      opened = true;
      renderChips();
      bubble('bot', 'Hello. I can answer questions about how Sierra Peaks invests — minimums, fees, tax treatment, the process and eligibility.\n\nWhat would you like to know?');
    }
    window.setTimeout(function () { input.focus(); }, reduce ? 0 : 220);
  }

  function close() {
    root.classList.remove('is-open');
    launch.setAttribute('aria-expanded', 'false');
    launch.setAttribute('aria-label', 'Open the Sierra Peaks investor assistant');
    // Drive the hide off transitionend rather than a timer — background tabs
    // throttle timers, which would leave the panel in the DOM.
    var hide = function () { panel.hidden = true; };
    if (reduce) {
      hide();
    } else {
      var done = function (e) {
        if (e.target !== panel || e.propertyName !== 'opacity') return;
        panel.removeEventListener('transitionend', done);
        hide();
      };
      panel.addEventListener('transitionend', done);
      window.setTimeout(function () {            // fallback if the event never fires
        panel.removeEventListener('transitionend', done);
        hide();
      }, 600);
    }
    launch.focus();
  }

  launch.addEventListener('click', function () {
    root.classList.contains('is-open') ? close() : open();
  });
  closeX.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  // keep focus inside the panel while it is open
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = panel.querySelectorAll('a[href], button, input');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
