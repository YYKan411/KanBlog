/**
 * 思想偵探室 · The Thought Detective's Office
 * Case-based SQL lab — one real dataset (16 historical thinkers), no theme
 * switcher. Each case renders several steps: most are pre-filled, freely
 * editable/runnable demonstrations (SQL Murder Mystery style — no gating);
 * a few are graded exercises reusing the same validate() contract as the
 * old per-theme lessons (type: sql | columns | explain | index | fix).
 */
import { PHILOSOPHERS_SEED } from './philosophers-data.js';
import { CASES } from './cases.js';
import {
  initSQL,
  loadThemeDatabase,
  runSQL,
  runExpected,
  resultsEqual,
  listTables,
  tableInfo,
  listIndexes,
  indexColumns
} from './db.js';

const KEY = 'yykan-learning-philosophy-v1';

const state = {
  completed: JSON.parse(localStorage.getItem(KEY + '-done') || '{}'),
  hintLevel: {},
  case: null
};

const $ = (s, root = document) => root.querySelector(s);

async function boot() {
  try {
    await initSQL();
  } catch (e) {
    document.getElementById('case-nav').textContent = '載入失敗 · Failed to load: ' + e.message;
    return;
  }
  await loadThemeDatabase({ cleanSQL: PHILOSOPHERS_SEED }, { dirty: false });
  renderNav();
  const first = CASES.find((c) => !isCaseDone(c)) || CASES[0];
  openCase(first.id);
}

function isCaseDone(c) {
  return c.steps.every((s, i) => s.kind !== 'exercise' || state.completed[c.id + ':' + i]);
}

function renderNav() {
  const nav = $('#case-nav');
  nav.innerHTML = '';
  CASES.forEach((c) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lesson-link' + (isCaseDone(c) ? ' done' : '');
    btn.dataset.id = c.id;
    btn.innerHTML = `<span class="zh">${c.title.zh}</span><span class="en" lang="en">${c.title.en}</span>`;
    btn.addEventListener('click', () => openCase(c.id));
    nav.appendChild(btn);
  });
  $('#progress').textContent = CASES.filter(isCaseDone).length + ' / ' + CASES.length;
}

function openCase(id) {
  const c = CASES.find((x) => x.id === id);
  if (!c) return;
  state.case = c;

  document.querySelectorAll('#case-nav .lesson-link').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.id === id);
  });

  $('#case-title-zh').textContent = c.title.zh;
  $('#case-title-en').textContent = c.title.en;
  $('#case-premise-zh').textContent = c.premise.zh;
  $('#case-premise-en').textContent = c.premise.en;

  const container = $('#steps-container');
  container.innerHTML = '';
  c.steps.forEach((step, i) => container.appendChild(renderStep(c, step, i)));

  const tables = listTables();
  window.scrollTo({ top: 0 });
  void tables; // schema already shown once, always-visible, in the ERD note
}

function renderStep(c, step, i) {
  const wrap = document.createElement('div');
  wrap.className = 'step';
  const isExercise = step.kind === 'exercise';

  wrap.innerHTML = `
    <p class="step-num">${isExercise ? '練習 · EXERCISE' : ('第 ' + (i + 1) + ' 步 · STEP ' + (i + 1))}</p>
    <p class="step-lead">
      <span class="zh">${step.lead.zh}</span><br>
      <span class="en" lang="en">${step.lead.en}</span>
    </p>
    <div class="editor-block">
      <div class="editor-bar">
        <span>SQL · SQLite</span>
        <button type="button" class="btn-run">${isExercise ? '核對 · Check' : '執行 · Run'}</button>
      </div>
      <textarea class="step-editor" spellcheck="false" aria-label="SQL editor"></textarea>
    </div>
    ${isExercise ? '<div class="actions"><button type="button" class="btn-hint">提示 · Hint</button></div>' : ''}
    <div class="hint-box" hidden></div>
    <div class="results"></div>
    <p class="status-line"></p>
    ${step.payoff ? `<div class="step-payoff"><p class="zh">${step.payoff.zh}</p><p class="en" lang="en">${step.payoff.en}</p></div>` : ''}
  `;

  const editor = wrap.querySelector('.step-editor');
  editor.value = isExercise ? step.starter : step.sql;

  wrap.querySelector('.btn-run').addEventListener('click', () => runStep(c, step, i, editor, wrap));
  if (isExercise) {
    wrap.querySelector('.btn-hint').addEventListener('click', () => showStepHint(c, step, i, wrap));
  }
  return wrap;
}

