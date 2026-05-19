#!/usr/bin/env node
// ============================================================
// build.js — auto-generate post list (in app.js) and sitemap.xml
// ============================================================
// Reads every .html file in posts/ (except _TEMPLATE.html),
// extracts metadata from <title>, <meta>, og:image, etc.,
// then rewrites:
//   - app.js          (the SAMPLE_POSTS array)
//   - sitemap.xml     (URL list)
//
// Triggered by GitHub Actions on every push that touches posts/.
// ============================================================

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://kanblog.pages.dev';
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const APP_JS = path.join(ROOT, 'app.js');
const SITEMAP = path.join(ROOT, 'sitemap.xml');

// ============================================================
// helpers — extract things from HTML
// ============================================================

function readMeta(html, attr, name) {
  // matches <meta name="..." content="..."> or property="..."
  const re = new RegExp(
    `<meta\\s+${attr}=["']${name}["']\\s+content=["']([^"']*)["']`,
    'i'
  );
  const m = html.match(re);
  return m ? m[1] : null;
}

function readTitle(html) {
  // page <title> is "標題 — Kaga Chung" — strip the suffix
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/\s*—\s*Kaga Chung\s*$/, '').trim();
}

function extractTags(keywordsRaw) {
  // keywords meta is comma-separated; first 1–3 are likely tags
  // we keep only the ones that look like Chinese tags (the canonical set)
  if (!keywordsRaw) return [];
  const canonical = ['散文', '遊記', '哲思', '移英', '物', '人', '社會'];
  const tokens = keywordsRaw.split(/[,，]/).map(s => s.trim());
  return tokens.filter(t => canonical.includes(t));
}

function parsePost(filename) {
  const filepath = path.join(POSTS_DIR, filename);
  const html = fs.readFileSync(filepath, 'utf8');

  const slug = filename.replace(/\.html$/, '');
  const title = readTitle(html);
  const description = readMeta(html, 'name', 'description');
  const excerpt = readMeta(html, 'name', 'excerpt') || description || '';
  const keywords = readMeta(html, 'name', 'keywords');
  const tags = extractTags(keywords);
  const date = readMeta(html, 'property', 'article:published_time');
  const ogImage = readMeta(html, 'property', 'og:image');
  const featured = readMeta(html, 'name', 'featured') === 'true';

  // cover: convert og:image absolute URL to relative path for the homepage
  let cover = null;
  if (ogImage && ogImage.startsWith(SITE_URL)) {
    cover = ogImage.replace(SITE_URL + '/', '');
  } else if (ogImage) {
    cover = ogImage;
  }

  if (!title || !date) {
    console.warn(`⚠️  skipping ${filename}: missing title or date`);
    return null;
  }

  return {
    slug,
    title,
    date,
    excerpt: excerpt.length > 200 ? excerpt.slice(0, 197) + '…' : excerpt,
    tags,
    cover,
    featured,
    url: `posts/${filename}`
  };
}

// ============================================================
// 1. scan posts/
// ============================================================

const files = fs.readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.html'))
  .filter(f => !f.startsWith('_'));  // skip _TEMPLATE.html

const posts = files
  .map(parsePost)
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date));  // newest first

console.log(`✓ parsed ${posts.length} post(s)`);

// ============================================================
// 2. rewrite app.js (SAMPLE_POSTS array)
// ============================================================

const postsArrayJS = posts.map(p => {
  const lines = [
    `  {`,
    `    slug: ${JSON.stringify(p.slug)},`,
    `    title: ${JSON.stringify(p.title)},`,
    `    date: ${JSON.stringify(p.date)},`,
    `    excerpt: ${JSON.stringify(p.excerpt)},`,
    `    tags: ${JSON.stringify(p.tags)},`
  ];
  if (p.cover)    lines.push(`    cover: ${JSON.stringify(p.cover)},`);
  if (p.featured) lines.push(`    featured: true,`);
  lines.push(`    url: ${JSON.stringify(p.url)}`);
  lines.push(`  }`);
  return lines.join('\n');
}).join(',\n');

const appJsCurrent = fs.readFileSync(APP_JS, 'utf8');
const newPostsBlock = `const SAMPLE_POSTS = [\n${postsArrayJS}\n];`;

const updatedAppJs = appJsCurrent.replace(
  /const SAMPLE_POSTS\s*=\s*\[[\s\S]*?\];/,
  newPostsBlock
);

if (updatedAppJs === appJsCurrent) {
  console.warn('⚠️  could not find SAMPLE_POSTS in app.js — no changes written');
} else {
  fs.writeFileSync(APP_JS, updatedAppJs);
  console.log('✓ app.js updated');
}

// ============================================================
// 3. rewrite sitemap.xml
// ============================================================

const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: `${SITE_URL}/`,            lastmod: today,  priority: '1.0' },
  { loc: `${SITE_URL}/about.html`,  lastmod: today,  priority: '0.8' },
  ...posts.map(p => ({
    loc: `${SITE_URL}/${p.url}`,
    lastmod: p.date,
    priority: '0.9'
  }))
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u =>
  `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
).join('\n')}
</urlset>
`;

fs.writeFileSync(SITEMAP, sitemapXml);
console.log('✓ sitemap.xml updated');
console.log(`✓ done — ${posts.length} post(s), ${urls.length} URL(s)`);
