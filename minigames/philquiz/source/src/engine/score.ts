import { AXIS_IDS, EMPTY_VECTOR } from '../data/axes';
import { PHILOSOPHERS } from '../data/philosophers';
import { QUESTIONS } from '../data/questions';
import type { AxisId, AxisVector, MatchResult, Philosopher, QuizAnswer } from '../types';

export const SCORING_VERSION = 2;

const AXIS_SCALE: Record<AxisId, number> = {
  ethics: 3,
  epistemology: 3,
  existence: 3,
  social: 3,
  stance: 3,
  tradition: 3,
};

interface AxisBounds {
  min: AxisVector;
  max: AxisVector;
  baseline: AxisVector;
}

/** Per-axis achievable min, max, and neutral baseline (equal option probability). */
function computeAxisBounds(): AxisBounds {
  const min = EMPTY_VECTOR();
  const max = EMPTY_VECTOR();
  const baseline = EMPTY_VECTOR();

  for (const question of QUESTIONS) {
    for (const axis of AXIS_IDS) {
      const weights = question.options.map((option) => option.weights[axis] ?? 0);
      min[axis] += Math.min(...weights);
      max[axis] += Math.max(...weights);
      baseline[axis] += weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    }
  }

  return { min, max, baseline };
}

const AXIS_BOUNDS = computeAxisBounds();

/** Map raw sums to the same -2…+2 scale as philosopher centroids. */
export function normalizeVector(raw: AxisVector): AxisVector {
  const normalized = EMPTY_VECTOR();

  for (const axis of AXIS_IDS) {
    const value = raw[axis];
    const base = AXIS_BOUNDS.baseline[axis];
    const lo = AXIS_BOUNDS.min[axis];
    const hi = AXIS_BOUNDS.max[axis];

    let score = 0;
    if (value >= base) {
      score = hi === base ? 0 : (2 * (value - base)) / (hi - base);
    } else {
      score = base === lo ? 0 : (2 * (value - base)) / (base - lo);
    }

    normalized[axis] = Math.max(-2, Math.min(2, score));
  }

  return normalized;
}

export function computeRawVector(answers: QuizAnswer[]): AxisVector {
  const raw = EMPTY_VECTOR();
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]));

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option) continue;

    for (const axis of AXIS_IDS) {
      raw[axis] += option.weights[axis] ?? 0;
    }
  }

  return raw;
}

export function computeVector(answers: QuizAnswer[]): AxisVector {
  return normalizeVector(computeRawVector(answers));
}

function weightedDistance(a: AxisVector, b: AxisVector): number {
  let sum = 0;
  for (const axis of AXIS_IDS) {
    const diff = a[axis] - b[axis];
    sum += (diff * diff) / (AXIS_SCALE[axis] * AXIS_SCALE[axis]);
  }
  return Math.sqrt(sum);
}

/** Internal ordering key only — not a statistical match probability. */
function toRankScore(distance: number): number {
  return Math.round((1 / (1 + distance)) * 100);
}

export function matchPhilosophers(vector: AxisVector, limit = 4): MatchResult[] {
  return PHILOSOPHERS.map((philosopher) => ({
    philosopher,
    distance: weightedDistance(vector, philosopher.centroid),
  }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ philosopher, distance }, index) => ({
      philosopher,
      similarity: toRankScore(distance),
      rank: index + 1,
    }));
}

export function getPhilosopherById(id: string): Philosopher | undefined {
  return PHILOSOPHERS.find((p) => p.id === id);
}

export function decodeShareParam(param: string | null): string | null {
  if (!param) return null;
  return PHILOSOPHERS.some((p) => p.id === param) ? param : null;
}

export function encodeShareAxes(vector: AxisVector): string {
  return AXIS_IDS.map((axis) => vector[axis].toFixed(2)).join(',');
}

export function decodeShareAxes(param: string | null): AxisVector | null {
  if (!param) return null;
  const parts = param.split(',').map((part) => Number(part.trim()));
  if (parts.length !== AXIS_IDS.length || parts.some((part) => Number.isNaN(part))) return null;

  const vector = EMPTY_VECTOR();
  AXIS_IDS.forEach((axis, index) => {
    vector[axis] = Math.max(-2, Math.min(2, parts[index]));
  });
  return vector;
}

export function buildShareUrl(
  primaryId: string,
  vector: AxisVector,
  secondaryId?: string,
): string {
  const url = new URL(window.location.href);
  url.searchParams.set('r', primaryId);
  if (secondaryId) url.searchParams.set('s', secondaryId);
  url.searchParams.set('axes', encodeShareAxes(vector));
  url.searchParams.set('sv', String(SCORING_VERSION));
  url.hash = '';
  return url.toString();
}

/** Legacy share links without axes fall back to the primary thinker's centroid. */
export function resolveShareVector(
  axesParam: string | null,
  primaryId: string | null,
): AxisVector | null {
  const decoded = decodeShareAxes(axesParam);
  if (decoded) return decoded;

  if (primaryId) {
    const primary = getPhilosopherById(primaryId);
    if (primary) return { ...primary.centroid };
  }

  return null;
}

export function getAxisBounds(): AxisBounds {
  return {
    min: { ...AXIS_BOUNDS.min },
    max: { ...AXIS_BOUNDS.max },
    baseline: { ...AXIS_BOUNDS.baseline },
  };
}
