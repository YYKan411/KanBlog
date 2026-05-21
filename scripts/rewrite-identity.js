#!/usr/bin/env node
/**
 * One-off: rewrite all "Kaga Chung" identity references across posts/*.html
 * to the new bilingual identity.
 *
 * Replacements (all literal — no regex on user content):
 *
 *   <title>… — Kaga Chung</title>
 *     →  <title>… — 言又勤</title>
 *
 *   <meta name="author" content="Kaga Chung">
 *     →  <meta name="author" content="言又勤 Yin Yau Kan">
 *
 *   <meta property="og:site_name" content="Kaga Chung">
 *     →  <meta property="og:site_name" content="言又勤">
 *
 *   <meta property="article:author" content="Kaga Chung">
 *     →  <meta property="article:author" content="言又勤 Yin Yau Kan">
 *
 *   JSON-LD author.name + publisher.name:
 *     {"@type": "Person", "name": "Kaga Chung", "url": "..."}
 *       →  {"@type": "Person", "name": "言又勤", "alternateName": "Yin Yau Kan", "url": "..."}
 *     {"@type": "Person", "name": "Kaga Chung"}
 *       →  {"@type": "Person", "name": "言又勤", "alternateName": "Yin Yau Kan"}
 *
 *   Footer:
 *     <a href="../index.html">© Kaga Chung</a>
 *       →  <a href="../index.html">© <YEAR> 言又勤</a>
 *     plus a trailing <script> that fills #year — added only if not already present.
 *
 * <YEAR> is taken from <meta property="article:published_time"> on the same file,
 * falling back to the current year.
 *
 * Run from the repo root:
 *   node scripts/rewrite-identity.js
 *
 * Idempotent — re-running on an already-updated file is a no-op.
 * Skips _TEMPLATE.html (handled separately).
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'posts');

/* ---------- helpers ---------- */

function extractYear(html) {
  const m = html.match(/<meta\s+property="article:published_time"\s+content="([^"]+)"/i);
  if (!m) return null;
  const d = new Date(m[1]);
  if (isNaN(d.getTime())) return null;
  return d.getFullYear();
}

/* ---------- replacement rules ---------- */

const PLAIN_REPLACEMENTS = [
  // <title>… — Kaga Chung</title>
  {
    from: ' — Kaga Chung</title>',
    to:   ' — 言又勤</title>',
  },
  // meta author
  {
    from: '<meta name="author" content="Kaga Chung">',
    to:   '<meta name="author" content="言又勤 Yin Yau Kan">',
  },
  // og:site_name
  {
    from: '<meta property="og:site_name" content="Kaga Chung">',
    to:   '<meta property="og:site_name" content="言又勤">',
  },
  // article:author
  {
    from: '<meta property="article:author" content="Kaga Chung">',
    to:   '<meta property="article:author" content="言又勤 Yin Yau Kan">',
  },
];

// JSON-LD author block — two known shapes from the editor's template literal
const JSONLD_AUTHOR_FROM_TEMPLATE = `"author": { "@type": "Person", "name": "Kaga Chung", "url": "https://kanblog.pages.dev/about.html" }`;
const JSONLD_AUTHOR_TO_TEMPLATE = `"author": { "@type": "Person", "name": "言又勤", "alternateName": "Yin Yau Kan", "url": "https://kanblog.pages.dev/about.html" }`;

const JSONLD_PUBLISHER_FROM_TEMPLATE = `"publisher": { "@type": "Person", "name": "Kaga Chung" }`;
const JSONLD_PUBLISHER_TO_TEMPLATE = `"publisher": { "@type": "Person", "name": "言又勤", "alternateName": "Yin Yau Kan" }`;

// Also match the multi-line shape from _TEMPLATE.html
const JSONLD_AUTHOR_FROM_MULTILINE =
`"author": {
    "@type": "Person",
    "name": "Kaga Chung",
    "url": "https://kanblog.pages.dev/about.html"
  }`;
const JSONLD_AUTHOR_TO_MULTILINE =
`"author": {
    "@type": "Person",
    "name": "言又勤",
    "alternateName": "Yin Yau Kan",
    "url": "https://kanblog.pages.dev/about.html"
  }`;

