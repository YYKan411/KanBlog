/**
 * Simplified bilingual SQL lab
 */
import { getTheme } from './themes.js';
import { CURRICULUM } from './curriculum.js';
import {
  initSQL,
  loadThemeDatabase,
  runSQL,
  runExpected,
  resultsEqual,
  listTables,
  tableInfo,
  listIndexes
} from './db.js';

const KEY = 'yykan-learning-sql-v1';

const state = {
  themeId: localStorage.getItem(KEY + '-theme') || 'stocks',
  completed: JSON.parse(localStorage.getItem(KEY + '-done') || '{}'),
  hintLevel: {},
  lesson: null,
  lang: 'both' // zh | en | both — for hint preference; briefing uses CSS toggle
};

const $ = (s) => document.querySelector(s);

function resolve(val, themeId) {
  return typeof val === 'function' ? val(themeId) : val;
}

function saveDone() {
  localStorage.setItem(KEY + '-done', JSON.stringify(state.completed));
}

async function boot() {
  $('#status').textContent = '載入 SQLite 中… · Loading SQLite…';
  try {
    await initSQL();
  } catch (e) {
    $('#status').textContent = '失敗 · Failed: ' + e.message;
    return;
  }

  document.querySelectorAll('[data-theme]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.theme === state.themeId);
    btn.addEventListener('click', async () => {
      state.themeId = btn.dataset.theme;
      localStorage.setItem(KEY + '-theme', state.themeId);
      document.querySelectorAll('[data-theme]').forEach((b) =>
        b.classList.toggle('is-active', b.dataset.theme === state.themeId)
      );
      await openLesson(state.lesson?.id || CURRICULUM[0].id);
    });
  });

  renderNav();
  const first = CURRICULUM.find((l) => !state.completed[l.id]) || CURRICULUM[0];
  await openLesson(first.id);

  $('#btn-run').addEventListener('click', runCheck);
  $('#btn-hint').addEventListener('click', showHint);
  $('#sql-editor').addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runCheck();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const a = el.selectionStart;
      el.value = el.value.slice(0, a) + '  ' + el.value.slice(el.selectionEnd);
      el.selectionStart = el.selectionEnd = a + 2;
    }
  });
}

function renderNav() {
  const nav = $('#lesson-nav');
  nav.innerHTML = '';
  let stage = '';
  for (const lesson of CURRICULUM) {
    if (lesson.stage !== stage) {
      stage = lesson.stage;
      const h = document.createElement('p');
      h.className = 'stage-label';
      h.textContent = '階段 · Stage ' + stage;
      nav.appendChild(h);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lesson-link' + (state.completed[lesson.id] ? ' done' : '');
    btn.dataset.id = lesson.id;
    btn.innerHTML = `<span class="zh">${lesson.title.zh}</span><span class="en" lang="en">${lesson.title.en}</span>`;
    btn.addEventListener('click', () => openLesson(lesson.id));
    nav.appendChild(btn);
  }
  $('#progress').textContent =
    Object.keys(state.completed).filter((k) => state.completed[k]).length +
    ' / ' +
    CURRICULUM.length;
}

async function openLesson(id) {
  const lesson = CURRICULUM.find((l) => l.id === id);
  if (!lesson) return;
  state.lesson = lesson;
  state.hintLevel[id] = state.hintLevel[id] || 0;

  document.querySelectorAll('.lesson-link').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.id === id);
  });

  const theme = getTheme(state.themeId);
  await loadThemeDatabase(theme, { dirty: !!lesson.chaos });

  const brief = lesson.briefing[state.themeId] || lesson.briefing.football;
  $('#mission-title-zh').textContent = lesson.title.zh;
  $('#mission-title-en').textContent = lesson.title.en;
  $('#brief-zh').textContent = brief.zh;
  $('#brief-en').textContent = brief.en;
  $('#intro-zh').textContent = lesson.intro.zh;
  $('#intro-en').textContent = lesson.intro.en;
  $('#concepts').textContent = (lesson.concepts || []).join(' · ');
  $('#hint-box').hidden = true;
  $('#hint-box').textContent = '';

  const starter = resolve(lesson.starter, state.themeId);
  $('#sql-editor').value = starter;

  const tables = listTables();
  $('#schema').innerHTML = tables
    .map((t) => {
      const cols = (tableInfo(t) || []).map((c) => c.name).join(', ');
      return `<button type="button" class="schema-btn" data-table="${t}" title="${cols}">${t}</button>`;
    })
    .join('');
  $('#schema').querySelectorAll('.schema-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const cols = (tableInfo(b.dataset.table) || [])
        .map((c) => c.name + ':' + (c.type || '?'))
        .join(', ');
      $('#status').textContent = b.dataset.table + ' → ' + cols;
    });
  });

  $('#results').innerHTML =
    '<p class="muted">結果會顯示喺呢度 · Results appear here</p>';
  $('#status').textContent = lesson.chaos
    ? theme.name + ' · 髒數據模式 · dirty data'
    : theme.name + ' · 乾淨模式 · clean data';
}

