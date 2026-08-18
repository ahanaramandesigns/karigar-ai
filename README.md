# Karvaan AI

**"Can an artisan become globally visible without becoming digitally fluent?"**

Karvaan AI turns one product photo and a short spoken or typed story into a complete, professional, multilingual, marketplace-ready product listing — no writing, pricing, translation, or marketing skills required.

> *You make the craft. We handle the digital world.*

Built for a 12-hour hackathon. Fully functional end-to-end demo, works offline with no API keys.

## The flow

1. **Landing** — the pitch, in one screen.
2. **Upload** — drag/drop or tap to add a product photo.
3. **Your Story** — four simple questions, answerable by typing or speaking (mic button, Web Speech API).
4. **AI Product Analysis** — best-effort, clearly-labelled, fully editable read of the photo.
5. **Global Listing** — title, descriptions, story, materials, keywords — generated from your words, always editable, with Regenerate.
6. **Smart Pricing** — a suggested range and starting price from material cost, time, and margin, with a plain-language explanation. You always have final control.
7. **Multilingual Listing** — English, Hindi, Kannada, Tamil, Malayalam, Marathi, Spanish. Tabbed view, copy buttons, your own story preserved rather than blindly re-written.
8. **Marketing Kit** — Instagram caption, WhatsApp message, SEO keywords, target customer, tagline. Editable and copyable.
9. **Dashboard / Export** — everything in one place, downloadable as a listing document, with "ready for marketplace export" cards for Etsy / Amazon Karigar / ONDC (clearly labelled as future integrations, not live connections).

Click **"Try a Sample Product"** on the landing page to instantly walk through the whole flow with a pre-filled demo artisan (a handwoven bamboo basket) — no upload required.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build
```

Requires Node 18+.

## Architecture

- **React + TypeScript + Vite**, single-page app driven by one wizard-style state machine (`src/App.tsx`) — no router needed for a linear flow.
- **Tailwind CSS v4** for styling, with a custom "heritage meets technology" theme (terracotta / ochre / teal / cream) defined in `src/index.css`.
- **`src/services/aiService.ts`** is the single integration point for all "intelligence" (vision analysis, listing generation, pricing, translation, marketing copy). It is written so a real backend can be dropped in behind an env var without touching any component:
  - If `VITE_BACKEND_API_URL` is set, every call is proxied to that backend (a real deployment should call model providers **server-side only** — never ship a secret API key in frontend JS).
  - Otherwise it runs a polished **local fallback engine**: heuristic photo-category matching, template-based listing generation that prioritizes the artisan's own words, rule-based pricing math, and localized structural templates for translation. This keeps the whole app fully demonstrable offline and never breaks on API failure.
- **`src/hooks/useVoiceInput.ts`** wraps the browser's SpeechRecognition API and degrades gracefully (hides the mic button) where unsupported.
- **`src/types.ts`** holds all shared domain types; **`src/data/demoData.ts`** holds the sample artisan/product used for the one-click demo.
- Every screen lives in `src/components/screens/`; shared building blocks (buttons, cards, badges, copy button) live in `src/components/ui.tsx`.

## AI behavior contract (kept in both live and demo modes)

- The artisan's own story is treated as ground truth and is never overwritten.
- Nothing about origin, tradition, certification, or sustainability is invented — such claims only appear if the artisan stated them.
- Anything read from the photo is labelled as an editable, best-effort estimate (never presented as certain) and can be corrected before continuing.
- Pricing is presented as an AI-assisted suggestion with an explained range, never a single "correct" number — the artisan sets the final price.

## What's intentionally out of scope

Per the brief, this build focuses entirely on the core content pipeline (upload → story → analysis → listing → pricing → translation → marketing → export) rather than payments, authentication, a full marketplace, logistics, or real third-party marketplace integrations.
