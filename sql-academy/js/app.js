/**
 * 解碼室 —— 主應用
 */
import { THEMES, getTheme } from './themes.js';
import { CURRICULUM } from './curriculum.js';
import {
  initSQL,
  runSQL,
  runExpected,
  resultsEqual,
  listTables,
  tableInfo,
  listIndexes
} from './db.js';
import { ensureChaosMode, chaosBriefingExtra } from './chaos.js';
import {
  localTutorReply,
  socraticKickoff,
  cloudTutor,
  scrubAnswerLeak
} from './tutor.js';
import { analyzeExplain, architectCritique } from './explain.js';
import {
  loadProgress,
  saveProgress,
  markComplete,
  bumpHint,
  completedCount
} from './progress.js';

const state = {
  progress: loadProgress(),
  theme: null,
  lesson: null,
  sqlReady: false
};

const $ = (sel) => document.querySelector(sel);

function toast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

/* ——— Landing ——— */
export function initLanding() {
  const overlay = $('#onboard');
  const startBtn = $('#btn-start');
  const resumeBtn = $('#btn-resume');
  const goBtn = $('#btn-enter-lab');
  const nameInput = $('#learner-name');

  if (state.progress.themeId && state.progress.learnerName) {
    resumeBtn?.classList.remove('hidden');
    resumeBtn.style.display = '';
  } else if (resumeBtn) {
    resumeBtn.style.display = 'none';
  }

  startBtn?.addEventListener('click', () => {
    overlay?.classList.add('open');
    nameInput.value = state.progress.learnerName || '';
    document.querySelectorAll('.theme-card').forEach((c) => {
      c.classList.toggle('selected', c.dataset.theme === state.progress.themeId);
    });
  });

  resumeBtn?.addEventListener('click', () => {
    if (!state.progress.themeId) {
      overlay?.classList.add('open');
      return;
    }
    location.href = './lab.html';
  });

  document.querySelectorAll('.theme-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  goBtn?.addEventListener('click', () => {
    const selected = document.querySelector('.theme-card.selected');
    const name = (nameInput.value || '').trim() || 'Analyst';
    if (!selected) {
      toast('請先揀一個興趣主題');
      return;
    }
    state.progress.learnerName = name;
    state.progress.themeId = selected.dataset.theme;
    saveProgress(state.progress);
    location.href = './lab.html';
  });
}

/* ——— Lab ——— */
export async function initLab() {
  if (!state.progress.themeId) {
    location.href = './index.html';
    return;
  }

  $('#boot-status').textContent = '載入 SQLite 引擎…';
  try {
    await initSQL();
    state.sqlReady = true;
  } catch (e) {
    $('#boot-status').textContent = '引擎載入失敗：' + e.message;
    return;
  }

  state.theme = getTheme(state.progress.themeId);
  $('#learner-pill').textContent = state.progress.learnerName || 'Analyst';
  $('#theme-pill').textContent = state.theme.name;
  $('#progress-pill').textContent = `${completedCount(state.progress)}/${CURRICULUM.length}`;

  const apiInput = $('#api-key');
  if (apiInput) apiInput.value = state.progress.apiKey || '';
  apiInput?.addEventListener('change', () => {
    state.progress.apiKey = apiInput.value.trim();
    saveProgress(state.progress);
  });

  renderLessonNav();
  const firstIncomplete =
    CURRICULUM.find((l) => !state.progress.completed[l.id]) || CURRICULUM[0];
  await openLesson(firstIncomplete.id);

  $('#btn-run')?.addEventListener('click', () => executeAndValidate());
  $('#btn-reset-sql')?.addEventListener('click', () => {
    const starter = resolve(state.lesson.starter, state.theme.id);
    $('#sql-editor').value = starter;
  });
  $('#btn-hint')?.addEventListener('click', () => askHint());
  $('#btn-explain')?.addEventListener('click', () => runExplainCoach());
  $('#btn-critique')?.addEventListener('click', () => runArchitect());
  $('#btn-ask')?.addEventListener('click', () => askFreeform());

  $('#sql-editor')?.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      executeAndValidate();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      el.value = el.value.slice(0, start) + '  ' + el.value.slice(end);
      el.selectionStart = el.selectionEnd = start + 2;
    }
  });
}

