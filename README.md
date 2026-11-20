# SureBright Claims Portal 🛡️

> AI-powered warranty claims adjudication — built as a portfolio project for the **SureBright Software Engineer, Founder's Office** role.

**Built with:** Next.js 15 · TypeScript · Tailwind CSS · Gemini AI · lucide-react

---

## What This Is

A full-stack prototype of SureBright's core claims flow: customers submit warranty claims, an AI reads the claim against a policy document, and returns an approve/deny/escalate decision with full reasoning — all in under 3 seconds.

**Built end-to-end in one session using Claude Code.**

---

## Features

| Feature | Description |
|---|---|
| 🏠 **Landing Page** | SureBright-branded hero, stats, how-it-works, social proof |
| 📝 **Multi-step Claim Form** | 3-step guided form with validation |
| 🤖 **AI Adjudication** | Gemini AI reads claim vs. policy → approve/deny/escalate |
| 📊 **Admin Dashboard** | All claims, AI metrics, approval rate, confidence scores |
| 🔍 **Claim Detail (Customer)** | Status timeline, AI decision card, audit trail |
| 🔧 **Admin Claim Detail** | Full AI reasoning + human override with reason logging |
| 📋 **Audit Trail** | Every action logged: customer → AI → admin |
| ⚡ **Confidence Scores** | Visual confidence bars with color-coded thresholds |
| 🚩 **Red Flag Detection** | AI flags suspicious patterns automatically |
| 🔁 **Human Override** | Admins can override AI with reason — logged to audit trail |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── claims/
│   │   ├── new/page.tsx            # Multi-step claim submission
│   │   └── [id]/page.tsx           # Customer claim status view
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard
│   │   └── claims/[id]/page.tsx    # Admin claim detail + override
│   └── api/
│       ├── claims/new/route.ts     # POST: create claim + trigger AI
│       └── claims/[id]/
│           ├── adjudicate/route.ts # POST: trigger AI on existing claim
│           └── override/route.ts   # POST: human override
├── components/
│   ├── Navbar.tsx
│   ├── AiDecisionCard.tsx          # AI result with reasoning
│   ├── AuditTrail.tsx
│   ├── StatusBadge.tsx
│   └── OverridePanel.tsx           # Admin override UI
└── lib/
    ├── db.ts                       # In-memory store (→ Postgres in prod)
    └── ai.ts                       # Gemini AI + smart mock fallback
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Key routes:**
- `/` — Landing page
- `/claims/new` — File a claim
- `/admin` — Admin dashboard (4 pre-seeded claims)
- `/admin/claims/CLM-2024-001` — Approved claim
- `/admin/claims/CLM-2024-002` — Escalated claim
- `/admin/claims/CLM-2024-003` — Denied claim

### Enable Real AI (Optional)

```bash
# .env.local
GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com)

---

## Deploy

```bash
npx vercel --prod
```

Add `GEMINI_API_KEY` as an environment variable in Vercel.

---

## Production Roadmap

- **Postgres** replacing in-memory store (Prisma ORM)
- **S3/R2** for photo uploads
- **Redis** for claim queue and rate limiting
- **Shopify webhooks** to auto-create claims from orders
- **Email notifications** on status changes
- **Vector search** for policy retrieval (RAG over warranty docs)

---

_Built by [Priyan Bhatia] · November 2024 · Portfolio project for SureBright_
