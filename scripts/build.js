#!/usr/bin/env node
// ============================================================
// build.js — auto-generate post list (in app.js), sitemap.xml, feed.xml
// ============================================================
// Reads every .html file in posts/ (except _TEMPLATE.html),
// extracts metadata from <title>, <meta>, og:image, etc.,
// then rewrites:
//   - app.js          (the SAMPLE_POSTS array)
//   - sitemap.xml     (URL list for crawlers)
//   - feed.xml        (RSS 2.0 feed for subscribers)
//
// Triggered by GitHub Actions on every push that touches posts/.
// ============================================================

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://yykan.uk';
// Default social share image (used by _TEMPLATE.html for cover-less posts).
// Guarded below so it never becomes a repeated home-card cover.
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`;
const SITE_TITLE = '言又勤';
const SITE_DESCRIPTION = '言又勤的雙語網誌。散文、遊記、哲思、移英筆記。一個香港人喺英倫,記低酒後與酒醒之間嘅閒話。';
const MAX_FEED_ITEMS = 50;  // cap RSS feed length

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const APP_JS = path.join(ROOT, 'app.js');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const FEED = path.join(ROOT, 'feed.xml');
const LLMS = path.join(ROOT, 'llms.txt');

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
  // page <title> is "標題 — 言又勤" — strip the suffix
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/\s*—\s*言又勤\s*$/, '').trim();
}

function extractTags(keywordsRaw) {
  if (!keywordsRaw) return [];
  const canonical = ['散文', '遊記', '哲思', '移英', '物', '人', '社會', '香港'];
  const tokens = keywordsRaw.split(/[,，]/).map(s => s.trim());
  return tokens.filter(t => canonical.includes(t));
}

// Escape text for use inside XML element content
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert ISO date "YYYY-MM-DD" → RFC 822 "Wed, 21 May 2026 00:00:00 GMT"
function toRfc822(isoDate) {
  const d = new Date(isoDate + 'T00:00:00Z');
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
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

    // og:image doubles as the home-card cover — but DEFAULT_OG_IMAGE is a
  // generic share fallback, not a real cover, so skip it here (the post
  // keeps og:image for social sharing; its card just stays text-only).
  let cover = null;
  if (ogImage && ogImage !== DEFAULT_OG_IMAGE) {
    if (ogImage.startsWith(SITE_URL)) {
      cover = ogImage.replace(SITE_URL + '/', '');
    } else {
      cover = ogImage;
    }
  }

  if (!title || !date) {
    console.warn(`⚠️  skipping ${filename}: missing title or date`);
    return null;
  }

  return {
    slug,
    title,
    date,
    description: description || '',
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
  .filter(f => !f.startsWith('_'));

const posts = files
  .map(parsePost)
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date));

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

const newestPostDate = posts.length > 0
  ? posts[0].date.split('T')[0]
  : new Date().toISOString().split('T')[0];

const aboutPath = path.join(ROOT, 'about.html');
const aboutMtime = fs.statSync(aboutPath).mtime.toISOString().split('T')[0];

// Static section pages (not generated from posts/). Add future MiniGames
// or other standalone pages here and they'll appear in the sitemap.
const STATIC_PAGES = [
  { file: 'minigames/index.html',            loc: `${SITE_URL}/minigames/`,            priority: '0.7' },
  { file: 'minigames/catspuzzle/index.html', loc: `${SITE_URL}/minigames/catspuzzle/`, priority: '0.6' },
];
const staticUrls = STATIC_PAGES
  .filter(p => fs.existsSync(path.join(ROOT, p.file)))
  .map(p => ({
    loc: p.loc,
    lastmod: fs.statSync(path.join(ROOT, p.file)).mtime.toISOString().split('T')[0],
    priority: p.priority
  }));

const urls = [
  { loc: `${SITE_URL}/`,            lastmod: newestPostDate,  priority: '1.0' },
  { loc: `${SITE_URL}/about.html`,  lastmod: aboutMtime,      priority: '0.8' },
  ...staticUrls,
  ...posts.map(p => ({
    loc: `${SITE_URL}/${p.url}`,
    lastmod: p.date.split('T')[0],
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

// ============================================================
// 4. rewrite feed.xml (RSS 2.0)
// ============================================================

const feedItems = posts.slice(0, MAX_FEED_ITEMS).map(p => {
  const link = `${SITE_URL}/${p.url}`;
  const pubDate = toRfc822(p.date.split('T')[0]);
  const desc = p.excerpt || p.description || '';
  return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${xmlEscape(desc)}</description>
    </item>`;
}).join('\n');

const lastBuildDate = posts.length > 0
  ? toRfc822(posts[0].date.split('T')[0])
  : new Date().toUTCString();

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_TITLE)}</title>
    <link>${SITE_URL}/</link>
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>zh-HK</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${feedItems}
  </channel>
</rss>
`;

fs.writeFileSync(FEED, feedXml);
console.log('✓ feed.xml updated');

// ============================================================
// 5. rewrite llms.txt (GEO — a curated map for AI answer engines)
// ============================================================

const llmsPostLines = posts.map(p =>
  `- [${p.title}](${SITE_URL}/${p.url})${p.excerpt ? ': ' + p.excerpt.replace(/\s+/g, ' ').slice(0, 120) : ''}`
).join('\n');

const llmsTxt = `# ${SITE_TITLE} (Yin Yau Kan)

> ${SITE_DESCRIPTION}
> A Hong Konger's bilingual (Cantonese / English) personal blog from the UK — essays, travelogues, philosophy, and notes on emigrating.

## About
- [關於 · About](${SITE_URL}/about.html): 關於作者言又勤 Yin Yau Kan

## Writing
${llmsPostLines}

## Mini Games
- [小遊戲 · Mini Games](${SITE_URL}/minigames/): browser games built for fun
- [Cats — A Logic Puzzle](${SITE_URL}/minigames/catspuzzle/): a Star-Battle-style logic puzzle — one cat per colour, row and column, no two cats may touch

## Links
- [RSS feed](${SITE_URL}/feed.xml)
- [Instagram](https://www.instagram.com/yykan411/)
- [Facebook](https://www.facebook.com/YYKan411)
`;

fs.writeFileSync(LLMS, llmsTxt);
console.log('✓ llms.txt updated');

console.log(`✓ done — ${posts.length} post(s), ${urls.length} sitemap URL(s), ${Math.min(posts.length, MAX_FEED_ITEMS)} feed item(s)`);