function showHint() {
  const lesson = state.lesson;
  const level = state.hintLevel[lesson.id] || 0;
  const zh = lesson.hints.zh[Math.min(level, lesson.hints.zh.length - 1)];
  const en = lesson.hints.en[Math.min(level, lesson.hints.en.length - 1)];
  state.hintLevel[lesson.id] = level + 1;
  const box = $('#hint-box');
  box.hidden = false;
  box.innerHTML = `<div class="pair"><p class="zh">${escapeHtml(zh)}</p><p class="en" lang="en">${escapeHtml(en)}</p></div>`;
}

async function runCheck() {
  const sql = $('#sql-editor').value;
  let result;
  try {
    result = runSQL(sql);
  } catch (e) {
    $('#results').innerHTML = `<p class="err">${escapeHtml(e.message)}</p>`;
    $('#status').textContent = '錯誤 · Error';
    return;
  }

  const verdict = validate(state.lesson, sql, result);
  renderResult(result, verdict.pass);
  $('#status').textContent = verdict.pass
    ? '✓ 過關 · Passed'
    : '未啱 · Not yet' + (verdict.reason ? ' — ' + verdict.reason : '');

  if (verdict.pass) {
    state.completed[state.lesson.id] = true;
    saveDone();
    renderNav();
    document.querySelectorAll('.lesson-link').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.id === state.lesson.id);
    });
  }
}

function validate(lesson, userSQL, result) {
  const spec = resolve(lesson.validate, state.themeId);

  if (spec.type === 'explain') {
    const ok = result.kind === 'explain' || /^\s*EXPLAIN\b/i.test(userSQL);
    return { pass: !!ok, reason: ok ? '' : '需要 EXPLAIN QUERY PLAN · Need EXPLAIN QUERY PLAN' };
  }
  if (spec.type === 'index') {
    const found = listIndexes().some(
      (i) => i.name.toLowerCase() === spec.name.toLowerCase()
    );
    return { pass: found, reason: found ? '' : '搵唔到 index · Index not found: ' + spec.name };
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
      const missing = spec.columns
        .map((c) => c.toLowerCase())
        .filter((c) => !have.includes(c));
      if (missing.length) {
        return { pass: false, reason: '缺欄 · Missing columns: ' + missing.join(', ') };
      }
    }
    const equal = resultsEqual(
      { columns: expected.columns, values: expected.values },
      { columns: result.columns, values: result.values },
      { requireOrder: /order by/i.test(spec.expectedSQL) }
    );
    if (spec.mustIncludeNullClub && equal) {
      const idx = result.columns.findIndex((c) => /club_name/i.test(c));
      if (idx >= 0 && !result.values.some((r) => r[idx] === null)) {
        return { pass: false, reason: 'LEFT JOIN 應該保留 NULL club_name · should keep NULL club_name' };
      }
    }
    return { pass: equal, reason: equal ? '' : '結果同預期唔啱 · Rows do not match expected' };
  }
  return { pass: false, reason: '無驗證規則 · No rule' };
}

function renderResult(result, pass) {
  let html = `<p class="result-meta ${pass ? 'ok' : ''}">${result.kind} · ${result.ms} ms</p>`;
  if (result.columns?.length) {
    html += '<div class="table-wrap"><table><thead><tr>';
    html += result.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
    html += '</tr></thead><tbody>';
    for (const row of result.values.slice(0, 100)) {
      html +=
        '<tr>' +
        row
          .map((v) =>
            v === null ? '<td><em>NULL</em></td>' : `<td>${escapeHtml(String(v))}</td>`
          )
          .join('') +
        '</tr>';
    }
    html += '</tbody></table></div>';
  } else if (result.kind === 'write') {
    html += `<p class="muted">OK · ${result.rowsAffected} row(s) affected</p>`;
  }
  $('#results').innerHTML = html;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

boot();
