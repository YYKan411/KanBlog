/**
 * 效能與架構評判官
 */
import { runSQL, listIndexes } from './db.js';
import { explainPlanInCantonese } from './tutor.js';

export function analyzeExplain(userSQL) {
  const sql = userSQL.trim();
  const isExplain = /^\s*EXPLAIN\b/i.test(sql);
  if (!isExplain) {
    // Auto-wrap for analysis button
    try {
      const plan = runSQL(`EXPLAIN QUERY PLAN ${stripExplain(sql)}`);
      return {
        ok: true,
        autoWrapped: true,
        plan,
        narrative: explainPlanInCantonese(plan.values)
      };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
  try {
    const plan = runSQL(sql);
    return {
      ok: true,
      autoWrapped: false,
      plan,
      narrative: explainPlanInCantonese(plan.values)
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function stripExplain(sql) {
  return sql.replace(/^\s*EXPLAIN\s+(QUERY\s+PLAN\s+)?/i, '');
}

export function architectCritique(userSQL, resultMeta) {
  const s = userSQL.toLowerCase();
  const notes = [];

  if (/\bselect\s+\*/i.test(userSQL)) {
    notes.push('用咗 SELECT *——喺寬表／遠端查詢會浪費 IO。生產環境應只投影需要欄。');
  }
  if (/from\s+\w+\s*,\s*\w+/i.test(userSQL)) {
    notes.push('偵測到逗號式多表（隱式 JOIN）。好易笛卡爾積。請改寫成 JOIN ... ON。');
  }
  if (!/\bwhere\b/i.test(s) && /\bjoin\b/i.test(s) && resultMeta?.values?.length > 50) {
    notes.push('有 JOIN 但冇 WHERE，結果集可能過大。');
  }
  if (/\bor\b/i.test(s) && /\blike\b/i.test(s)) {
    notes.push('OR + LIKE 組合經常令索引失效（視優化器而定）。大數據下要小心。');
  }

  const indexes = listIndexes();
  if (indexes.length) {
    notes.push(`目前自訂索引：${indexes.map((i) => i.name).join(', ') || '無'}。`);
  } else {
    notes.push('尚未建立自訂索引。對高頻過濾欄建 INDEX，再用 EXPLAIN 對比 SCAN→SEARCH。');
  }

  if (resultMeta?.ms != null) {
    notes.push(`本機執行約 ${resultMeta.ms} ms（示範庫很小；相對差異先有意義）。`);
  }

  if (!notes.length) {
    notes.push('未發現明顯反模式。下一步：對同一邏輯做 EXPLAIN，確認有冇不必要嘅 SCAN。');
  }

  return `算力評判官筆記：\n• ${notes.join('\n• ')}\n\n記住：答案啱唔代表夠快。1 億列先係真正戰場。`;
}
