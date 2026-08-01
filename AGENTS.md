# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static personal blog** (`言又勤` / `yykan.uk`) plus a few self-contained mini-games. There is **no backend server, no database, and no root `package.json`**. Everything ships as static files to Cloudflare Pages.

### Services / how to run

- **Static site (blog + `catspuzzle` + `xiangqi`)**: `cd minigames/xiangqi && npm run serve` serves the **entire repo root** on `http://127.0.0.1:8765/` (port via `PORT`). This server also sets the COOP/COEP/CSP headers the Xiangqi Pikafish WASM engine needs — a plain static server (e.g. `python3 -m http.server`) will serve the blog fine but Xiangqi's engine will fail to load without those cross-origin-isolation headers. `xiangqi` has no npm dependencies.
- **Philosophy quiz (`philquiz`)**: React 19 + Vite + TypeScript, source in `minigames/philquiz/source`. Run `npm run dev` there for the Vite dev server (`http://localhost:5173/`). The built output is committed at `minigames/philquiz/` and is served by the static server above, so you only need the Vite dev server when editing the quiz source.
- The blog `editor.html` save/publish flow talks to an **external** Cloudflare Worker (`kanblog-editor-api`) whose source is **not in this repo**, so that publish flow cannot be exercised end-to-end locally.

### Build / test / lint

- Site metadata build: `node scripts/build.js` (regenerates `app.js` post list, `sitemap.xml`, `feed.xml`, `llms.txt`; requires full git history for deterministic sitemap dates — CI uses `fetch-depth: 0`). It is idempotent and prints "already up to date" when nothing changed.
- Xiangqi smoke tests: `cd minigames/xiangqi && npm test` (`node scripts/smoke.mjs`).
- Philquiz typecheck: `cd minigames/philquiz/source && npx tsc -b`. Note: `npm run build` in that folder writes into the committed `minigames/philquiz/` build output (Vite `outDir` is a parent of root), so avoid running it unless you intend to regenerate committed files.
- There is no separate lint step configured.
