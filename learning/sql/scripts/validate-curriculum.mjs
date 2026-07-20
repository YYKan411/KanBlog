/**
 * Validate expectedSQL across themes
 */
import initSqlJs from 'sql.js';
import { THEMES } from '../themes.js';
import { CURRICULUM } from '../curriculum.js';

const SQL = await initSqlJs();
let failures = 0;

function resolve(val, themeId) {
  return typeof val === 'function' ? val(themeId) : val;
}

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

for (const themeId of Object.keys(THEMES)) {
  for (const lesson of CURRICULUM) {
    const spec = resolve(lesson.validate, themeId);
    if (!spec?.expectedSQL) continue;
    const db = loadDb(THEMES[themeId], !!lesson.chaos);
    try {
      db.exec(spec.expectedSQL);
      console.log(`ok  ${themeId.padEnd(10)} ${lesson.id}`);
    } catch (e) {
      failures++;
      console.error(`FAIL ${themeId}/${lesson.id}: ${e.message}`);
    }
    db.close();
  }
}

if (failures) process.exit(1);
console.log('\nAll expectedSQL validated.');
