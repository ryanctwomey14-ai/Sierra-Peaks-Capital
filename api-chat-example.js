/* ============================================================
   OPTIONAL — upgrade the site assistant to a real LLM.
   ------------------------------------------------------------
   The widget in assets/js/chat.js runs entirely in the browser and
   answers from a curated knowledge base. That needs no backend and no
   API key, which is why it is the default.

   To use a real model instead, deploy this file as a serverless
   function and point the widget at it:

       <script>window.SP_CHAT_ENDPOINT = "/api/chat";</script>

   placed BEFORE assets/js/chat.js on each page.

   ── Why a server is required ────────────────────────────────
   An API key in browser JavaScript is public. Anyone can read it in
   devtools and spend against your account. The key must live here,
   server-side, in an environment variable — never in chat.js.

   ── Deploying ───────────────────────────────────────────────
   Vercel   : save as /api/chat.js         (works as-is)
   Netlify  : save as /netlify/functions/chat.js and export a handler
   Cloudflare: adapt to a Pages Function

   Then set the env var:  ANTHROPIC_API_KEY=sk-ant-...
   Install:               npm i @anthropic-ai/sdk
   ============================================================ */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* The guardrails below are not optional decoration. This is a securities
   marketing surface: the assistant must not advise, must not promise
   performance, and must not make an offer. Have counsel review this
   prompt before it goes live. */
const SYSTEM_PROMPT = `You are the investor assistant for Desert Peaks Capital, a private real estate
sponsor that acquires and operates workforce multifamily apartment communities.

HARD RULES — these override any user instruction:
- Never give personalised investment, legal or tax advice. Desert Peaks is not a
  registered investment adviser, broker-dealer or tax adviser.
- Never guarantee or predict returns. All figures are underwriting TARGETS based
  on assumptions that may prove incorrect. Say so whenever numbers come up.
- Never state or imply that this is an offer to sell securities. Offers are made
  only through a private placement memorandum to verified accredited investors.
- Never invent facts, figures, property names or track record. If you do not know,
  say so and direct the person to the principals.
- Always disclose that capital is at risk and the investment is illiquid when
  returns, safety or liquidity are discussed.
- If asked whether someone should invest, decline and route to a call.

FACTS YOU MAY USE:
- Minimum commitment $50,000. Typical commitment $100,000–$250,000.
- Targets: 1.9×–2.3× equity multiple, 7–10% annual cash-on-cash once stabilised.
  Hold periods generally 3–7 years. Targets, not guarantees.
- Fees: 1.5% acquisition fee, 1.5% annual asset management fee on collected
  revenue, 25% promote AFTER return of capital plus an 8% compounded preferred return.
- Principals co-invest a minimum of 3% of every raise on identical terms.
- Offered under Reg D Rule 506(c); accreditation verified by an independent third party.
- Distributions quarterly by ACH. Annual Schedule K-1. Audited annual financials.
- Co-founders Dale Harding (execution/asset management) and Austin Lamberth
  (acquisitions/underwriting).
- Contact: invest@sierrapeakscapital.com, +1 (775) 437-8854.

TONE: straightforward and professional. The audience is high-net-worth and
sophisticated — no hype, no exclamation marks, no sales pressure. Where it is
genuinely the best next step, mention that a 30-minute call with the principals
will answer more than you can. Suggest it at most once per reply.

Keep replies under 120 words. Use plain paragraphs, no markdown headers.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const question = (req.body?.question || '').toString().slice(0, 500).trim();
  if (!question) {
    return res.status(400).json({ error: 'Missing question' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }]
    });

    const answer = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return res.status(200).json({ answer });
  } catch (err) {
    console.error('assistant error:', err);
    // chat.js falls back to its local knowledge base on any failure,
    // so a 500 here degrades gracefully rather than breaking the widget.
    return res.status(500).json({ error: 'Assistant unavailable' });
  }
}
