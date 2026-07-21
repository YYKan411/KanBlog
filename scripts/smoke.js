#!/usr/bin/env node
// ============================================================
// smoke.js — cheap CI gates for chrome contract + eng debt
// ============================================================
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
let failed = 0;

function fail(msg) {
  console.error('✗ ' + msg);
  failed++;
}
function ok(msg) {
  console.log('✓ ' + msg);
}

// 1. Syntax-check key JS
const jsFiles = [
  'app.js',
  'post.js',
  'scripts/build.js',
  'scripts/smoke.js',
  'learning/sql/app.js',
  'learning/sql/db.js',
  'learning/sql/cases.js',
  'learning/sql/philosophers-data.js',
];
for (const rel of jsFiles) {
  try {
    execSync(`node --check "${path.join(ROOT, rel)}"`, { stdio: 'pipe' });
    ok('syntax ' + rel);
  } catch (e) {
    fail('syntax ' + rel + ': ' + (e.stderr?.toString() || e.message));
  }
}

// 2. No identity leftovers / old array name
for (const rel of ['app.js', 'style.css', 'scripts/build.js']) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (/Kaga Chung/.test(text)) fail(rel + ' still mentions Kaga Chung');
  else ok(rel + ' identity clean');
  if (/SAMPLE_POSTS/.test(text)) fail(rel + ' still has SAMPLE_POSTS');
  else ok(rel + ' uses POSTS');
}

const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
if (!/const POSTS\s*=\s*\[/.test(appJs)) fail('app.js missing const POSTS = [');
else ok('app.js exposes POSTS');

// 3. Chrome language contract (zh · en) on primary shells
const chromeChecks = [
  ['index.html', '主頁/home'],
  ['index.html', '關於/about'],
  ['index.html', '小遊戲/mini games'],
  ['index.html', '學習/learning'],
  ['index.html', '追蹤 · Follow me:'],
  ['index.html', '全部 · all'],
  ['about.html', '關於 · About'],
  ['404.html', '返主頁/home'],
  ['learning/index.html', '主頁/home'],
  ['minigames/index.html', '主頁/home'],
];
for (const [rel, needle] of chromeChecks) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (!text.includes(needle)) fail(rel + ' missing “‘ + needle + ’”');
  else ok(rel + ' has ' + needle);
}

// Learning hub must NOT load post.js; SQL lab may (lang toggle).
const learnHub = fs.readFileSync(path.join(ROOT, 'learning/index.html'), 'utf8');
if (/post\.js/.test(learnHub)) fail('learning/index.html should not load post.js');
else ok('learning hub does not load post.js');

const learnLd = learnHub.match(/"description":\s*"([^"]*)"/);
if (!learnLd || !/quiet shelf|practice/i.test(learnLd[1])) {
  fail('learning JSON-LD description should be bilingual');
} else {
  ok('learning JSON-LD description bilingual');
}

// 4. Every real post has dedicated tags meta + bilingual back link
const postsDir = path.join(ROOT, 'posts');
const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.html') && !f.startsWith('_'));
for (const f of posts) {
  const html = fs.readFileSync(path.join(postsDir, f), 'utf8');
  if (!/<meta\s+name=["']tags["']\s+content=["'][^"']*["']\s*>/i.test(html)) {
    fail(f + ' missing well-formed <meta name="tags">');
  }
  if (!/<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*>/i.test(html)) {
    fail(f + ' missing well-formed <meta name="keywords">');
  }
  if (!html.includes('← 主頁/home')) fail(f + ' missing bilingual back link');
}
ok(`checked ${posts.length} posts for tags/keywords meta + back link`);

// 5. SQL status copy is ZH-first
const sqlApp = fs.readFileSync(path.join(ROOT, 'learning/sql/app.js'), 'utf8');
if (/Loading SQLite/.test(sqlApp) && !/載入 SQLite/.test(sqlApp)) {
  fail('SQL boot status not ZH-first');
}
if (/✓ Passed · 過關/.test(sqlApp)) fail('SQL pass status still EN-first');
if (!/✓ 過關 · Passed/.test(sqlApp)) fail('SQL pass status missing ZH-first form');
else ok('SQL status strings ZH-first');

if (failed) {
  console.error(`\n${failed} smoke check(s) failed`);
  process.exit(1);
}
console.log('\nAll smoke checks passed');
