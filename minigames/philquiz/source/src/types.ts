export type Lang = 'zh' | 'en';

export type AxisId =
  | 'ethics'
  | 'epistemology'
  | 'existence'
  | 'social'
  | 'stance'
  | 'tradition';

export type AxisVector = Record<AxisId, number>;

export type LocalizedText = Record<Lang, string>;

export type AxisWeights = Partial<Record<AxisId, number>>;

export interface QuizOption {
  id: string;
  label: LocalizedText;
  weights: AxisWeights;
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  phase: 1 | 2 | 3;
  prompt: LocalizedText;
  options: QuizOption[];
}

export interface QuizChapter {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  phase: 1 | 2 | 3;
}

export interface BlogLink {
  slug: string;
  title: LocalizedText;
}

export interface Philosopher {
  id: string;
  name: LocalizedText;
  epithet: LocalizedText;
  era: LocalizedText;
  region: LocalizedText;
  centroid: AxisVector;
  biography: LocalizedText[];
  worldviewMatch: LocalizedText[];
  blindSpots: LocalizedText[];
  barQuote: LocalizedText;
  relatedIds: string[];
  blogLinks: BlogLink[];
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface MatchResult {
  philosopher: Philosopher;
  /** Internal rank score for ordering — not a statistical match probability. */
  similarity: number;
  rank: number;
}

export type AppScreen = 'intro' | 'quiz' | 'results';
