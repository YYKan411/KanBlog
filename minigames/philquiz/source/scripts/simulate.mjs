/**
 * Balance audit for philquiz (SCORING_VERSION 3, cosine matching).
 * Run: node scripts/simulate.mjs   (Node >= 22.18 — imports .ts via native type stripping)
 *
 * Reports:
 *  1. uniform-random answering  -> top-1 distribution (flat-ish = healthy; no thinker should dominate)
 *  2. "attractive option" bias  -> top-1 distribution when takers prefer option c
 *  3. persona self-recovery     -> a noisy persona seeded at each thinker's centroid should
 *                                  get that thinker back as top match (target: >= ~50% each;
 *                                  arendt/du-bois are known near-twins and sit lower)
 *  4. population fidelity       -> quiz top-1 == persona's true nearest centroid
 */
import { QUESTIONS } from '../src/data/questions.ts';
import { PHILOSOPHERS } from '../src/data/philosophers.ts';
import { AXIS_IDS, EMPTY_VECTOR } from '../src/data/axes.ts';

function computeAxisBounds() {
  const min = EMPTY_VECTOR(), max = EMPTY_VECTOR(), baseline = EMPTY_VECTOR();
  for (const q of QUESTIONS) for (const axis of AXIS_IDS) {
    const ws = q.options.map((o) => o.weights[axis] ?? 0);
    min[axis] += Math.min(...ws);
    max[axis] += Math.max(...ws);
    baseline[axis] += ws.reduce((s, w) => s + w, 0) / ws.length;
  }
  return { min, max, baseline };
}
const B = computeAxisBounds();

function normalize(raw) {
  const n = EMPTY_VECTOR();
  for (const axis of AXIS_IDS) {
    const v = raw[axis], base = B.baseline[axis], lo = B.min[axis], hi = B.max[axis];
    let s = 0;
    if (v >= base) s = hi === base ? 0 : (2 * (v - base)) / (hi - base);
    else s = base === lo ? 0 : (2 * (v - base)) / (base - lo);
    n[axis] = Math.max(-2, Math.min(2, s));
  }
  return n;
}

function cosineDistance(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const axis of AXIS_IDS) { dot += a[axis] * b[axis]; na += a[axis] ** 2; nb += b[axis] ** 2; }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  if (denom < 1e-9) return 1;
  return 1 - dot / denom;
}

function nearest(v) {
  let best = null;
  for (const p of PHILOSOPHERS) {
    const d = cosineDistance(v, p.centroid);
    if (!best || d < best.d) best = { id: p.id, d };
  }
  return best.id;
}

function vectorFor(pick) {
  const raw = EMPTY_VECTOR();
  for (const q of QUESTIONS) {
    const o = q.options[pick(q)];
    for (const a of AXIS_IDS) raw[a] += o.weights[a] ?? 0;
  }
  return normalize(raw);
}

function distribution(n, pick) {
  const counts = Object.fromEntries(PHILOSOPHERS.map((p) => [p.id, 0]));
  for (let i = 0; i < n; i += 1) counts[nearest(vectorFor(pick))] += 1;
  return counts;
}

function printDist(title, counts, n) {
  console.log(`\n=== ${title} ===`);
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([id, c]) => console.log(`  ${id.padEnd(14)} ${((100 * c) / n).toFixed(1)}%`));
}

function personaVector(persona, T) {
  const raw = EMPTY_VECTOR();
  for (const q of QUESTIONS) {
    const scores = q.options.map((o) => AXIS_IDS.reduce((s, a) => s + (o.weights[a] ?? 0) * persona[a], 0));
    const exps = scores.map((s) => Math.exp(s / T));
    const Z = exps.reduce((s, e) => s + e, 0);
    let r = Math.random() * Z, oi = 0;
    for (; oi < exps.length - 1; oi += 1) { r -= exps[oi]; if (r <= 0) break; }
    for (const a of AXIS_IDS) raw[a] += q.options[oi].weights[a] ?? 0;
  }
  return normalize(raw);
}

const N = 20000;
console.log(`Questions: ${QUESTIONS.length}, thinkers: ${PHILOSOPHERS.length}`);

printDist('1. uniform random answering (top-1)', distribution(N, () => Math.floor(Math.random() * 3)), N);
printDist(
  '2. attractive-option bias (c 50%, a/b 25%)',
  distribution(N, () => { const r = Math.random(); return r < 0.5 ? 2 : r < 0.75 ? 0 : 1; }),
  N,
);

console.log('\n=== 3. persona self-recovery (noise ±0.5, softmax T=1.0) ===');
const NSELF = 1500;
for (const target of PHILOSOPHERS) {
  const counts = {};
  for (let i = 0; i < NSELF; i += 1) {
    const persona = Object.fromEntries(AXIS_IDS.map((a) => [a, target.centroid[a] + (Math.random() - 0.5)]));
    const top = nearest(personaVector(persona, 1.0));
    counts[top] = (counts[top] ?? 0) + 1;
  }
  const self = ((100 * (counts[target.id] ?? 0)) / NSELF).toFixed(0);
  const second = Object.entries(counts).sort((a, b) => b[1] - a[1]).filter(([id]) => id !== target.id)[0];
  console.log(`  ${target.id.padEnd(14)} ${String(self).padStart(3)}%   (next: ${second ? second[0] : '-'})`);
}

console.log('\n=== 4. population fidelity (uniform personas, T=1.5) ===');
const NPOP = 10000;
let hits = 0;
for (let i = 0; i < NPOP; i += 1) {
  const persona = Object.fromEntries(AXIS_IDS.map((a) => [a, Math.random() * 4 - 2]));
  if (nearest(personaVector(persona, 1.5)) === nearest(persona)) hits += 1;
}
console.log(`  quiz top-1 == persona's nearest centroid: ${((100 * hits) / NPOP).toFixed(1)}%`);
