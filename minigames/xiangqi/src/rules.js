/**
 * Chinese chess (xiangqi) rules — board, moves, check, game-over.
 * Coordinates: file 0–8 left→right from Red's view; rank 0 = Red's back (bottom).
 */

export const RED = 'red';
export const BLACK = 'black';

export const FILES = 9;
export const RANKS = 10;

/** @typedef {'K'|'A'|'E'|'H'|'R'|'C'|'P'} PieceType */
/** @typedef {{ type: PieceType, color: 'red'|'black' }} Piece */
/** @typedef {(Piece|null)[]} Board — length 90, index = rank * 9 + file */

export const PIECE_LABEL = {
  red:   { K: '帥', A: '仕', E: '相', H: '傌', R: '俥', C: '炮', P: '兵' },
  black: { K: '將', A: '士', E: '象', H: '馬', R: '車', C: '砲', P: '卒' },
};

export const MATERIAL = { K: 10000, A: 120, E: 120, H: 270, R: 600, C: 285, P: 30 };

export function idx(file, rank) {
  return rank * FILES + file;
}

export function fileOf(i) {
  return i % FILES;
}

export function rankOf(i) {
  return (i / FILES) | 0;
}

export function inBounds(file, rank) {
  return file >= 0 && file < FILES && rank >= 0 && rank < RANKS;
}

export function opponent(color) {
  return color === RED ? BLACK : RED;
}

export function emptyBoard() {
  return Array(FILES * RANKS).fill(null);
}

/** Starting position. */
export function initialBoard() {
  const b = emptyBoard();
  const place = (f, r, type, color) => { b[idx(f, r)] = { type, color }; };

  // Red (bottom)
  place(0, 0, 'R', RED); place(1, 0, 'H', RED); place(2, 0, 'E', RED);
  place(3, 0, 'A', RED); place(4, 0, 'K', RED); place(5, 0, 'A', RED);
  place(6, 0, 'E', RED); place(7, 0, 'H', RED); place(8, 0, 'R', RED);
  place(1, 2, 'C', RED); place(7, 2, 'C', RED);
  for (const f of [0, 2, 4, 6, 8]) place(f, 3, 'P', RED);

  // Black (top)
  place(0, 9, 'R', BLACK); place(1, 9, 'H', BLACK); place(2, 9, 'E', BLACK);
  place(3, 9, 'A', BLACK); place(4, 9, 'K', BLACK); place(5, 9, 'A', BLACK);
  place(6, 9, 'E', BLACK); place(7, 9, 'H', BLACK); place(8, 9, 'R', BLACK);
  place(1, 7, 'C', BLACK); place(7, 7, 'C', BLACK);
  for (const f of [0, 2, 4, 6, 8]) place(f, 6, 'P', BLACK);

  return b;
}

function inPalace(file, rank, color) {
  if (file < 3 || file > 5) return false;
  return color === RED ? rank <= 2 : rank >= 7;
}

function onOwnSide(rank, color) {
  return color === RED ? rank <= 4 : rank >= 5;
}

function findKing(board, color) {
  for (let i = 0; i < board.length; i++) {
    const p = board[i];
    if (p && p.type === 'K' && p.color === color) return i;
  }
  return -1;
}

/** True if the two kings face each other on an open file. */
export function kingsFace(board) {
  const rk = findKing(board, RED);
  const bk = findKing(board, BLACK);
  if (rk < 0 || bk < 0) return false;
  if (fileOf(rk) !== fileOf(bk)) return false;
  const f = fileOf(rk);
  const lo = Math.min(rankOf(rk), rankOf(bk));
  const hi = Math.max(rankOf(rk), rankOf(bk));
  for (let r = lo + 1; r < hi; r++) {
    if (board[idx(f, r)]) return false;
  }
  return true;
}

/**
 * Generate pseudo-legal moves from `from` (does not filter self-check).
 * @returns {number[]} destination indices
 */
export function generateMovesFrom(board, from) {
  const piece = board[from];
  if (!piece) return [];
  const f = fileOf(from);
  const r = rankOf(from);
  const { type, color } = piece;
  const dests = [];

  const tryPush = (tf, tr) => {
    if (!inBounds(tf, tr)) return false;
    const t = board[idx(tf, tr)];
    if (t && t.color === color) return false;
    dests.push(idx(tf, tr));
    return !t; // true = empty, can continue sliding
  };

  if (type === 'K') {
    for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const tf = f + df;
      const tr = r + dr;
      if (inPalace(tf, tr, color)) tryPush(tf, tr);
    }
  } else if (type === 'A') {
    for (const [df, dr] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const tf = f + df;
      const tr = r + dr;
      if (inPalace(tf, tr, color)) tryPush(tf, tr);
    }
  } else if (type === 'E') {
    for (const [df, dr] of [[2, 2], [2, -2], [-2, 2], [-2, -2]]) {
      const tf = f + df;
      const tr = r + dr;
      const eyeF = f + df / 2;
      const eyeR = r + dr / 2;
      if (!inBounds(tf, tr) || !onOwnSide(tr, color)) continue;
      if (board[idx(eyeF, eyeR)]) continue;
      tryPush(tf, tr);
    }
  } else if (type === 'H') {
    const legs = [
      { lf: 0, lr: 1, jumps: [[1, 2], [-1, 2]] },
      { lf: 0, lr: -1, jumps: [[1, -2], [-1, -2]] },
      { lf: 1, lr: 0, jumps: [[2, 1], [2, -1]] },
      { lf: -1, lr: 0, jumps: [[-2, 1], [-2, -1]] },
    ];
    for (const leg of legs) {
      const blockF = f + leg.lf;
      const blockR = r + leg.lr;
      if (!inBounds(blockF, blockR) || board[idx(blockF, blockR)]) continue;
      for (const [df, dr] of leg.jumps) tryPush(f + df, r + dr);
    }
  } else if (type === 'R') {
    for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      let tf = f + df;
      let tr = r + dr;
      while (inBounds(tf, tr)) {
        if (!tryPush(tf, tr)) break;
        tf += df;
        tr += dr;
      }
    }
  } else if (type === 'C') {
    for (const [df, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      let tf = f + df;
      let tr = r + dr;
      // slide without capture
      while (inBounds(tf, tr) && !board[idx(tf, tr)]) {
        dests.push(idx(tf, tr));
        tf += df;
        tr += dr;
      }
      // screen then capture
      if (inBounds(tf, tr) && board[idx(tf, tr)]) {
        tf += df;
        tr += dr;
        while (inBounds(tf, tr)) {
          const t = board[idx(tf, tr)];
          if (t) {
            if (t.color !== color) dests.push(idx(tf, tr));
            break;
          }
          tf += df;
          tr += dr;
        }
      }
    }
  } else if (type === 'P') {
    const forward = color === RED ? 1 : -1;
    tryPush(f, r + forward);
    if ((color === RED && r >= 5) || (color === BLACK && r <= 4)) {
      tryPush(f + 1, r);
      tryPush(f - 1, r);
    }
  }

  return dests;
}