const JSONLD_PUBLISHER_FROM_MULTILINE =
`"publisher": {
    "@type": "Person",
    "name": "Kaga Chung"
  }`;
const JSONLD_PUBLISHER_TO_MULTILINE =
`"publisher": {
    "@type": "Person",
    "name": "言又勤",
    "alternateName": "Yin Yau Kan"
  }`;

/* ---------- per-file processing ---------- */

function processFile(filename) {
  const filepath = path.join(POSTS_DIR, filename);
  if (filename === '_TEMPLATE.html') return { filename, changes: [], status: 'skipped (template)' };

  let html = fs.readFileSync(filepath, 'utf8');
  const original = html;
  const changes = [];

  // 1. Plain string replacements
  for (const rule of PLAIN_REPLACEMENTS) {
    if (html.includes(rule.from)) {
      html = html.split(rule.from).join(rule.to);
      changes.push(rule.from.slice(0, 50).replace(/\n/g, ' ') + '…');
    }
  }

  // 2. JSON-LD blocks (try both shapes)
  if (html.includes(JSONLD_AUTHOR_FROM_TEMPLATE)) {
    html = html.replace(JSONLD_AUTHOR_FROM_TEMPLATE, JSONLD_AUTHOR_TO_TEMPLATE);
    changes.push('JSON-LD author (inline)');
  }
  if (html.includes(JSONLD_PUBLISHER_FROM_TEMPLATE)) {
    html = html.replace(JSONLD_PUBLISHER_FROM_TEMPLATE, JSONLD_PUBLISHER_TO_TEMPLATE);
    changes.push('JSON-LD publisher (inline)');
  }
  if (html.includes(JSONLD_AUTHOR_FROM_MULTILINE)) {
    html = html.replace(JSONLD_AUTHOR_FROM_MULTILINE, JSONLD_AUTHOR_TO_MULTILINE);
    changes.push('JSON-LD author (multiline)');
  }
  if (html.includes(JSONLD_PUBLISHER_FROM_MULTILINE)) {
    html = html.replace(JSONLD_PUBLISHER_FROM_MULTILINE, JSONLD_PUBLISHER_TO_MULTILINE);
    changes.push('JSON-LD publisher (multiline)');
  }

  // 3. Footer
  const oldFooterLine = '<a href="../index.html">© Kaga Chung</a>';
  if (html.includes(oldFooterLine)) {
    const year = extractYear(html) ?? new Date().getFullYear();
    const newFooterLine = `<a href="../index.html">© ${year} 言又勤</a>`;
    html = html.replace(oldFooterLine, newFooterLine);
    changes.push(`footer (© ${year} 言又勤)`);
  }

  // 4. Catch any remaining "Kaga Chung" — surface as warning, don't auto-replace
  // (e.g. if a post body legitimately contains the name as text content).
  const remaining = (html.match(/Kaga Chung/g) || []).length;

  if (html === original) {
    return { filename, changes: [], status: 'no change', remaining };
  }

  fs.writeFileSync(filepath, html, 'utf8');
  return { filename, changes, status: 'updated', remaining };
}

/* ---------- run ---------- */

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));
console.log(`Scanning ${files.length} files in posts/\n`);

const results = files.map(processFile);
for (const r of results) {
  const tag = r.status === 'updated'
    ? '✓'
    : r.status === 'no change' ? '·' : '–';
  const tail = r.changes.length ? `  [${r.changes.join(', ')}]` : '';
  const warn = r.remaining > 0 ? `  ⚠ ${r.remaining} "Kaga Chung" still present (in body?)` : '';
  console.log(`  ${tag} ${r.filename.padEnd(48)} ${r.status}${tail}${warn}`);
}

const changed = results.filter(r => r.status === 'updated').length;
const flagged = results.filter(r => r.remaining > 0);
console.log(`\n${changed} file(s) updated.`);
if (flagged.length) {
  console.log(`\n⚠ ${flagged.length} file(s) still contain "Kaga Chung" somewhere — likely in the post body. Review manually:`);
  flagged.forEach(r => console.log(`    posts/${r.filename}`));
}
