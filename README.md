# Korea Echo Tracker

A **Next.js** dashboard that connects recurring **Echo** policy patterns (themes that show up across Korean and global governance) to interactive views: tables, a world map, fuzzy text search, and a legislative-notice keyword monitor.

**Live demo (optional):** add your Vercel (or other) URL here after you deploy — e.g. `https://korean-echo-tracker.vercel.app`

### Project status

**Work in progress.** Core flows run locally and the stack is stable, but features, copy, and data coverage are not “finished”—this repo is shared for **early feedback and collaboration**, not as a final product. Issues, rough edges, and missing polish are expected. When something is intentionally out of scope for now, we’ll note it in [GitHub Issues](https://github.com/russkysong/korean-echo-tracker/issues) (or your team’s tracker).

---

## What this app does

| Area | Route | Purpose |
|------|--------|--------|
| Home | `/` | Entry point and links into the app |
| Pattern table | `/tracker` | Sortable Echo patterns (topics, keywords, agenda tags) |
| World map | `/` (map section) | Geographic framing for pattern context |
| CopyKiller | `/copykiller` | Fuzzy search over pattern-related text |
| Kelly matrix | `/matrix` | Structured “proof” / narrative layout for Korea-relevant angles |
| 입법예고 monitor | `/assembly` | Matches pattern keywords to **정부 입법예고** (MoLEG / 국민참여입법센터). With `LAWMAKING_OC`, the server fetches XML; without it, the UI still offers browser search links |

Policy sources and QA notes live in **`SOURCES.md`**.

---

## Local setup

The repo includes **`package-lock.json`**. Keep it in git and update it whenever you change dependencies (`npm install <pkg>`), so **`npm ci`** works in CI and on fresh clones.

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` (never committed). Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Verify production build (recommended before sharing or deploying):**

```bash
npm run build
```

**Tests:** `npm run test` (Vitest).

---

## Environment variables

| Variable | Required? | Role |
|----------|-----------|------|
| `LAWMAKING_OC` | No | “OC” id for [국민참여입법센터 REST](https://www.lawmaking.go.kr/rest/ogLmPp) (정부 입법예고 XML). Same account family as Korea’s public-data portal. |
| `LAWMAKING_REST_URL` | No | Override list endpoint (default: `opinion.lawmaking.go.kr` … `/ogLmPp.xml`). |
| `NEXT_PUBLIC_APP_ORIGIN` | No | Public site origin if you need absolute URLs in the client. |

### How to get `LAWMAKING_OC`

1. Apply for open-data / API access on **[공공데이터포털](https://www.data.go.kr)** — dataset **「법제처_정부입법예고」** ([example listing](https://www.data.go.kr/data/15058407/openapi.do)) uses the lawmaking REST base.
2. Read the official **[API guide (입법예고)](https://www.lawmaking.go.kr/api/apiGuideInfo?type=4-1)** on 국민참여입법센터. Your service id is the **`OC`** parameter (the part before `@` in the email-style id they issue).

Without `LAWMAKING_OC`, `/assembly` still works in **link-only** mode (no server-side calls; keyword links open the public search UI).

---

## Security

- **Do not commit** `.env`, `.env.local`, or real keys. This repo ignores `.env` and `.env.*` except `.env.example`.
- Keep secrets **server-only** — never `NEXT_PUBLIC_*` for `LAWMAKING_OC`.
- On **Vercel / Netlify / etc.**, set variables in the host **Environment Variables** UI.

---

## Collaborators

1. `git clone https://github.com/russkysong/korean-echo-tracker.git`
2. `npm install` and `cp .env.example .env.local`
3. Obtain your own `LAWMAKING_OC` if you want live 입법예고 data (see above)
4. `npm run dev`

---

## Screenshots (optional)

To help teammates who will not run the app locally, add PNGs under `docs/screenshots/` (or `public/`) and link them here.

---

## License

MIT — see [`LICENSE`](./LICENSE).
