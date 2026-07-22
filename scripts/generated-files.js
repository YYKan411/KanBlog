// ============================================================
// Single source of truth for files that scripts/build.js rewrites.
// Consumed by:
//   - scripts/smoke.js  (git diff --exit-code gate)
//   - .github/workflows/build.yml  (git add list)
// Keep this list in sync with every fs.writeFileSync target in build.js
// that is meant to be committed by the bot.
// ============================================================
module.exports = [
  'app.js',
  'post.js',
  'sitemap.xml',
  'feed.xml',
  'llms.txt',
  'index.html',
];
