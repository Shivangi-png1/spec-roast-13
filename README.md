# 🔥 Spec Roast

**Stress-test your product spec before your engineers do.**

Paste your PRD or feature brief and get back exactly what your engineers,
designers, and skeptical VP will say — before the review meeting.

🔗 **[Live demo](YOUR_VERCEL_URL)**

---

## What it does

You paste a product spec. Spec Roast returns:

- 🔨 **Engineer questions** you haven't answered
- 🕳️ **Edge cases** you've missed
- 📊 **Missing or vague success metrics**
- 🔗 **Hidden dependencies** not accounted for
- 😈 **Devil's advocate** — why this feature fails
- 🚩 **Top 3 gaps** to fix before sharing further

Plus a **Spec Quality Score** from 1–10 with specific reasoning.

---

## Built with

- [Next.js 14](https://nextjs.org/) (App Router)
- [Anthropic Claude API](https://anthropic.com) with streaming
- [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

---

## Run locally

```bash
git clone https://github.com/Shivangi-png1/spec-roast-13.git
cd spec-roast-13
npm install
cp .env.local.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Built by

[Shivangi Saxena](https://www.linkedin.com/in/shivangi-saxena) — AI PM
