import { AXIS_IDS, EMPTY_VECTOR } from '../data/axes';
import { PHILOSOPHERS } from '../data/philosophers';
import { QUESTIONS } from '../data/questions';
import type { AxisId, AxisVector, MatchResult, Philosopher, QuizAnswer } from '../types';

const AXIS_SCALE: Record<AxisId, number> = {
  ethics: 3,
  epistemology: 3,
  existence: 3,
  social: 3,
  stance: 3,
  tradition: 3,
};

export function computeVector(answers: QuizAnswer[]): AxisVector {
  const vector = EMPTY_VECTOR();
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]));

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option) continue;

    for (const axis of AXIS_IDS) {
      vector[axis] += option.weights[axis] ?? 0;
    }
  }

  return vector;
}

function weightedDistance(a: AxisVector, b: AxisVector): number {
  let sum = 0;
  for (const axis of AXIS_IDS) {
    const diff = a[axis] - b[axis];
    sum += (diff * diff) / (AXIS_SCALE[axis] * AXIS_SCALE[axis]);
  }
  return Math.sqrt(sum);
}

function toSimilarity(distance: number): number {
  return Math.round((1 / (1 + distance)) * 100);
}

export function matchPhilosophers(vector: AxisVector, limit = 4): MatchResult[] {
  const ranked = PHILOSOPHERS.map((philosopher) => ({
    philosopher,
    distance: weightedDistance(vector, philosopher.centroid),
  }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ philosopher, distance }) => ({
      philosopher,
      similarity: toSimilarity(distance),
    }));

  return ranked;
}

export function getPhilosopherById(id: string): Philosopher | undefined {
  return PHILOSOPHERS.find((p) => p.id === id);
}

export function decodeShareParam(param: string | null): string | null {
  if (!param) return null;
  return PHILOSOPHERS.some((p) => p.id === param) ? param : null;
}

export function buildShareUrl(primaryId: string, secondaryId?: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set('r', primaryId);
  if (secondaryId) url.searchParams.set('s', secondaryId);
  url.hash = '';
  return url.toString();
}

export function normalizeMatches(primaryId: string, secondaryId?: string): MatchResult[] {
  const primary = getPhilosopherById(primaryId);
  if (!primary) return matchPhilosophers(EMPTY_VECTOR());

  const secondary = secondaryId ? getPhilosopherById(secondaryId) : undefined;
  const fallback = matchPhilosophers(primary.centroid, 4);

  const results: MatchResult[] = [{ philosopher: primary, similarity: fallback[0]?.similarity ?? 88 }];
  if (secondary && secondary.id !== primary.id) {
    results.push({ philosopher: secondary, similarity: fallback[1]?.similarity ?? 62 });
  }
  for (const item of fallback) {
    if (results.length >= 4) break;
    if (!results.some((r) => r.philosopher.id === item.philosopher.id)) {
      results.push(item);
    }
  }
  return results;
}
