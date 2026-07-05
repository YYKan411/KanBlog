# 哲學傾向問卷 · Philosophical Tendency Quiz — source

React + TypeScript + Vite app. Built output lands in the **parent folder** (`minigames/philquiz/`), next to this `source/` directory — same layout as `minigames/catspuzzle/` (deployed `index.html` + `assets/`).

## Develop

```bash
cd minigames/philquiz/source
npm install
npm run dev
```

## Build & deploy

```bash
cd minigames/philquiz/source
npm run build
```

This writes `../index.html` and `../assets/*`. Commit those built files with any source changes. After a build, delete orphaned old hashed assets in `../assets/` if Vite emitted new hashes.

## Content

- `src/data/questions.ts` — 32 quiz questions (zh/en)
- `src/data/philosophers.ts` — 16 thinker profiles
- `src/engine/score.ts` — axis scoring & matching

Site registration (hub card, sitemap, llms.txt): see repo root `kanblog-architecture.md` → Game Contract.
