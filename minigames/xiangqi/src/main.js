/**
 * Xiangqi on Linen — game loop.
 */

import {
  RED, BLACK, initialBoard, cloneBoard, legalMovesFrom,
  applyMove, undoMove, gameStatus, isInCheck,
  opponent, moveNotation,
} from './rules.js';
import { chooseMove, evaluate } from './ai.js';
import { reviewGame } from './review.js';
import { PikafishEngine } from './pikafish.js';
import {
  createUi, renderBoard, renderStatus, renderEval,
  renderMoveList, renderReview,
} from './ui.js';

function createState(humanColor = RED, level = 'medium') {
  return {
    board: initialBoard(),
    initial: initialBoard(),
    sideToMove: RED,
    humanColor,
    level,
    selected: null,
    hints: [],
    lastMove: null,
    history: [],
    status: 'playing',
    thinking: false,
    inCheck: false,
    review: null,
    reviewProgress: null,
    preview: null,
    engineStatus: 'loading',
  };
}

function syncEval(ui, state) {
  const score = evaluate(state.board, state.humanColor);
  renderEval(ui, score, state.humanColor);
}

function paint(ui, state) {
  state.inCheck = isInCheck(state.board, state.sideToMove);
  renderBoard(ui, state);
  renderStatus(ui, state);
  renderMoveList(ui, state.history);
  renderReview(ui, state.review, state.reviewProgress);
  syncEval(ui, state);
}

async function runReview(ui, state, engine) {
  if (!engine.ready) {
    state.reviewProgress = '引擎今次未醒到，覆盤要等佢返嚟先做到——不如再嚟一局？';
    paint(ui, state);
    return;
  }

  state.reviewProgress = '覆緊盤，逐步睇返你點行…';
  paint(ui, state);
  try {
    state.review = await reviewGame(
      state.initial,
      state.history,
      state.humanColor,
      engine,
      (done, total) => {
        state.reviewProgress = `覆緊盤 ${done} / ${total}…`;
        paint(ui, state);
      },
    );
    state.reviewProgress = null;
  } catch (error) {
    console.warn('review failed', error);
    state.reviewProgress = '覆盤斷咗，遲啲再試啦。';
  }
  paint(ui, state);
}

function endIfNeeded(ui, state, engine) {
  state.status = gameStatus(state.board, state.sideToMove);
  if (state.status !== 'playing') {
    state.selected = null;
    state.hints = [];
    state.thinking = false;
    runReview(ui, state, engine);
  }
}

function playMove(ui, state, engine, from, to) {
  const notation = moveNotation(state.board, from, to);
  const captured = applyMove(state.board, from, to);
  state.history.push({
    from,
    to,
    by: state.sideToMove,
    notation,
    captured: captured ? { ...captured } : null,
  });
  state.lastMove = { from, to };
  state.sideToMove = opponent(state.sideToMove);
  state.selected = null;
  state.hints = [];
  state.preview = null;
  endIfNeeded(ui, state, engine);
  paint(ui, state);
}

async function maybeEngine(ui, state, engine) {
  if (state.status !== 'playing') return;
  if (state.sideToMove === state.humanColor) return;

  state.thinking = true;
  paint(ui, state);

  // Yield so the "thinking" label paints
  await new Promise((r) => setTimeout(r, 40));

  let move = null;
  if (!engine.ready && state.engineStatus === 'loading') {
    await engine.init().catch(() => {});
  }
  if (engine.ready) {
    try {
      move = await engine.chooseMove(state.history, state.level);
    } catch (error) {
      console.warn('Pikafish move failed; using fallback.', error);
    }
  }
  if (!move) move = chooseMove(state.board, state.sideToMove, state.level);
  state.thinking = false;
  if (!move) {
    endIfNeeded(ui, state, engine);
    paint(ui, state);
    return;
  }
  playMove(ui, state, engine, move.from, move.to);
  if (state.status === 'playing' && state.sideToMove !== state.humanColor) {
    maybeEngine(ui, state, engine);
  }
}

function undo(ui, state) {
  if (!state.history.length || state.thinking) return;
  // Undo until it's human's turn again (or empty)
  const undoOne = () => {
    const last = state.history.pop();
    if (!last) return;
    undoMove(state.board, last.from, last.to, last.captured);
    state.sideToMove = last.by;
    state.lastMove = state.history.length
      ? { from: state.history[state.history.length - 1].from, to: state.history[state.history.length - 1].to }
      : null;
  };

  undoOne();
  if (state.history.length && state.sideToMove !== state.humanColor) {
    undoOne();
  }

  state.status = 'playing';
  state.review = null;
  state.reviewProgress = null;
  state.preview = null;
  state.selected = null;
  state.hints = [];
  paint(ui, state);
}

function newGame(ui, state, engine) {
  const humanColor = ui.colorSel.value === 'black' ? BLACK : RED;
  const level = ui.levelSel.value;
  const next = createState(humanColor, level);
  next.engineStatus = engine.ready ? 'ready' : state.engineStatus;
  Object.assign(state, next);
  paint(ui, state);
  maybeEngine(ui, state, engine);
}

function onCellClick(ui, state, engine, cell) {
  if (state.thinking || state.status !== 'playing') return;
  if (state.sideToMove !== state.humanColor) return;

  const i = +cell.dataset.idx;
  const piece = state.board[i];

  if (state.selected != null && state.hints.includes(i)) {
    playMove(ui, state, engine, state.selected, i);
    maybeEngine(ui, state, engine);
    return;
  }

  if (piece && piece.color === state.humanColor) {
    state.selected = i;
    state.hints = legalMovesFrom(state.board, i);
    paint(ui, state);
    return;
  }

  state.selected = null;
  state.hints = [];
  paint(ui, state);
}

function showReviewPosition(ui, state, ply, suggested = false) {
  const note = state.review?.notes.find((item) => item.ply === ply);
  if (!note) return;

  const board = cloneBoard(state.initial);
  for (let i = 0; i < ply; i++) {
    const move = state.history[i];
    applyMove(board, move.from, move.to);
  }

  const move = suggested && note.best ? note.best : note.move;
  applyMove(board, move.from, move.to);
  state.preview = {
    board,
    lastMove: move,
    label: suggested ? `建議着：${note.bestNotation}` : `實戰着：${note.notation}`,
  };
  paint(ui, state);
}

export function boot(root) {
  const ui = createUi(root);
  const state = createState(RED, 'medium');
  const engine = new PikafishEngine((status) => {
    state.engineStatus = status;
    paint(ui, state);
  });

  ui.newBtn.addEventListener('click', () => newGame(ui, state, engine));
  ui.undoBtn.addEventListener('click', () => undo(ui, state));
  ui.colorSel.addEventListener('change', () => newGame(ui, state, engine));
  ui.levelSel.addEventListener('change', () => {
    state.level = ui.levelSel.value;
  });

  for (const cell of ui.cells) {
    cell.addEventListener('click', () => onCellClick(ui, state, engine, cell));
  }
  root.addEventListener('xq-preview', (event) => {
    showReviewPosition(ui, state, event.detail.ply, event.detail.suggested);
  });
  root.addEventListener('xq-preview-end', () => {
    state.preview = null;
    paint(ui, state);
  });

  paint(ui, state);
  engine.init().catch(() => {});
  return { ui, state, engine };
}
