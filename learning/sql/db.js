/**
 * SQLite 引擎（sql.js WASM）—— 本地 vendor，避開 CSP 擋 CDN
 */
let SQL = null;
let db = null;

function getInitSqlJs() {
  const fn = globalThis.initSqlJs;
  if (typeof fn !== 'function') {
    throw new Error(
      'sql.js 尚未載入。請確認 ./vendor/sql-wasm.js 已用 <script> 引入。'
    );
  }
  return fn;
}

export async function initSQL() {
  if (SQL) return SQL;
  const initSqlJs = getInitSqlJs();
  const base = new URL('./vendor/', import.meta.url);
  SQL = await initSqlJs({
    locateFile: (file) => new URL(file, base).href
  });
  return SQL;
}

export async function loadThemeDatabase(theme, { dirty = false } = {}) {
  await initSQL();
  if (db) {
    try { db.close(); } catch (_) { /* ignore */ }
  }
  db = new SQL.Database();
  db.run(theme.cleanSQL);
  if (dirty) {
    applyDirtySQL(db, theme.dirtySQL);
  }
  return db;
}

export function getDb() {
  return db;
}

export function runSQL(sql) {
  if (!db) throw new Error('資料庫尚未載入');
  const trimmed = sql.trim();
  if (!trimmed) throw new Error('請輸入 SQL');

  const start = performance.now();
  // Support multiple statements; return last result set
  const statements = splitStatements(trimmed);
  let lastResult = { columns: [], values: [], rowsAffected: 0, ms: 0, kind: 'empty' };

  for (const statement of statements) {
    const upper = statement.trim().toUpperCase();
    if (
      upper.startsWith('SELECT') ||
      upper.startsWith('WITH') ||
      upper.startsWith('EXPLAIN') ||
      upper.startsWith('PRAGMA')
    ) {
      const res = db.exec(statement);
      if (res.length === 0) {
        lastResult = { columns: [], values: [], rowsAffected: 0, kind: 'empty' };
      } else {
        lastResult = {
          columns: res[0].columns,
          values: res[0].values,
          rowsAffected: res[0].values.length,
          kind: upper.startsWith('EXPLAIN') ? 'explain' : 'select'
        };
      }
    } else {
      db.run(statement);
      lastResult = {
        columns: [],
        values: [],
        rowsAffected: db.getRowsModified(),
        kind: 'write'
      };
    }
  }

  lastResult.ms = Math.round((performance.now() - start) * 100) / 100;
  lastResult.sql = trimmed;
  return lastResult;
}

function applyDirtySQL(db, dirtySQL) {
  for (const stmt of dirtySQL.split(';')) {
    const s = stmt
      .split('\n')
      .map((line) => line.replace(/--.*$/, ''))
      .join('\n')
      .trim();
    if (!s) continue;
    try {
      db.run(s);
    } catch (_) {
      /* skip failed dirty injection */
    }
  }
}

function splitStatements(sql) {
  const out = [];
  let cur = '';
  let inSingle = false;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "'" && sql[i + 1] === "'") {
      cur += "''";
      i++;
      continue;
    }
    if (ch === "'") {
      inSingle = !inSingle;
      cur += ch;
      continue;
    }
    if (ch === ';' && !inSingle) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function tableInfo(tableName) {
  if (!db) return null;
  const info = db.exec(`PRAGMA table_info(${quoteIdent(tableName)})`);
  if (!info.length) return null;
  return info[0].values.map((r) => ({
    cid: r[0],
    name: r[1],
    type: r[2],
    notnull: r[3],
    dflt: r[4],
    pk: r[5]
  }));
}

export function listTables() {
  if (!db) return [];
  const res = db.exec(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
  );
  if (!res.length) return [];
  return res[0].values.map((v) => v[0]);
}

export function listIndexes() {
  if (!db) return [];
  const res = db.exec(
    `SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL`
  );
  if (!res.length) return [];
  return res[0].values.map((v) => ({ name: v[0], table: v[1], sql: v[2] }));
}

function quoteIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

/** Compare two result sets (order-insensitive for rows unless requireOrder) */
export function resultsEqual(a, b, { requireOrder = false } = {}) {
  if (!a || !b) return false;
  if (a.columns.length !== b.columns.length) return false;
  const colMap = mapColumns(a.columns, b.columns);
  if (!colMap) return false;

  const normA = normalizeRows(a.values, a.columns.length);
  const normB = normalizeRows(
    b.values.map((row) => colMap.map((i) => row[i])),
    a.columns.length
  );

  if (normA.length !== normB.length) return false;
  if (requireOrder) {
    return JSON.stringify(normA) === JSON.stringify(normB);
  }
  const sa = [...normA].sort();
  const sb = [...normB].sort();
  return JSON.stringify(sa) === JSON.stringify(sb);
}

function mapColumns(expectedCols, actualCols) {
  const lowerE = expectedCols.map((c) => c.toLowerCase());
  const lowerA = actualCols.map((c) => c.toLowerCase());
  const idxs = [];
  for (const c of lowerE) {
    const i = lowerA.indexOf(c);
    if (i === -1) return null;
    idxs.push(i);
  }
  return idxs;
}

function normalizeRows(values, width) {
  return values.map((row) =>
    Array.from({ length: width }, (_, i) => {
      const v = row[i];
      if (v === null || v === undefined) return '∅';
      if (typeof v === 'number') return String(Math.round(v * 10000) / 10000);
      return String(v);
    }).join('\t')
  );
}

export function runExpected(expectedSQL) {
  return runSQL(expectedSQL);
}