function runStep(c, step, i, editor, wrap) {
  const resultEl = wrap.querySelector('.results');
  const statusEl = wrap.querySelector('.status-line');
  let result;
  try {
    result = runSQL(editor.value);
  } catch (e) {
    resultEl.innerHTML = `<p class="err">${escapeHtml(e.message)}</p>`;
    if (step.kind === 'exercise') statusEl.textContent = '錯誤 · Error';
    return;
  }
  renderResult(resultEl, result);

  if (step.kind === 'demo') {
    const payoffEl = wrap.querySelector('.step-payoff');
    if (payoffEl) payoffEl.classList.add('show');
    return;
  }

  const verdict = validate(step.validate, editor.value, result);
  statusEl.textContent = verdict.pass
    ? '✓ 過關 · Passed'
    : '未啱 · Not yet' + (verdict.reason ? ' — ' + verdict.reason : '');

  if (verdict.pass) {
    state.completed[c.id + ':' + i] = true;
    localStorage.setItem(KEY + '-done', JSON.stringify(state.completed));
    renderNav();
    document.querySelectorAll('#case-nav .lesson-link').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.id === c.id);
    });
    const payoffEl = wrap.querySelector('.step-payoff');
    if (payoffEl) payoffEl.classList.add('show');
  }
}

function showStepHint(c, step, i, wrap) {
  const key = c.id + ':' + i;
  const level = state.hintLevel[key] || 0;
  const hintEl = wrap.querySelector('.hint-box');
  hintEl.hidden = false;
  const zh = step.hints.zh[Math.min(level, step.hints.zh.length - 1)];
  const en = step.hints.en[Math.min(level, step.hints.en.length - 1)];
  hintEl.innerHTML = `<div class="pair"><p class="zh">${escapeHtml(zh)}</p><p class="en" lang="en">${escapeHtml(en)}</p></div>`;
  state.hintLevel[key] = level + 1;
}

/** True only for a top-level ORDER BY — ignores one nested inside parentheses
 *  (a window function's OVER(...), or a subquery), which does not control the
 *  outer query's own row order. */
function hasTopLevelOrderBy(sql) {
  let depth = 0;
  let out = '';
  for (const ch of sql) {
    if (ch === '(') { depth++; continue; }
    if (ch === ')') { depth = Math.max(0, depth - 1); continue; }
    if (depth === 0) out += ch;
  }
  return /order by/i.test(out);
}

