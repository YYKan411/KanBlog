/**
 * Post-game review powered by Pikafish — written in plain Cantonese,
 * with a highlighted turning point and the lines that follow each move.
 */

import { cloneBoard, applyMove, moveName, moveNotation } from './rules.js';
import { parseIccsMove } from './pikafish.js';

/** Describe a centipawn score (from the player's own view) in plain words. */
function describeScore(cp) {
  if (cp >= 90000) return '已成殺勢';
  if (cp <= -90000) return '快將被將死';
  const magnitude = Math.abs(cp);
  if (magnitude < 40) return '大致均勢';
  if (cp > 0) {
    if (magnitude < 120) return '你稍佔上風';
    if (magnitude < 300) return '你佔優';
    if (magnitude < 800) return '你大優';
    return '你已成勝勢';
  }
  if (magnitude < 120) return '對手稍佔上風';
  if (magnitude < 300) return '對手佔優';
  if (magnitude < 800) return '對手大優';
  return '對手已成勝勢';
}

/** Replay a principal variation into readable notation. */
function pvToNotation(startBoard, pv, maxPlies) {
  const board = cloneBoard(startBoard);
  const out = [];
  for (let i = 0; i < pv.length && i < maxPlies; i++) {
    const move = parseIccsMove(pv[i]);
    if (!move || !board[move.from]) break;
    out.push(moveNotation(board, move.from, move.to));
    applyMove(board, move.from, move.to);
  }
  return out;
}

function pawnsOf(cp) {
  return (cp / 100).toFixed(1);
}

/**
 * @param {import('./rules.js').Board} initial
 * @param {{ from: number, to: number, by: 'red'|'black' }[]} history
 * @param {'red'|'black'} humanColor
 * @param {import('./pikafish.js').PikafishEngine} engine
 */
export async function reviewGame(initial, history, humanColor, engine, onProgress = () => {}) {
  const board = cloneBoard(initial);
  const notes = [];
  const prefix = [];
  const humanMoves = history.filter((move) => move.by === humanColor).length;
  let reviewed = 0;

  for (let ply = 0; ply < history.length; ply++) {
    const move = history[ply];
    const before = cloneBoard(board);
    const side = move.by;
    const notation = move.notation || moveNotation(before, move.from, move.to);

    if (side !== humanColor) {
      applyMove(board, move.from, move.to);
      prefix.push(move);
      notes.push({
        ply,
        move,
        moveLabel: moveName(move.from, move.to),
        kind: 'engine',
        notation,
        text: `引擎：${notation}`,
      });
      continue;
    }

    const bestAnalysis = await engine.analyse(prefix, 500);
    const playedAnalysis = await engine.analyse([...prefix, move], 380);
    const best = bestAnalysis.best;
    const bestScore = bestAnalysis.score;
    // After the played move it is the opponent's turn, so flip the score back
    // to the player's own perspective.
    const playedScore = -playedAnalysis.score;
    const delta = Math.max(0, bestScore - playedScore);
    const bestNotation = best ? moveNotation(before, best.from, best.to) : null;

    const afterBoard = cloneBoard(before);
    applyMove(afterBoard, move.from, move.to);

    const recoLine = pvToNotation(before, bestAnalysis.pv, 4);
    const punishLine = pvToNotation(afterBoard, playedAnalysis.pv, 3);

    applyMove(board, move.from, move.to);
    prefix.push(move);

    let kind = 'good';
    let verdict = '穩健';
    if (best && best.from === move.from && best.to === move.to) {
      kind = 'best';
      verdict = '最佳着';
    } else if (delta >= 250) {
      kind = 'blunder';
      verdict = '失着';
    } else if (delta >= 100) {
      kind = 'mistake';
      verdict = '軟着';
    } else if (delta >= 40) {
      kind = 'inaccuracy';
      verdict = '可改進';
    }

    const playedDesc = describeScore(playedScore);
    const bestDesc = describeScore(bestScore);

    notes.push({
      ply,
      move,
      moveLabel: moveName(move.from, move.to),
      notation,
      kind,
      verdict,
      delta,
      best,
      bestNotation,
      playedScore,
      bestScore,
      playedDesc,
      bestDesc,
      recoLine,
      punishLine,
      text: kind === 'best' || !bestNotation
        ? `${verdict}：${notation}`
        : `${verdict}：${notation} · 建議：${bestNotation}`,
    });

    reviewed += 1;
    onProgress(reviewed, humanMoves);
  }

  const humanNotes = notes.filter((n) => n.kind !== 'engine');
  const summary = {
    best: humanNotes.filter((n) => n.kind === 'best').length,
    good: humanNotes.filter((n) => n.kind === 'good').length,
    inaccuracy: humanNotes.filter((n) => n.kind === 'inaccuracy').length,
    mistake: humanNotes.filter((n) => n.kind === 'mistake').length,
    blunder: humanNotes.filter((n) => n.kind === 'blunder').length,
  };

  const highlight = buildHighlight(humanNotes);

  return { notes, summary, highlight };
}

function buildHighlight(humanNotes) {
  if (!humanNotes.length) return null;

  const turningPoint = humanNotes
    .filter((note) => note.delta >= 40)
    .sort((a, b) => b.delta - a.delta)[0];

  if (turningPoint) {
    const turn = Math.floor(turningPoint.ply / 2) + 1;
    const cost = Math.round(turningPoint.delta);
    const reco = turningPoint.recoLine.length
      ? `改行 ${turningPoint.recoLine.join('，')}`
      : `改行 ${turningPoint.bestNotation}`;
    return {
      ply: turningPoint.ply,
      kind: turningPoint.kind,
      title: `全場轉捩點 · 第 ${turn} 回合`,
      text:
        `你行 ${turningPoint.notation}，局面變成${turningPoint.playedDesc}；` +
        `本來 ${reco}，可以保持${turningPoint.bestDesc}。` +
        `呢一步大約蝕咗 ${cost} 分（≈ ${pawnsOf(turningPoint.delta)} 隻兵）。`,
    };
  }

  const shining = humanNotes.find((note) => note.kind === 'best') || humanNotes[0];
  const turn = Math.floor(shining.ply / 2) + 1;
  return {
    ply: shining.ply,
    kind: 'best',
    title: '全場高光',
    text:
      `全盤冇明顯失誤，行得幾穩陣。` +
      `例如第 ${turn} 回合 ${shining.notation}，同 Pikafish 首選一致，維持${shining.bestDesc}。`,
  };
}
