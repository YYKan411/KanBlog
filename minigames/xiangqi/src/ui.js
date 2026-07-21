/**
 * Xiangqi UI — Library Linen board, controls, review panel.
 */

import {
  FILES, RANKS, RED, BLACK,
  idx, labelFor, moveName,
} from './rules.js';

export function createUi(root) {
  root.innerHTML = `
    <div class="xq-shell">
      <header class="xq-top">
        <a class="xq-back" href="/minigames/">← 小遊戲 · Mini Games</a>
        <div class="xq-brand">
          <h1 class="xq-title">紙上象棋</h1>
          <p class="xq-title-en">Xiangqi on Linen</p>
        </div>
        <a class="xq-home" href="/">言又勤</a>
      </header>

      <p class="xq-lead">唔使急，慢慢行。完局之後，陪你睇返邊一步最要緊。<span lang="en">Play, then see what mattered.</span></p>

      <div class="xq-layout">
        <section class="xq-board-wrap" aria-label="棋盤">
          <div class="xq-board" id="xqBoard" role="grid" aria-colcount="9" aria-rowcount="10"></div>
          <svg class="xq-palace-lines" viewBox="0 0 9 10" aria-hidden="true">
            <path d="M3.5 0.5 L5.5 2.5 M5.5 0.5 L3.5 2.5"/>
            <path d="M3.5 7.5 L5.5 9.5 M5.5 7.5 L3.5 9.5"/>
          </svg>
          <div class="xq-river" aria-hidden="true">楚河　漢界</div>
        </section>

        <aside class="xq-side">
          <div class="xq-status" id="xqStatus" aria-live="polite"></div>
          <div class="xq-engine-status" id="xqEngineStatus">引擎熱身中…</div>

          <div class="xq-eval" title="局面走勢（只供參考）">
            <div class="xq-eval-track">
              <div class="xq-eval-fill" id="xqEvalFill"></div>
            </div>
            <span class="xq-eval-label" id="xqEvalLabel">均衡</span>
          </div>

          <label class="xq-field">
            <span>你執</span>
            <select id="xqColor">
              <option value="red" selected>紅方（先手）</option>
              <option value="black">黑方（後手）</option>
            </select>
          </label>

          <label class="xq-field">
            <span>難度</span>
            <select id="xqLevel">
              <option value="easy">閒聊</option>
              <option value="medium" selected>認真</option>
              <option value="hard">認真啲</option>
            </select>
          </label>

          <div class="xq-actions">
            <button type="button" class="xq-btn" id="xqNew">新局</button>
            <button type="button" class="xq-btn xq-btn-quiet" id="xqUndo" disabled>悔棋</button>
          </div>

          <div class="xq-moves">
            <h2 class="xq-side-h">着法</h2>
            <ol class="xq-move-list" id="xqMoveList"></ol>
            <details class="xq-notation-help">
              <summary>第一次玩？</summary>
              <p>唔使先背晒規則。撳一隻棋，綠點就係佢行得嘅位置；目標係逼到對方個將無路可走。試住行，完局再一齊睇返。</p>
            </details>
            <details class="xq-notation-help">
              <summary>點睇棋譜？</summary>
              <p>「炮二平五」即二路炮橫移至五路；「傌八進七」即八路傌向前行至七路。</p>
            </details>
          </div>

          <div class="xq-review" id="xqReview" hidden>
            <h2 class="xq-side-h">完局睇返</h2>
            <p class="xq-review-progress" id="xqReviewProgress" aria-live="polite"></p>
            <div class="xq-highlight" id="xqHighlight" hidden></div>
            <p class="xq-review-sum" id="xqReviewSum"></p>
            <ul class="xq-review-list" id="xqReviewList"></ul>
            <button type="button" class="xq-text-btn" id="xqPreviewEnd">返回終局盤面</button>
          </div>
        </aside>
      </div>

      <footer class="xq-foot">
        <a href="/">主頁 · home</a>
        <span class="xq-dot">·</span>
        <a href="/minigames/">minigames</a>
        <details class="xq-colophon">
          <summary>引擎與授權</summary>
          <p>棋力由 Pikafish 提供，依 <a href="./vendor/pikafish/COPYING.txt">GPLv3</a> 授權<span class="xq-dot">·</span><a href="./vendor/pikafish/SOURCE.txt">建構來源</a><span class="xq-dot">·</span><a href="https://github.com/official-pikafish/Pikafish" target="_blank" rel="noopener">官方原始碼</a></p>
        </details>
      </footer>
    </div>
  `;

  const boardEl = root.querySelector('#xqBoard');
  // Build 90 intersection points; river label sits visually between ranks 4–5 via CSS.
  for (let rank = RANKS - 1; rank >= 0; rank--) {
    for (let file = 0; file < FILES; file++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'xq-cell';
      cell.dataset.file = String(file);
      cell.dataset.rank = String(rank);
      cell.dataset.idx = String(idx(file, rank));
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `${String.fromCharCode(97 + file)}${rank}`);
      boardEl.appendChild(cell);
    }
  }

  return {
    root,
    boardEl,
    statusEl: root.querySelector('#xqStatus'),
    engineStatusEl: root.querySelector('#xqEngineStatus'),
    evalFill: root.querySelector('#xqEvalFill'),
    evalLabel: root.querySelector('#xqEvalLabel'),
    colorSel: root.querySelector('#xqColor'),
    levelSel: root.querySelector('#xqLevel'),
    newBtn: root.querySelector('#xqNew'),
    undoBtn: root.querySelector('#xqUndo'),
    moveList: root.querySelector('#xqMoveList'),
    reviewEl: root.querySelector('#xqReview'),
    reviewProgress: root.querySelector('#xqReviewProgress'),
    highlightEl: root.querySelector('#xqHighlight'),
    reviewSum: root.querySelector('#xqReviewSum'),
    reviewList: root.querySelector('#xqReviewList'),
    previewEndBtn: root.querySelector('#xqPreviewEnd'),
    cells: [...boardEl.querySelectorAll('.xq-cell')],
  };
}

