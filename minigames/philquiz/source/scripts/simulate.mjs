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

function computeAxisMaxExposure() {
  const exposure = EMPTY_VECTOR();
  for (const question of QUESTIONS) {
    for (const axis of AXIS_IDS) {
      exposure[axis] += Math.max(...question.options.map((o) => Math.abs(o.weights[axis] ?? 0)));
    }
  }
  return exposure;
}

const AXIS_MAX_EXPOSURE = computeAxisMaxExposure();

function computeVector(answers) {
  const raw = EMPTY_VECTOR();
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]));
  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    const option = question?.options.find((o) => o.id === answer.optionId);
    if (!option) continue;
    for (const axis of AXIS_IDS) raw[axis] += option.weights[axis] ?? 0;
  }
  const normalized = EMPTY_VECTOR();
  for (const axis of AXIS_IDS) {
    const max = AXIS_MAX_EXPOSURE[axis];
    normalized[axis] = max > 0 ? (raw[axis] / max) * 6 : 0;
  }
  return normalized;
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

function optionCStanceAvg() {
  let total = 0;
  let count = 0;
  for (const q of QUESTIONS) {
    const c = q.options.find((o) => o.id === 'c');
    if (c?.weights.stance != null) {
      total += c.weights.stance;
      count += 1;
    }
  }
  return count ? total / count : 0;
}

function simulate(n, pick) {
  const counts = Object.fromEntries(PHILOSOPHERS.map((p) => [p.id, 0]));
  for (let i = 0; i < n; i += 1) {
    const answers = QUESTIONS.map((q) => ({
      questionId: q.id,
      optionId: pick(q),
    }));
    const top = matchPhilosophers(computeVector(answers));
    counts[top] += 1;
  }
  return counts;
}

function topEntries(counts, n = 5) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, c]) => `${id}: ${((c / 5000) * 100).toFixed(1)}%`);
}

const n = 5000;
console.log('Questions:', QUESTIONS.length);
console.log('Axis max exposure:', AXIS_MAX_EXPOSURE);
console.log('Option C stance average:', optionCStanceAvg().toFixed(3));
console.log('\nAll random top-match:', topEntries(simulate(n, () => ['a', 'b', 'c'][Math.floor(Math.random() * 3)])).join(', '));
console.log('All C top-match:', topEntries(simulate(n, () => 'c')).join(', '));
