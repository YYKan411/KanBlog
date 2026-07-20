/**
 * 蘇格拉底式導師 —— 預設唔直接俾完整 SQL
 * 混合：本地規則引擎（免費）+ 可選 OpenAI API（嚴格助教角色）
 */

const FORBIDDEN_PATTERNS = [
  /\bSELECT\b[\s\S]*\bFROM\b/i,
  /\bINSERT\b[\s\S]*\bINTO\b/i,
  /\bCREATE\s+INDEX\b[\s\S]*\bON\b/i
];

export function looksLikeFullAnswer(text) {
  // Allow mentioning keywords, but block multi-clause SQL dumps
  const t = text.trim();
  if (t.split('\n').length >= 3 && /\bFROM\b/i.test(t) && /\bSELECT\b/i.test(t)) {
    return true;
  }
  // Single-line complete query
  if (/^SELECT\b.+\bFROM\b.+/i.test(t) && t.includes(';')) return true;
  return false;
}

export function scrubAnswerLeak(text) {
  if (!looksLikeFullAnswer(text)) return text;
  return '（系統攔截咗可能嘅完整答案）我改用問題引導：你而家卡喺邊一步——揀欄、過濾、定連接條件？';
}

/**
 * 根據錯誤 / 驗證失敗產生階梯提示
 */
export function localTutorReply({
  lesson,
  userSQL,
  error,
  passed,
  hintLevel,
  themeName,
  result
}) {
  if (passed) {
    return pick([
      `掂！呢題過咗。你有冇留意結果有幾多行？作為 analyst，行數本身都係一種 sanity check。`,
      `正確。試吓問自己：如果 engineer 交嚟差一個 JOIN 條件，結果會點變？`,
      `過關。記住呢條思路——之後髒數據關卡會再搵你對質。`
    ]);
  }

  if (error) {
    return explainError(error, hintLevel);
  }

  const hints = lesson.hints || [];
  const idx = Math.min(hintLevel, hints.length - 1);
  const base = hints[idx] || '再睇一次題目要求嘅輸出欄名。';

  const probes = [
    `用「${themeName}」嘅語言講：你而家想由邊張表出發？`,
    `如果結果多咗或者少咗列，通常係 JOIN 類型或者 WHERE 條件問題——你傾向邊個？`,
    `輸出欄名有冇用 AS 改到同題目一致？驗證器好嚴。`
  ];

  if (hintLevel === 0) {
    return `未完全啱。先唔好急住睇答案。\n\n引導：${base}\n\n${probes[0]}`;
  }
  if (hintLevel === 1) {
    return `再深一層：\n\n${base}\n\n${probes[1]}`;
  }
  if (hintLevel >= 2) {
    return `偽代碼方向（仍然唔係完整答案）：\n\n${base}\n\n${probes[2]}\n\n如果你寫咗 SQL，試吓逐段註解——FROM 一段、JOIN 一段、WHERE 一段——邊段最可疑？`;
  }
  return base;
}

function explainError(error, hintLevel) {
  const msg = String(error.message || error);
  if (/no such table/i.test(msg)) {
    return hintLevel === 0
      ? '資料庫話「冇呢張表」。打開左邊／上方 schema，核對表名拼寫（複數？底線？）。'
      : `錯誤：${msg}\n\n偽代碼：先 PRAGMA 或者睇 schema chip，確認表名先寫 FROM。`;
  }
  if (/no such column/i.test(msg)) {
    return hintLevel === 0
      ? '有欄名唔存在。係咪寫錯表別名？定係欄其實喺另一張表？'
      : `錯誤：${msg}\n\n試吓：用表別名.欄名，例如 p.name。`;
  }
  if (/syntax error/i.test(msg)) {
    return hintLevel === 0
      ? '語法錯誤。常見：逗號多／少、引號冇封口、關鍵字拼錯。'
      : `錯誤：${msg}\n\n由 SELECT 開始數括號同引號，睇下有冇對唔齊。`;
  }
  if (/ambiguous/i.test(msg)) {
    return '欄名唔明確——兩張表都有同一個欄名。用表別名定清楚，例如 c.name。';
  }
  return hintLevel === 0
    ? `執行失敗。先讀錯誤訊息入面嘅關鍵字，通常已經指出邊度。\n（${msg.slice(0, 120)}）`
    : `完整錯誤：${msg}\n\n唔好整句重寫——只改錯誤指出嗰點。`;
}

export function socraticKickoff(lesson, themeName) {
  return `我係你嘅 SQL 助教——用蘇格拉底方式，唔會直接貼完整 SELECT。\n\n主題：${themeName}\n關卡：${lesson.title}\n\n你寫完就撳「執行／核對」。卡住可以撳「提示我」。\n記住：作為 analyst，目標係理解點解啱，唔係抄碼過關。`;
}

export function explainPlanInCantonese(planRows) {
  if (!planRows || !planRows.length) {
    return '冇拿到 query plan。確認你嘅語句以 EXPLAIN QUERY PLAN 開頭。';
  }
  const text = planRows.map((r) => r.join(' | ')).join('\n');
  const flat = text.toUpperCase();
  let verdict;
  if (flat.includes('USING INDEX') || flat.includes('USING COVERING INDEX')) {
    verdict = '計劃有用索引（SEARCH / USING INDEX）——喺大數據下通常穩陣啲。';
  } else if (flat.includes('SCAN')) {
    verdict = '計劃出現 SCAN（全表掃描）。資料少冇感覺；如果係 1 億列，呢種寫法可以拖垮 DB。考慮喺 WHERE／JOIN 欄建 INDEX。';
  } else {
    verdict = '已讀到計劃。重點睇 DETAIL 欄：SCAN vs SEARCH 係效能分水嶺。';
  }
  return `執行計畫解讀：\n${text}\n\n${verdict}\n\n我唔會幫你「代寫更快嘅完整 query」——你改完再 EXPLAIN 一次對比。`;
}

/**
 * 可選：呼叫 OpenAI（嚴格系統提示）
 */
export async function cloudTutor({
  apiKey,
  lesson,
  themeName,
  userSQL,
  error,
  hintLevel,
  userMessage
}) {
  if (!apiKey) throw new Error('NO_KEY');

  const system = `你是「解碼室」SQL 助教，用香港粵語書面語回覆（短、清楚、可帶少量幽默）。
嚴格規則：
1. 絕對不要輸出完整可執行的 SQL 查詢（禁止完整 SELECT/INSERT/UPDATE/DELETE/CREATE TABLE 語句）。
2. 最多給：邏輯問題、方向、偽代碼步驟、指出第幾類錯誤。
3. 用蘇格拉底提問引導用戶自己改。
4. 若用戶要求直接答案，拒絕並改為提示。
5. 回覆控制在 120 字以內（粵語）。`;

  const user = `關卡：${lesson.title}
主題：${themeName}
提示層級：${hintLevel}
用戶 SQL：
${userSQL || '（未寫）'}
錯誤：${error || '無'}
用戶訊息：${userMessage || '請提示'}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '……';
  return scrubAnswerLeak(content);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
