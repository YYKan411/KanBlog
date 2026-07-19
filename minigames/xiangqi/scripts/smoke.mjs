/**
 * Smoke tests for xiangqi rules — run: node scripts/smoke.mjs
 */

import {
  initialBoard, allLegalMoves, legalMovesFrom, applyMove, undoMove,
  isInCheck, kingsFace, gameStatus, RED, BLACK, idx, cloneBoard,
  moveNotation,
} from '../src/rules.js';
import { chooseMove, evaluate } from '../src/ai.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('FAIL:', msg);
  } else {
    console.log('ok:', msg);
  }
}

const b = initialBoard();
assert(b[idx(4, 0)]?.type === 'K' && b[idx(4, 0)]?.color === RED, 'red king at e0');
assert(b[idx(4, 9)]?.type === 'K' && b[idx(4, 9)]?.color === BLACK, 'black king at e9');
assert(moveNotation(b, idx(7, 2), idx(4, 2)) === '炮二平五', 'red notation: 炮二平五');
assert(moveNotation(b, idx(1, 7), idx(4, 7)) === '砲2平5', 'black notation: 砲2平5');
assert(moveNotation(b, idx(1, 0), idx(2, 2)) === '傌八進七', 'horse notation uses destination file');

const redMoves = allLegalMoves(b, RED);
assert(redMoves.length > 20, `red has opening moves (${redMoves.length})`);

// Chariot on a0 cannot jump
const rookMoves = legalMovesFrom(b, idx(0, 0));
assert(rookMoves.length === 2, `red left rook opening moves (got ${rookMoves.length})`);

// Horse h2 blocked? Red horse at b0: leg at b1 empty, can go a2 c2? 
// Actually horse at (1,0): legs - forward (1,1) empty → jumps (0,2)(2,2); right leg (2,0) has elephant - blocked for (3,1); left (0,0) has rook.
const horse = legalMovesFrom(b, idx(1, 0));
assert(horse.includes(idx(2, 2)) && horse.includes(idx(0, 2)), 'red horse can jump to a2/c2');

// Flying general: clear file between kings
const face = cloneBoard(b);
// remove everything on file 4 except kings
for (let r = 1; r <= 8; r++) face[idx(4, r)] = null;
assert(kingsFace(face), 'kings face on open file');
assert(isInCheck(face, RED) && isInCheck(face, BLACK), 'facing counts as check');

// Make a legal pawn move
const pawnFrom = idx(4, 3);
const pawnTos = legalMovesFrom(b, pawnFrom);
assert(pawnTos.includes(idx(4, 4)), 'center pawn can advance');
const cap = applyMove(b, pawnFrom, idx(4, 4));
assert(cap === null, 'pawn advance no capture');
undoMove(b, pawnFrom, idx(4, 4), cap);
assert(b[pawnFrom]?.type === 'P', 'undo restored pawn');

// AI returns a move
const t0 = Date.now();
const aiMove = chooseMove(initialBoard(), RED, 'easy');
const dt = Date.now() - t0;
assert(aiMove && Number.isInteger(aiMove.from), `AI picks a move in ${dt}ms`);
assert(evaluate(initialBoard(), RED) === 0 || typeof evaluate(initialBoard(), RED) === 'number', 'eval returns number');

// After random legal play, status stays playing early
let g = initialBoard();
let side = RED;
for (let i = 0; i < 6; i++) {
  const moves = allLegalMoves(g, side);
  assert(moves.length > 0, `ply ${i} has moves`);
  const m = moves[0];
  applyMove(g, m.from, m.to);
  side = side === RED ? BLACK : RED;
  assert(gameStatus(g, side) === 'playing' || gameStatus(g, side) === 'checkmate' || gameStatus(g, side) === 'stalemate', 'status valid');
}

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall smoke tests passed');