function stripSQLComments(sql) {
  return sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function missingRequiredPhrases(spec, userSQL) {
  if (!spec.mustContainSQL || !spec.mustContainSQL.length) return [];
  // Strip comments first — otherwise a required keyword smuggled into a
  // trailing `-- not exists` (never actually executed) would still count.
  const lower = stripSQLComments(userSQL).toLowerCase();
  return spec.mustContainSQL.filter((s) => !lower.includes(s.toLowerCase()));
}

/** e.g. an exercise that asks specifically for UNION should not silently
 *  accept UNION ALL just because the substring "union" is a match too. */
function forbiddenPhrasesFound(spec, userSQL) {
  if (!spec.mustNotContainSQL || !spec.mustNotContainSQL.length) return [];
  const lower = stripSQLComments(userSQL).toLowerCase();
  return spec.mustNotContainSQL.filter((s) => lower.includes(s.toLowerCase()));
}

function validate(spec, userSQL, result) {
  if (spec.type === 'explain') {
    const isExplain = result.kind === 'explain' || /^\s*EXPLAIN\b/i.test(userSQL);
    if (!isExplain) return { pass: false, reason: '需要 EXPLAIN QUERY PLAN · Need EXPLAIN QUERY PLAN' };
    const missing = missingRequiredPhrases(spec, userSQL);
    if (missing.length) {
      return { pass: false, reason: 'EXPLAIN 要分析返呢堂本身嗰條 query · EXPLAIN must analyse the case\'s own query (missing: ' + missing.join(', ') + ')' };
    }
    return { pass: true, reason: '' };
  }
  if (spec.type === 'index') {
    const idx = listIndexes().find((i) => i.name.toLowerCase() === spec.name.toLowerCase());
    if (!idx) return { pass: false, reason: '搵唔到 index · Index not found: ' + spec.name };
    if (spec.table && idx.table.toLowerCase() !== spec.table.toLowerCase()) {
      return { pass: false, reason: 'Index 建喺錯嘅表 · Index is on the wrong table: ' + idx.table };
    }
    if (spec.column) {
      const cols = indexColumns(idx.name).map((c) => c.toLowerCase());
      if (!cols.includes(spec.column.toLowerCase())) {
        return { pass: false, reason: 'Index 冇覆蓋到嗰個欄 · Index does not cover column: ' + spec.column };
      }
    }
    return { pass: true, reason: '' };
  }
  if (spec.type === 'fix') {
    const missingPhrases = missingRequiredPhrases(spec, userSQL);
    if (missingPhrases.length) {
      return { pass: false, reason: 'SQL 要用到 · Your SQL must use: ' + missingPhrases.join(', ') };
    }
    let check;
    try {
      check = runExpected(spec.checkSQL);
    } catch (e) {
      return { pass: false, reason: e.message };
    }
    const equal = resultsEqual(
      { columns: spec.columns, values: spec.expectedValues },
      { columns: check.columns, values: check.values },
      { requireOrder: false }
    );
    return { pass: equal, reason: equal ? '' : '資料仲未見到啱嘅修正 · The data does not show the expected fix yet' };
  }
  if (spec.expectedSQL) {
    let expected;
    try {
      expected = runExpected(spec.expectedSQL);
    } catch (e) {
      return { pass: false, reason: e.message };
    }
    if (spec.columns) {
      const have = (result.columns || []).map((c) => c.toLowerCase());
      const missing = spec.columns.map((c) => c.toLowerCase()).filter((c) => !have.includes(c));
      if (missing.length) {
        return { pass: false, reason: '缺欄 · Missing columns: ' + missing.join(', ') };
      }
    }
    const missingPhrases = missingRequiredPhrases(spec, userSQL);
    if (missingPhrases.length) {
      return { pass: false, reason: 'SQL 要用到 · Your SQL must use: ' + missingPhrases.join(', ') };
    }
    const forbidden = forbiddenPhrasesFound(spec, userSQL);
    if (forbidden.length) {
      return { pass: false, reason: '呢堂特登要避開 · This exercise specifically wants you to avoid: ' + forbidden.join(', ') };
    }
    const equal = resultsEqual(
      { columns: expected.columns, values: expected.values },
      { columns: result.columns, values: result.values },
      { requireOrder: hasTopLevelOrderBy(spec.expectedSQL) }
    );
    return { pass: equal, reason: equal ? '' : '結果同預期唔啱 · Rows do not match expected' };
  }
  return { pass: false, reason: '無驗證規則 · No rule' };
}

function renderResult(el, result) {
  let html = `<p class="result-meta ${result.ok ? 'ok' : ''}">${result.kind} · ${result.ms} ms</p>`;
  if (result.columns?.length) {
    html += '<div class="table-wrap"><table><thead><tr>';
    html += result.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
    html += '</tr></thead><tbody>';
    for (const row of result.values.slice(0, 100)) {
      html += '<tr>' + row.map((v) => (v === null ? '<td><em>NULL</em></td>' : `<td>${escapeHtml(String(v))}</td>`)).join('') + '</tr>';
    }
    html += '</tbody></table></div>';
  } else if (result.kind === 'write') {
    html += `<p class="muted">OK · ${result.rowsAffected} row(s) affected</p>`;
  } else {
    html += '<p class="muted">(無結果 · no rows)</p>';
  }
  el.innerHTML = html;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

boot();
