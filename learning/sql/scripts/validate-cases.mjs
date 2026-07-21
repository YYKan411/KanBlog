/**
 * Validate all cases' SQL against the real sql.js WASM engine, and check
 * every step has the fields case-app.js's render/validate code requires.
 */
import initSqlJs from 'sql.js';
import { PHILOSOPHERS_SEED } from '../philosophers-data.js';
import { CASES } from '../cases.js';

const SQL = await initSqlJs();
let failures = 0;

function freshDb() {
  const db = new SQL.Database();
  db.run(PHILOSOPHERS_SEED);
  return db;
}

function checkStructure(c) {
  const problems = [];
  if (!c.title?.zh || !c.title?.en) problems.push('missing title');
  if (!c.premise?.zh || !c.premise?.en) problems.push('missing premise');
  c.steps.forEach((s, i) => {
    const loc = `step${i}`;
    if (!s.lead?.zh || !s.lead?.en) problems.push(`${loc}: missing lead`);
    if (!s.payoff?.zh || !s.payoff?.en) problems.push(`${loc}: missing payoff`);
    if (s.kind === 'demo') {
      if (!s.sql) problems.push(`${loc}: demo missing sql`);
    } else if (s.kind === 'exercise') {
      if (typeof s.starter !== 'string') problems.push(`${loc}: exercise missing starter`);
      if (!s.validate?.type) problems.push(`${loc}: exercise missing validate.type`);
      if (!s.hints?.zh?.length || s.hints.zh.length !== s.hints?.en?.length) {
        problems.push(`${loc}: hints zh/en missing or length mismatch`);
      }
      const v = s.validate || {};
      if (v.type === 'fix') {
        if (!v.checkSQL || !v.columns || !v.expectedValues) problems.push(`${loc}: fix validate incomplete`);
      } else if (v.type === 'index') {
        if (!v.name || !v.table || !v.column) problems.push(`${loc}: index validate incomplete`);
      } else if (v.type !== 'explain' && !v.expectedSQL) {
        problems.push(`${loc}: generic validate missing expectedSQL`);
      }
    } else {
      problems.push(`${loc}: unknown kind ${s.kind}`);
    }
  });
  return problems;
}

for (const c of CASES) {
  const structProblems = checkStructure(c);
  for (const p of structProblems) {
    failures++;
    console.error(`FAIL ${c.id}: ${p}`);
  }

  c.steps.forEach((s, i) => {
    const queries = [];
    if (s.kind === 'demo') queries.push(['sql', s.sql]);
    if (s.kind === 'exercise') {
      if (s.validate?.expectedSQL) queries.push(['expectedSQL', s.validate.expectedSQL]);
      if (s.validate?.checkSQL) queries.push(['checkSQL', s.validate.checkSQL]);
    }
    for (const [label, q] of queries) {
      const db = freshDb();
      try {
        db.run('BEGIN;');
        for (const stmt of q.split(';')) {
          const trimmed = stmt.trim();
          if (!trimmed) continue;
          const upper = trimmed.toUpperCase();
          if (upper.startsWith('SELECT') || upper.startsWith('WITH') || upper.startsWith('EXPLAIN') || upper.startsWith('PRAGMA')) {
            db.exec(trimmed);
          } else {
            db.run(trimmed);
          }
        }
      } catch (e) {
        failures++;
        console.error(`FAIL ${c.id} step${i} [${label}]: ${e.message}`);
      } finally {
        db.close();
      }
    }
  });

  if (!structProblems.length) console.log(`ok  ${c.id} — ${c.steps.length} steps`);
}

if (failures) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll cases validated against the real sql.js engine.');