export function renderBoard(ui, state) {
  const board = state.preview?.board || state.board;
  const selected = state.preview ? null : state.selected;
  const hints = state.preview ? [] : state.hints;
  const lastMove = state.preview?.lastMove || state.lastMove;
  const { humanColor, flip } = state;
  const flipped = flip || humanColor === BLACK;

  for (const cell of ui.cells) {
    let file = +cell.dataset.file;
    let rank = +cell.dataset.rank;
    // DOM order is rank 9→0; if flipped, remap visual data
    const i = idx(file, rank);
    const piece = board[i];

    cell.classList.toggle('is-selected', selected === i);
    cell.classList.toggle('is-hint', hints.includes(i));
    cell.classList.toggle('is-last-from', lastMove && lastMove.from === i);
    cell.classList.toggle('is-last-to', lastMove && lastMove.to === i);
    cell.classList.toggle('is-palace', file >= 3 && file <= 5 && (rank <= 2 || rank >= 7));

    cell.replaceChildren();
    if (piece) {
      const disc = document.createElement('span');
      disc.className = `xq-piece xq-piece--${piece.color}`;
      disc.textContent = labelFor(piece);
      disc.dataset.type = piece.type;
      cell.appendChild(disc);
    }
  }

  // Optional board flip via CSS order — keep coords, rotate wrapper
  ui.boardEl.classList.toggle('is-flipped', flipped);
}

export function renderStatus(ui, state) {
  const { sideToMove, status, humanColor, thinking, inCheck } = state;
  let text = '';
  if (state.preview) {
    text = state.preview.label;
  } else if (thinking) {
    text = '引擎思考中…';
  } else if (status === 'checkmate') {
    const winner = sideToMove === RED ? '黑' : '紅';
    text = `將死 — ${winner}方勝`;
  } else if (status === 'stalemate') {
    const winner = sideToMove === RED ? '黑' : '紅';
    text = `困斃 — ${winner}方勝`;
  } else {
    const side = sideToMove === RED ? '紅' : '黑';
    const you = sideToMove === humanColor ? '（你）' : '（引擎）';
    text = `${side}方走${you}`;
    if (inCheck) text += ' · 將軍';
  }
  ui.statusEl.textContent = text;
  ui.undoBtn.disabled = !state.history.length || thinking || status !== 'playing';

  const engineStatus = {
    loading: '引擎熱身中…',
    ready: '引擎已就位',
    fallback: '引擎未醒，暫由簡單對手陪你行',
  };
  ui.engineStatusEl.textContent = engineStatus[state.engineStatus] || engineStatus.loading;
  ui.engineStatusEl.dataset.status = state.engineStatus;
}

export function renderEval(ui, score, humanColor) {
  // score from human perspective roughly -400..400 → 5%..95%
  const clamped = Math.max(-400, Math.min(400, score));
  const pct = 50 + (clamped / 400) * 45;
  ui.evalFill.style.width = `${pct}%`;
  let label = '均衡';
  if (clamped > 80) label = '你較優';
  else if (clamped < -80) label = '對手較優';
  else if (clamped > 25) label = '你稍優';
  else if (clamped < -25) label = '對手稍優';
  ui.evalLabel.textContent = label;
}

