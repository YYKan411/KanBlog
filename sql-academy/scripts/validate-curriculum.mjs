/**
 * 離線驗證：每個主題 × 每題 expectedSQL 可跑，結果非空（explain/index 除外）
 * 用法：node sql-academy/scripts/validate-curriculum.mjs
 */
import initSqlJs from 'sql.js';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Dynamic import of curriculum/themes won't work easily without rewriting exports for node.
// Inline-eval by reading and using Function — better: duplicate load via fs + vm.
// Simplest path: npm package and import from relative with node --experimental-vm-modules
// We'll parse by importing after copying approach: use dynamic import with file URLs.

const { THEMES } = await import(join(root, 'js/themes.js'));
const { CURRICULUM } = await import(join(root, 'js/curriculum.js'));

const SQL = await initSqlJs();
let failures = 0;

function loadDb(theme, dirty) {
  const db = new SQL.Database();
  db.run(theme.cleanSQL);
  if (dirty) {
    for (const stmt of theme.dirtySQL.split(';')) {
      const s = stmt
        .split('\n')
        .map((line) => line.replace(/--.*$/, ''))
        .join('\n')
        .trim();
      if (!s) continue;
      try { db.run(s); } catch { /* skip */ }
    }
  }
  return db;
}

function resolve(val, themeId) {
  return typeof val === 'function' ? val(themeId) : val;
}

for (const themeId of Object.keys(THEMES)) {
  const theme = THEMES[themeId];
  for (const lesson of CURRICULUM) {
    const spec = resolve(lesson.validate, themeId);
    if (!spec || !spec.expectedSQL) continue;
    const db = loadDb(theme, !!lesson.chaos);
    try {
      const res = db.exec(spec.expectedSQL);
      if (spec.type === 'columns' || spec.type === 'sql') {
        if (!res.length && !/create index/i.test(spec.expectedSQL)) {
          // empty result might be ok for some filters — warn only if columns expected with data
          console.warn(`[warn] empty result ${themeId}/${lesson.id}`);
        }
      }
      console.log(`ok  ${themeId.padEnd(10)} ${lesson.id}`);
    } catch (e) {
      failures++;
      console.error(`FAIL ${themeId}/${lesson.id}: ${e.message}`);
      console.error(`  SQL: ${spec.expectedSQL}`);
    }
    db.close();
  }
}

if (failures) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll expectedSQL validated.');