export function isInCheck(board, color) {
  if (kingsFace(board)) return true;
  const king = findKing(board, color);
  if (king < 0) return true;
  const foe = opponent(color);
  for (let i = 0; i < board.length; i++) {
    const p = board[i];
    if (!p || p.color !== foe) continue;
    if (generateMovesFrom(board, i).includes(king)) return true;
  }
  return false;
}

/**
 * Apply move; returns captured piece (or null). Mutates board.
 */
export function applyMove(board, from, to) {
  const captured = board[to];
  board[to] = board[from];
  board[from] = null;
  return captured;
}

export function undoMove(board, from, to, captured) {
  board[from] = board[to];
  board[to] = captured;
}

/** Legal destinations from `from` (own king not left in check). */
export function legalMovesFrom(board, from) {
  const piece = board[from];
  if (!piece) return [];
  const color = piece.color;
  const out = [];
  for (const to of generateMovesFrom(board, from)) {
    const cap = applyMove(board, from, to);
    const ok = !isInCheck(board, color);
    undoMove(board, from, to, cap);
    if (ok) out.push(to);
  }
  return out;
}

/** All legal moves for a side: [{ from, to }] */
export function allLegalMoves(board, color) {
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    const p = board[i];
    if (!p || p.color !== color) continue;
    for (const to of legalMovesFrom(board, i)) {
      moves.push({ from: i, to });
    }
  }
  return moves;
}

/**
 * @returns {'checkmate'|'stalemate'|'playing'}
 */
export function gameStatus(board, sideToMove) {
  const moves = allLegalMoves(board, sideToMove);
  if (moves.length > 0) return 'playing';
  return isInCheck(board, sideToMove) ? 'checkmate' : 'stalemate';
}

export function cloneBoard(board) {
  return board.map((p) => (p ? { type: p.type, color: p.color } : null));
}

/** Compact ICCS-ish: file letter a–i, rank 0–9. */
export function squareName(i) {
  return String.fromCharCode(97 + fileOf(i)) + rankOf(i);
}

export function moveName(from, to) {
  return squareName(from) + squareName(to);
}

const RED_NUMERALS = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
const BLACK_NUMERALS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const RED_STEPS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function fileNumeral(file, color) {
  return color === RED ? RED_NUMERALS[file] : BLACK_NUMERALS[file];
}

function stepNumeral(steps, color) {
  return color === RED ? RED_STEPS[steps] : String(steps);
}

/**
 * Human-readable traditional Xiangqi notation, e.g. 炮八平五 / 馬2進3.
 * The board must be the position before the move is made.
 */
export function moveNotation(board, from, to) {
  const piece = board[from];
  if (!piece) return moveName(from, to);

  const fromFile = fileOf(from);
  const fromRank = rankOf(from);
  const toFile = fileOf(to);
  const toRank = rankOf(to);
  const sameFile = [];

  for (let rank = 0; rank < RANKS; rank++) {
    const candidate = board[idx(fromFile, rank)];
    if (candidate?.type === piece.type && candidate.color === piece.color) {
      sameFile.push(idx(fromFile, rank));
    }
  }

  let prefix;
  if (sameFile.length === 2) {
    sameFile.sort((a, b) => {
      const rankDelta = rankOf(b) - rankOf(a);
      return piece.color === RED ? rankDelta : -rankDelta;
    });
    prefix = `${sameFile[0] === from ? '前' : '後'}${labelFor(piece)}`;
  } else {
    prefix = `${labelFor(piece)}${fileNumeral(fromFile, piece.color)}`;
  }

  if (fromRank === toRank) {
    return `${prefix}平${fileNumeral(toFile, piece.color)}`;
  }

  const forward = piece.color === RED ? toRank > fromRank : toRank < fromRank;
  const action = forward ? '進' : '退';
  const diagonalPiece = ['H', 'E', 'A'].includes(piece.type);
  const destination = diagonalPiece
    ? fileNumeral(toFile, piece.color)
    : stepNumeral(Math.abs(toRank - fromRank), piece.color);

  return `${prefix}${action}${destination}`;
}

export function labelFor(piece) {
  if (!piece) return '';
  return PIECE_LABEL[piece.color][piece.type];
}
