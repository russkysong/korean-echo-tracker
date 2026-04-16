# Korea Echo Tracker

Next.js app that ties **Echo agenda patterns** to dashboards: pattern table (`/tracker`), maps, fuzzy search (CopyKiller), Kelly matrix (`/matrix`), and a **정부 입법예고** keyword monitor (`/assembly`) backed by the 국민참여입법센터 `ogLmPp` REST API when `LAWMAKING_OC` is set.

## Local setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` (not committed to git). Optional: set `LAWMAKING_OC` for live 입법예고 rows; leave unset for browser-only links. See comments in `.env.example`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment and security

- **Do not commit** `.env`, `.env.local`, or any file containing real keys. This repo ignores `.env` and `.env.*` except `.env.example`.
- Use **server-only** variables for secrets (`LAWMAKING_OC`). Do not put secrets in `NEXT_PUBLIC_*` variables.
- For **Vercel** (or similar): add the same variables in the project **Environment Variables** UI, not in the repo.

## Collaborators

After `git pull`, copy `.env.example` → `.env.local` and add your own keys. Run locally as above.
