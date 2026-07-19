/**
 * Generate per-philosopher share landing pages at minigames/philquiz/r/<id>/index.html.
 * Run: node scripts/gen-share-pages.mjs   (Node >= 22.18)
 *
 * Why these exist: social scrapers (WhatsApp/Threads/FB) read og tags from static
 * HTML — the SPA can only serve one generic card. Share URLs therefore point at
 * these tiny pages, which carry result-specific og:title/description and then
 * redirect into the app preserving the query string (?axes=…&sv=…).
 * Marked noindex — they are redirect shells, not content.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHILOSOPHERS } from '../src/data/philosophers.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = join(__dirname, '../../r');
const SITE = 'https://yykan.uk';
const OG_IMAGE = `${SITE}/images/og-philquiz.png?v=9a8c35e`;

const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

for (const p of PHILOSOPHERS) {
  const title = `同我最接近嘅思想家：${p.name.zh} — 哲學傾向問卷 · 言又勤`;
  const ogTitle = `同我最接近嘅思想家：${p.name.zh} · ${p.name.en}`;
  const description = `${p.epithet.zh} · ${p.epithet.en} — 三十六題深夜傾計，你又會對到邊位？A late-night philosophy chat: who fits your groove?`;
  const pageUrl = `${SITE}/minigames/philquiz/r/${p.id}/`;

  const html = `<!DOCTYPE html>
<html lang="zh-HK">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${SITE}/minigames/philquiz/">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:site_name" content="言又勤">
<meta property="og:locale" content="zh_HK">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(ogTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<script>
(function () {
  var q = window.location.search.replace(/^\\?/, '');
  window.location.replace('../../?r=${p.id}' + (q ? '&' + q : ''));
})();
</script>
<noscript><meta http-equiv="refresh" content="0;url=../../?r=${p.id}"></noscript>
</head>
<body>
<p><a href="../../?r=${p.id}">哲學傾向問卷 · ${esc(p.name.zh)} →</a></p>
</body>
</html>
`;

  const dir = join(OUT_ROOT, p.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`✓ r/${p.id}/index.html`);
}
console.log(`\n${PHILOSOPHERS.length} landing pages written to ${OUT_ROOT}`);
