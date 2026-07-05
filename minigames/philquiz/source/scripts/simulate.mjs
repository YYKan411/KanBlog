/**
 * Random simulation for philquiz balance audit.
 * Run: node scripts/simulate.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '../src');

function loadTsModule(relativePath) {
  const filePath = join(srcDir, relativePath);
  const source = readFileSync(filePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filePath,
  });
  const module = { exports: {} };
  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', outputText);
  fn(module.exports, require, module, filePath, dirname(filePath));
  return module.exports;
}

const { AXIS_IDS, EMPTY_VECTOR } = loadTsModule('data/axes.ts');
const { QUESTIONS } = loadTsModule('data/questions.ts');
const { PHILOSOPHERS } = loadTsModule('data/philosophers.ts');

function computeAxisBounds() {
  const min = EMPTY_VECTOR();
  const max = EMPTY_VECTOR();
  const baseline = EMPTY_VECTOR();
  for (const question of QUESTIONS) {
    for (const axis of AXIS_IDS) {
      const weights = question.options.map((o) => o.weights[axis] ?? 0);
      min[axis] += Math.min(...weights);
      max[axis] += Math.max(...weights);
      baseline[axis] += weights.reduce((sum, w) => sum + w, 0) / weights.length;
    }
  }
  return { min, max, baseline };
}

const BOUNDS = computeAxisBounds();

function normalizeVector(raw) {
  const normalized = EMPTY_VECTOR();
  for (const axis of AXIS_IDS) {
    const value = raw[axis];
    const base = BOUNDS.baseline[axis];
    const lo = BOUNDS.min[axis];
    const hi = BOUNDS.max[axis];
    let score = 0;
    if (value >= base) score = hi === base ? 0 : (2 * (value - base)) / (hi - base);
    else score = base === lo ? 0 : (2 * (value - base)) / (base - lo);
    normalized[axis] = Math.max(-2, Math.min(2, score));
  }
  return normalized;
}

function computeRaw(answers) {
  const raw = EMPTY_VECTOR();
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]));
  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    const option = question?.options.find((o) => o.id === answer.optionId);
    if (!option) continue;
    for (const axis of AXIS_IDS) raw[axis] += option.weights[axis] ?? 0;
  }
  return raw;
}

function matchPhilosophers(vector) {
  const ranked = PHILOSOPHERS.map((p) => {
    let sum = 0;
    for (const axis of AXIS_IDS) {
      const diff = vector[axis] - p.centroid[axis];
      sum += (diff * diff) / 9;
    }
    return { id: p.id, distance: Math.sqrt(sum) };
  }).sort((a, b) => a.distance - b.distance);
  return ranked[0].id;
}

function simulate(n, pick) {
  const counts = Object.fromEntries(PHILOSOPHERS.map((p) => [p.id, 0]));
  const rankScores = [];
  for (let i = 0; i < n; i += 1) {
    const answers = QUESTIONS.map((q) => ({
      questionId: q.id,
      optionId: pick(q),
    }));
    const vector = normalizeVector(computeRaw(answers));
    rankScores.push(1 / (1 + PHILOSOPHERS.map((p) => {
      let sum = 0;
      for (const axis of AXIS_IDS) {
        const diff = vector[axis] - p.centroid[axis];
        sum += (diff * diff) / 9;
      }
      return Math.sqrt(sum);
    }).sort((a, b) => a - b)[0]));
    const top = matchPhilosophers(vector);
    counts[top] += 1;
  }
  rankScores.sort((a, b) => a - b);
  return { counts, medianRankScore: rankScores[Math.floor(rankScores.length / 2)] };
}

function topEntries(counts, n = 5000) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, c]) => `${id}: ${((c / n) * 100).toFixed(1)}%`);
}

const n = 5000;
const random = simulate(n, () => ['a', 'b', 'c'][Math.floor(Math.random() * 3)]);
const allC = simulate(n, () => 'c');

console.log('Questions:', QUESTIONS.length);
console.log('Baseline (random expected raw):', BOUNDS.baseline);
console.log('\nRandom top-match:', topEntries(random.counts).join(', '));
console.log('Random median rank score:', (random.medianRankScore * 100).toFixed(1));
console.log('\nAll-C top-match:', topEntries(allC.counts).join(', '));
