/**
 * Lightweight xiangqi AI — alpha-beta with material + piece-square hints.
 * Depth is capped for browser friendliness; Pikafish can replace this later.
 */

import {
  RED, BLACK, MATERIAL, FILES, RANKS,
  allLegalMoves, applyMove, undoMove, cloneBoard,
  fileOf, rankOf, opponent, gameStatus, isInCheck,
} from './rules.js';

/** Rough static exchange: value gained if we capture on `to`. */
function seeCapture(board, from, to, color) {
  const victim = board[to];
  if (!victim) return 0;
  let gain = MATERIAL[victim.type];
  const work = cloneBoard(board);
  applyMove(work, from, to);
  const recaptures = allLegalMoves(work, opponent(color)).filter((m) => m.to === to);
  if (recaptures.length) {
    gain -= MATERIAL[work[to].type];
  }
  return gain;
}

/** Prefer center / advanced pawns lightly. */
const PST = {
  P: [
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,
    2,  0,  4,  0,  6,  0,  4,  0,  2,
    6,  8, 10, 12, 14, 12, 10,  8,  6,
   10, 12, 14, 16, 18, 16, 14, 12, 10,
   12, 14, 16, 18, 20, 18, 16, 14, 12,
   10, 12, 14, 16, 18, 16, 14, 12, 10,
    6,  8, 10, 12, 14, 12, 10,  8,  6,
    0,  0,  0,  0,  0,  0,  0,  0,  0,
  ],
  H: [
    0,  2,  4,  4,  4,  4,  4,  2,  0,
    2,  4,  8,  8,  8,  8,  8,  4,  2,
    4,  8, 10, 12, 12, 12, 10,  8,  4,
    4,  8, 12, 14, 14, 14, 12,  8,  4,
    4,  8, 12, 14, 14, 14, 12,  8,  4,
    4,  8, 12, 14, 14, 14, 12,  8,  4,
    4,  8, 10, 12, 12, 12, 10,  8,  4,
    2,  4,  8,  8,  8,  8,  8,  4,  2,
    0,  2,  4,  4,  4,  4,  4,  2,  0,
    0,  0,  2,  2,  2,  2,  2,  0,  0,
  ],
};

function pstBonus(type, color, i) {
  const table = PST[type];
  if (!table) return 0;
  const f = fileOf(i);
  const r = rankOf(i);
  const mirrored = color === RED ? i : (RANKS - 1 - r) * FILES + f;
  return table[mirrored] || 0;
}

export function evaluate(board, perspective) {
  let score = 0;
  for (let i = 0; i < board.length; i++) {
    const p = board[i];
    if (!p) continue;
    let v = MATERIAL[p.type] + pstBonus(p.type, p.color, i);
    if (p.color !== perspective) v = -v;
    score += v;
  }
  if (isInCheck(board, opponent(perspective))) score += 18;
  if (isInCheck(board, perspective)) score -= 18;
  return score;
}

const DIFFICULTY = {
  easy:   { depth: 1, noise: 0.35 },
  medium: { depth: 2, noise: 0.12 },
  hard:   { depth: 3, noise: 0 },
};

function orderMoves(board, moves) {
  return moves.slice().sort((a, b) => {
    const capB = board[b.to] ? MATERIAL[board[b.to].type] : 0;
    const capA = board[a.to] ? MATERIAL[board[a.to].type] : 0;
    return capB - capA;
  });
}

function alphabeta(board, depth, alpha, beta, color, rootColor) {
  const status = gameStatus(board, color);
  if (status === 'checkmate') {
    return color === rootColor ? -50000 + (3 - depth) : 50000 - (3 - depth);
  }
  if (status === 'stalemate') return 0;

  if (depth === 0) {
    // Stand-pat + captures that aren't losing on static exchange
    let best = evaluate(board, rootColor);
    const caps = allLegalMoves(board, color).filter((m) => board[m.to]);
    const maximizing = color === rootColor;
    for (const m of caps) {
      if (seeCapture(board, m.from, m.to, color) < 0) continue;
      const cap = applyMove(board, m.from, m.to);
      const val = evaluate(board, rootColor);
      undoMove(board, m.from, m.to, cap);
      if (maximizing ? val > best : val < best) best = val;
    }
    return best;
  }

  const moves = orderMoves(board, allLegalMoves(board, color));
  if (color === rootColor) {
    let best = -Infinity;
    for (const m of moves) {
      const cap = applyMove(board, m.from, m.to);
      const val = alphabeta(board, depth - 1, alpha, beta, opponent(color), rootColor);
      undoMove(board, m.from, m.to, cap);
      if (val > best) best = val;
      if (best > alpha) alpha = best;
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const m of moves) {
    const cap = applyMove(board, m.from, m.to);
    const val = alphabeta(board, depth - 1, alpha, beta, opponent(color), rootColor);
    undoMove(board, m.from, m.to, cap);
    if (val < best) best = val;
    if (best < beta) beta = best;
    if (beta <= alpha) break;
  }
  return best;
}

/**
 * Pick a move for `color`.
 * @param {'easy'|'medium'|'hard'} level
 * @returns {{ from: number, to: number, score: number } | null}
 */
export function chooseMove(board, color, level = 'medium') {
  const cfg = DIFFICULTY[level] || DIFFICULTY.medium;
  const work = cloneBoard(board);
  const moves = orderMoves(work, allLegalMoves(work, color));
  if (!moves.length) return null;

  const scored = [];
  for (const m of moves) {
    const cap = applyMove(work, m.from, m.to);
    let score = alphabeta(work, cfg.depth - 1, -Infinity, Infinity, opponent(color), color);
    undoMove(work, m.from, m.to, cap);
    // Penalise obviously losing captures (e.g. cannon for horse on open file)
    if (board[m.to]) {
      const see = seeCapture(board, m.from, m.to, color);
      if (see < 0) score += see * 3;
    }
    scored.push({ ...m, score });
  }
  scored.sort((a, b) => b.score - a.score);

  if (cfg.noise > 0 && scored.length > 1 && Math.random() < cfg.noise) {
    const pick = scored[1 + Math.floor(Math.random() * Math.min(3, scored.length - 1))];
    return pick;
  }
  return scored[0];
}

/** Best move + score for review (uses hard depth, no noise). */
export function analysePosition(board, color, depth = 2) {
  const work = cloneBoard(board);
  const moves = orderMoves(work, allLegalMoves(work, color));
  if (!moves.length) return { best: null, score: evaluate(work, color), alternatives: [] };

  const scored = [];
  for (const m of moves) {
    const cap = applyMove(work, m.from, m.to);
    const score = alphabeta(work, Math.max(0, depth - 1), -Infinity, Infinity, opponent(color), color);
    undoMove(work, m.from, m.to, cap);
    scored.push({ ...m, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return {
    best: scored[0],
    score: scored[0].score,
    alternatives: scored.slice(0, 3),
  };
}

export { DIFFICULTY };
