# Spec Roast — Deploy in 15 minutes

## 1. Get your Anthropic API key
Go to https://console.anthropic.com/ → API Keys → Create Key
Copy the key (starts with `sk-ant-...`)

---

## 2. Install and run locally first

```bash
cd spec-roast
npm install

# Create your env file
cp .env.local.example .env.local
# Open .env.local and paste your API key

npm run dev
```

Open http://localhost:3000 — click "Load sample →" and hit "Roast my spec" to test it.

---

## 3. Deploy to Vercel (free)

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: spec-roast
# - Root directory: ./
# - Override settings? No

# When asked for environment variables, add:
# ANTHROPIC_API_KEY = your key
```

### Option B — GitHub + Vercel dashboard
1. Push this folder to a new GitHub repo
2. Go to https://vercel.com/new
3. Import your repo
4. Under "Environment Variables" add: `ANTHROPIC_API_KEY` = your key
5. Click Deploy

Your live URL will be: `https://spec-roast.vercel.app` (or similar)

---

## 4. Before going live — update your LinkedIn URL

In `app/page.tsx`, find:
```
href="https://www.linkedin.com/in/shivangi-saxena"
```
Make sure your LinkedIn handle is correct.

---

## 5. Record your demo (optional but recommended)

- Install Loom (free): https://loom.com
- Record a 60-second walkthrough: paste the sample spec → roast → walk through the output
- This goes in your LinkedIn post comments for maximum click-throughs

---

## Tech stack recap
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Anthropic SDK with streaming
- Deployed on Vercel Hobby (free tier)
- Total cost: $0 (you only pay API usage — ~$0.01 per roast)