export function renderMoveList(ui, history) {
  ui.moveList.replaceChildren();
  for (let i = 0; i < history.length; i += 2) {
    const li = document.createElement('li');
    const n = (i / 2) + 1;
    const a = history[i];
    const b = history[i + 1];
    li.innerHTML = `
      <span class="xq-turn">${n}.</span>
      <span class="xq-move-name">${a.notation || moveName(a.from, a.to)}</span>
      <span class="xq-move-name">${b ? (b.notation || moveName(b.from, b.to)) : '—'}</span>
    `;
    ui.moveList.appendChild(li);
  }
  ui.moveList.scrollTop = ui.moveList.scrollHeight;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
}

export function renderReview(ui, review, progress = null) {
  if (!review && !progress) {
    ui.reviewEl.hidden = true;
    return;
  }
  ui.reviewEl.hidden = false;
  ui.reviewProgress.textContent = progress || '';
  ui.reviewProgress.hidden = !progress;
  ui.highlightEl.hidden = !review;
  ui.reviewSum.hidden = !review;
  ui.reviewList.hidden = !review;
  ui.previewEndBtn.hidden = !review;
  if (!review) return;

  if (review.highlight) {
    const h = review.highlight;
    ui.highlightEl.className = `xq-highlight xq-highlight--${h.kind}`;
    ui.highlightEl.innerHTML = `
      <span class="xq-highlight-tag">${escapeHtml(h.title)}</span>
      <p>${escapeHtml(h.text)}</p>
      <button type="button" class="xq-text-btn" data-ply="${h.ply}" data-suggested="false">喺棋盤睇返呢一步</button>
    `;
  } else {
    ui.highlightEl.innerHTML = '';
  }

  const s = review.summary;
  ui.reviewSum.textContent =
    `最準 ${s.best} · 穩陣 ${s.good} · 差少少 ${s.inaccuracy} · 轉差 ${s.mistake} · 關鍵失誤 ${s.blunder}`;

  ui.reviewList.replaceChildren();
  for (const note of review.notes) {
    if (note.kind === 'engine') continue;
    const li = document.createElement('li');
    li.className = `xq-note xq-note--${note.kind}`;
    const turn = Math.floor(note.ply / 2) + 1;
    const isBest = note.kind === 'best' || !note.bestNotation;

    let detail;
    if (isBest) {
      detail = `<p>同引擎首選一致，維持${escapeHtml(note.bestDesc || '局面')}。</p>`;
    } else {
      const reco = note.recoLine && note.recoLine.length
        ? note.recoLine.join('，')
        : note.bestNotation;
      const cost = Math.round(note.delta);
      const punish = note.punishLine && note.punishLine.length
        ? `<p class="xq-note-line">對手之後可以咁行：${escapeHtml(note.punishLine.join('，'))}</p>`
        : '';
      detail = `
        <p class="xq-note-line">實戰 ${escapeHtml(note.notation)} → ${escapeHtml(note.playedDesc)}</p>
        <p class="xq-note-line">建議 <strong>${escapeHtml(reco)}</strong> → ${escapeHtml(note.bestDesc)}</p>
        ${punish}
        <p class="xq-note-cost">蝕約 ${cost} 分（≈ ${(note.delta / 100).toFixed(1)} 隻兵）</p>
      `;
    }

    li.innerHTML = `
      <div class="xq-note-head">
        <span>第 ${turn} 回合 · ${escapeHtml(note.notation)}</span>
        <span class="xq-verdict">${escapeHtml(note.verdict)}</span>
      </div>
      ${detail}
      <div class="xq-note-actions">
        <button type="button" data-ply="${note.ply}" data-suggested="false">睇實戰</button>
        ${isBest ? '' : `<button type="button" data-ply="${note.ply}" data-suggested="true">睇建議</button>`}
      </div>
    `;
    ui.reviewList.appendChild(li);
  }

  const dispatchPreview = (button) => {
    ui.root.dispatchEvent(new CustomEvent('xq-preview', {
      detail: {
        ply: Number(button.dataset.ply),
        suggested: button.dataset.suggested === 'true',
      },
    }));
  };

  for (const button of ui.highlightEl.querySelectorAll('button[data-ply]')) {
    button.addEventListener('click', () => dispatchPreview(button));
  }
  for (const button of ui.reviewList.querySelectorAll('button[data-ply]')) {
    button.addEventListener('click', () => dispatchPreview(button));
  }
  ui.previewEndBtn.onclick = () => {
    ui.root.dispatchEvent(new CustomEvent('xq-preview-end'));
  };
}
