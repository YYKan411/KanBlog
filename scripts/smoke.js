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
function readArray(src, name) {
  const m = src.match(new RegExp(`const ${name} = \\[([^\\]]*)\\]`));
  if (!m) return null;
  return m[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
}
const buildJs = fs.readFileSync(path.join(ROOT, 'scripts/build.js'), 'utf8');
const GENRE_TAGS = readArray(buildJs, 'GENRE_TAGS') || [];
const SUBJECT_TAGS = readArray(buildJs, 'SUBJECT_TAGS') || [];
const CANONICAL_TAGS = [...GENRE_TAGS, ...SUBJECT_TAGS];
if (!GENRE_TAGS.length || !SUBJECT_TAGS.length) fail('could not read GENRE_TAGS / SUBJECT_TAGS from build.js');
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
  // Two-axis taxonomy: exactly one genre tag per post, nothing off-set.
  const tagsMeta = html.match(/<meta\s+name=["']tags["']\s+content=["']([^"']*)["']/i);
  const tags = tagsMeta ? tagsMeta[1].split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
  const genres = tags.filter(t => GENRE_TAGS.includes(t));
  if (genres.length !== 1) fail(f + ` must carry exactly one genre tag (${GENRE_TAGS.join('/')}), has ${genres.length}`);
  const offSet = tags.filter(t => !CANONICAL_TAGS.includes(t));
  if (offSet.length) fail(f + ' has off-set tags: ' + offSet.join(', '));
  if (tags[0] && !GENRE_TAGS.includes(tags[0])) fail(f + ' tags[0] must be the genre');
}
ok(`checked ${posts.length} posts for tags/keywords meta + one-genre rule + back link`);

// 4b. The three tag-set copies must not drift (build.js is the source of truth)
const editorHtml = fs.readFileSync(path.join(ROOT, 'editor.html'), 'utf8');
const homeAppJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const editorGenre = readArray(editorHtml, 'GENRE_TAGS');
const editorSubject = readArray(editorHtml, 'SUBJECT_TAGS');
const appOrder = readArray(homeAppJs, 'TAG_ORDER');
if (JSON.stringify(editorGenre) !== JSON.stringify(GENRE_TAGS)) fail('editor.html GENRE_TAGS drifted from build.js');
if (JSON.stringify(editorSubject) !== JSON.stringify(SUBJECT_TAGS)) fail('editor.html SUBJECT_TAGS drifted from build.js');
if (JSON.stringify(appOrder) !== JSON.stringify(CANONICAL_TAGS)) fail('app.js TAG_ORDER drifted from build.js');
if (!failed) ok('tag set in sync across build.js / editor.html / app.js');

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
