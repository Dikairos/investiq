# InvestIQ

InvestIQ is a responsive investment-research demo for beginner investors, initially focused on Nigerian companies. It uses a dark slate and emerald visual system and clearly distinguishes illustrative sample data and simulated responses from verified financial information.

## Features

- **Company exploration** — search the local sample catalog and open company profiles.
- **Company profiles** — business summaries, illustrative metrics, historical charts, and browser-local save shortcuts.
- **Financial assistant** — company-aware questions; uses the optional server-side OpenAI route when available and otherwise provides clearly labeled simulated answers from the sample catalog.
- **Company comparison** — select 2–4 companies, review available metrics and charts, and generate live or clearly labeled local demo insights.
- **Financial report analysis** — select and validate a PDF, view document details, and see an analysis preview. The frontend shows a clearly labeled sample preview if backend/AI processing is unavailable; that preview is not based on the uploaded file.

## Demo limitations and data

- Company financial figures and historical chart values are illustrative placeholders, not actual or current market data.
- The browser stores only saved company tickers, selected comparison tickers, and the assistant's last company choice in `localStorage`. This is browser-local convenience, not an account, backup, or secure storage. Conversation history, PDFs, and credentials are not stored there.
- Report PDFs are limited to 12 MB and 300 pages by the optional analysis route. Text extraction supports selectable-text PDFs; scanned/image-only reports need OCR, which is not configured. When the report backend is unavailable, the local preview uses the MTN Nigeria sample catalog and explicitly says it did not analyze the selected document.
- OpenAI integration is optional. The API key remains server-side. Without it, assistant and comparison requests use labeled local demo responses; report analysis uses a labeled sample preview.
- There is no authentication, database, Supabase storage, live financial-data connection, or personalized investment advice.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide React, and `pdf-parse` for the optional server-side PDF route.

## Run locally

Requires Node.js 20 or later and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The demo works without environment variables. To enable live assistant/comparison responses and server-side report processing, add an OpenAI key to `.env.local`:

```env
OPENAI_API_KEY=your-server-side-api-key
OPENAI_MODEL=gpt-4.1-mini
```

`OPENAI_MODEL` is optional. Never use a `NEXT_PUBLIC_` prefix for the key or commit `.env.local`. Restart the dev server after changing environment variables. A non-secret starter file is provided in `.env.example`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

There is no automated test suite configured yet. Manually check the homepage, `/companies`, the MTNN/DANGCEM/GTCO profiles, `/assistant`, `/compare`, and `/reports`. Try search/filtering, company links and saved shortcuts, comparison selection/removal, PDF validation, and the assistant/report demo fallbacks.

## Deploy

Deploy as a Next.js application (for example, on Vercel); do not use a static-only host because optional API routes are included.

1. Push the project to a GitHub repository.
2. Import that repository in Vercel and deploy with the detected Next.js settings.
3. AI keys are optional for the public demo. If enabling live AI, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the Vercel project's server-side environment variables, then redeploy. Do not expose the key as a public variable.
4. The optional report route requests a 60-second function duration; confirm the selected hosting plan permits it. The frontend demo remains available if that route or the AI service is unavailable.