function resolve(val, themeId) {
  return typeof val === 'function' ? val(themeId) : val;
}

function renderLessonNav() {
  const ul = $('#lesson-list');
  ul.innerHTML = '';
  let lastStage = '';
  for (const lesson of CURRICULUM) {
    if (lesson.stage !== lastStage) {
      lastStage = lesson.stage;
      const h = document.createElement('h2');
      h.textContent = `Stage ${lesson.stage}`;
      ul.appendChild(h);
    }
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lesson-btn';
    if (state.progress.completed[lesson.id]) btn.classList.add('done');
    btn.innerHTML = `<span class="lesson-stage">${lesson.stageKey}</span><span class="lesson-title">${lesson.title}</span>`;
    btn.addEventListener('click', () => openLesson(lesson.id));
    btn.dataset.id = lesson.id;
    li.appendChild(btn);
    ul.appendChild(li);
  }
}

async function openLesson(id) {
  const lesson = CURRICULUM.find((l) => l.id === id);
  if (!lesson) return;
  state.lesson = lesson;

  document.querySelectorAll('.lesson-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.id === id);
  });

  const chaos = await ensureChaosMode(state.theme, lesson);
  const briefing =
    resolve(lesson.briefing, state.theme.id) + chaosBriefingExtra(chaos.dirty);

  $('#mission-title').textContent = lesson.title;
  $('#mission-body').textContent = briefing;
  $('#mission-tags').innerHTML = (lesson.concepts || [])
    .map((c) => `<span class="tag">${c}</span>`)
    .join('');

  renderSchemaChips(resolve(lesson.schemaHint, state.theme.id));

  const starter = resolve(lesson.starter, state.theme.id);
  $('#sql-editor').value = starter;
  clearResults('準備就緒。Ctrl/Cmd+Enter 執行。');

  clearChat();
  pushBubble('tutor', socraticKickoff(lesson, state.theme.name));
  if (chaos.dirty) pushBubble('system', chaos.message);

  $('#boot-status').textContent = chaos.dirty ? '髒數據模式' : '乾淨資料集';
}

function renderSchemaChips(hints) {
  const bar = $('#schema-bar');
  bar.innerHTML = '';
  const tables = listTables();
  for (const t of tables) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'schema-chip';
    chip.textContent = t;
    chip.title = '撳睇欄位';
    chip.addEventListener('click', () => {
      const info = tableInfo(t);
      const cols = (info || []).map((c) => `${c.name}:${c.type || '?'}`).join(', ');
      pushBubble('system', `表 ${t} → ${cols || '（無）'}`);
    });
    bar.appendChild(chip);
  }
  if (Array.isArray(hints)) {
    for (const h of hints) {
      const chip = document.createElement('span');
      chip.className = 'schema-chip';
      chip.style.cursor = 'default';
      chip.textContent = h;
      bar.appendChild(chip);
    }
  }
}

function clearResults(msg) {
  const box = $('#results');
  box.innerHTML = `<div class="results-empty">${msg}</div>`;
}

function showResult(result, status) {
  const box = $('#results');
  const statusClass =
    status === 'pass' ? 'ok' : status === 'fail' ? 'warn' : status === 'error' ? 'err' : '';
  let statusText = `${result.kind} · ${result.ms} ms`;
  if (status === 'pass') statusText = `✓ 過關 · ${result.ms} ms`;
  if (status === 'fail') statusText = `結果唔啱 · ${result.ms} ms —— 睇導師提示`;
  if (status === 'error') statusText = `執行錯誤`;

  let html = `<div class="results-status ${statusClass}">${escapeHtml(statusText)}</div>`;
  if (result.columns?.length) {
    html += '<table class="result-table"><thead><tr>';
    html += result.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
    html += '</tr></thead><tbody>';
    const rows = result.values.slice(0, 200);
    for (const row of rows) {
      html +=
        '<tr>' +
        row.map((v) => `<td>${v === null ? '<em>NULL</em>' : escapeHtml(String(v))}</td>`).join('') +
        '</tr>';
    }
    html += '</tbody></table>';
    if (result.values.length > 200) {
      html += `<div class="results-empty">只顯示前 200 行（共 ${result.values.length}）</div>`;
    }
  } else if (result.kind === 'write') {
    html += `<div class="results-empty">寫入成功，影響 ${result.rowsAffected} 行。</div>`;
  } else if (status !== 'error') {
    html += `<div class="results-empty">冇結果集（空）。</div>`;
  }
  box.innerHTML = html;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clearChat() {
  $('#chat').innerHTML = '';
}

function pushBubble(role, text) {
  const chat = $('#chat');
  const div = document.createElement('div');
  div.className = `bubble ${role}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function executeAndValidate() {
  const sql = $('#sql-editor').value;
  let result;
  try {
    result = runSQL(sql);
  } catch (e) {
    clearResults('');
    $('#results').innerHTML = `<div class="results-status err">${escapeHtml(e.message)}</div>`;
    const reply = localTutorReply({
      lesson: state.lesson,
      userSQL: sql,
      error: e,
      passed: false,
      hintLevel: state.progress.hintLevel[state.lesson.id] || 0,
      themeName: state.theme.name,
      result: null
    });
    pushBubble('tutor', reply);
    return;
  }

  const verdict = validateLesson(state.lesson, sql, result);
  showResult(result, verdict.pass ? 'pass' : 'fail');

  if (verdict.pass) {
    markComplete(state.progress, state.lesson.id);
    renderLessonNav();
    document.querySelectorAll('.lesson-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.id === state.lesson.id);
    });
    $('#progress-pill').textContent = `${completedCount(state.progress)}/${CURRICULUM.length}`;
    pushBubble('tutor', localTutorReply({
      lesson: state.lesson,
      userSQL: sql,
      error: null,
      passed: true,
      hintLevel: 0,
      themeName: state.theme.name,
      result
    }));
    toast('過關！');
  } else {
    pushBubble(
      'tutor',
      localTutorReply({
        lesson: state.lesson,
        userSQL: sql,
        error: null,
        passed: false,
        hintLevel: state.progress.hintLevel[state.lesson.id] || 0,
        themeName: state.theme.name,
        result
      }) + (verdict.reason ? `\n\n（核對備註：${verdict.reason}）` : '')
    );
  }
}

function validateLesson(lesson, userSQL, result) {
  const spec = resolve(lesson.validate, state.theme.id);

  if (spec.forbidStar && /\bselect\s+\*/i.test(userSQL)) {
    return { pass: false, reason: '唔准用 SELECT *' };
  }
  if (spec.forbidCommaJoin && /from\s+\w+\s*,\s*\w+/i.test(userSQL)) {
    return { pass: false, reason: '唔准用逗號隱式 JOIN' };
  }

  if (spec.type === 'explain') {
    const ok =
      result.kind === 'explain' || /^\s*EXPLAIN\b/i.test(userSQL);
    return { pass: ok && result.values?.length >= 0, reason: ok ? '' : '需要 EXPLAIN QUERY PLAN' };
  }

  if (spec.type === 'index') {
    const idxs = listIndexes();
    const found = idxs.some(
      (i) => i.name.toLowerCase() === spec.name.toLowerCase()
    );
    return { pass: found, reason: found ? '' : `未見索引 ${spec.name}` };
  }

  if (spec.type === 'custom' && typeof spec.check === 'function') {
    let pass = false;
    try {
      pass = !!spec.check(userSQL, result);
    } catch {
      pass = false;
    }
    return { pass, reason: pass ? '' : '未符合架構改寫要求' };
  }

  if (spec.expectedSQL) {
    let expected;
    try {
      expected = runExpected(spec.expectedSQL);
    } catch (e) {
      return { pass: false, reason: '內部預期查詢失敗：' + e.message };
    }

    if (spec.columns) {
      const have = (result.columns || []).map((c) => c.toLowerCase());
      const need = spec.columns.map((c) => c.toLowerCase());
      const missing = need.filter((c) => !have.includes(c));
      if (missing.length) {
        return { pass: false, reason: `缺少欄：${missing.join(', ')}` };
      }
    }

    const equal = resultsEqual(
      { columns: expected.columns, values: expected.values },
      { columns: result.columns, values: result.values },
      { requireOrder: /order by/i.test(spec.expectedSQL) }
    );

    if (spec.mustIncludeNullClub && equal) {
      const clubIdx = result.columns.findIndex((c) =>
        /club_name/i.test(c)
      );
      if (clubIdx >= 0) {
        const hasNull = result.values.some((r) => r[clubIdx] === null);
        if (!hasNull) {
          return { pass: false, reason: 'LEFT JOIN 應保留冇球會嘅球員（club_name NULL）' };
        }
      }
    }

    return { pass: equal, reason: equal ? '' : '列／值同預期唔一致' };
  }

  return { pass: false, reason: '無驗證規則' };
}

async function askHint() {
  const level = bumpHint(state.progress, state.lesson.id);
  const sql = $('#sql-editor').value;
  pushBubble('user', '提示我');

  if (state.progress.apiKey) {
    try {
      const msg = await cloudTutor({
        apiKey: state.progress.apiKey,
        lesson: state.lesson,
        themeName: state.theme.name,
        userSQL: sql,
        error: null,
        hintLevel: level,
        userMessage: '請給蘇格拉底式提示'
      });
      pushBubble('tutor', scrubAnswerLeak(msg));
      return;
    } catch (e) {
      pushBubble('system', '雲端導師暫時唔得，改用本地提示。');
    }
  }

  pushBubble(
    'tutor',
    localTutorReply({
      lesson: state.lesson,
      userSQL: sql,
      error: null,
      passed: false,
      hintLevel: level - 1,
      themeName: state.theme.name,
      result: null
    })
  );
}

async function askFreeform() {
  const input = $('#ask-input');
  const q = (input?.value || '').trim();
  if (!q) return;
  input.value = '';
  pushBubble('user', q);
  const sql = $('#sql-editor').value;

  if (state.progress.apiKey) {
    try {
      const msg = await cloudTutor({
        apiKey: state.progress.apiKey,
        lesson: state.lesson,
        themeName: state.theme.name,
        userSQL: sql,
        hintLevel: state.progress.hintLevel[state.lesson.id] || 0,
        userMessage: q
      });
      pushBubble('tutor', scrubAnswerLeak(msg));
      return;
    } catch (e) {
      pushBubble('system', 'API 失敗，用本地助教：' + e.message);
    }
  }

  // Local freeform: refuse answers, ask Socratic questions
  if (/答案|完整|直接.*sql|give me.*(query|answer)/i.test(q)) {
    pushBubble(
      'tutor',
      '我唔會直接俾完整 SQL。你可唔可以先講：你而家 FROM 邊張表？WHERE 想過濾咩？'
    );
    return;
  }
  pushBubble(
    'tutor',
    localTutorReply({
      lesson: state.lesson,
      userSQL: sql,
      passed: false,
      hintLevel: state.progress.hintLevel[state.lesson.id] || 0,
      themeName: state.theme.name
    })
  );
}

function runExplainCoach() {
  const sql = $('#sql-editor').value;
  const analysis = analyzeExplain(sql);
  if (!analysis.ok) {
    pushBubble('tutor', 'EXPLAIN 失敗：' + analysis.error);
    return;
  }
  if (analysis.plan) showResult(analysis.plan, '');
  pushBubble('tutor', analysis.narrative);
}

function runArchitect() {
  const sql = $('#sql-editor').value;
  let meta = null;
  try {
    meta = runSQL(sql);
    showResult(meta, '');
  } catch (e) {
    pushBubble('tutor', '先寫到可以執行嘅 SQL，評判官先好落筆。錯誤：' + e.message);
    return;
  }
  pushBubble('tutor', architectCritique(sql, meta));
}

// Boot
const page = document.body.dataset.page;
if (page === 'landing') initLanding();
if (page === 'lab') initLab();
