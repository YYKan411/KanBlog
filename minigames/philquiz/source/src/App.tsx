import { useEffect, useMemo, useState } from 'react';
import { Intro } from './components/Intro';
import { Layout } from './components/Layout';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { LanguageProvider } from './context/LanguageContext';
import { QUESTIONS } from './data/questions';
import {
  computeVector,
  decodeShareParam,
  matchPhilosophers,
  resolveShareVector,
} from './engine/score';
import type { AppScreen, MatchResult, QuizAnswer } from './types';

const STORAGE_KEY = 'yykan-philquiz-v2';

interface SavedState {
  screen: AppScreen;
  answers: QuizAnswer[];
  index: number;
}

function loadSaved(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch {
    return null;
  }
}

function AppInner() {
  const params = new URLSearchParams(window.location.search);
  const sharePrimary = decodeShareParam(params.get('r'));
  const shareVector = resolveShareVector(params.get('axes'), sharePrimary);
  const isShareView = Boolean(sharePrimary || shareVector);

  const [screen, setScreen] = useState<AppScreen>(() => {
    if (isShareView) return 'results';
    const saved = loadSaved();
    return saved?.screen ?? 'intro';
  });
  const [answers, setAnswers] = useState<QuizAnswer[]>(() => loadSaved()?.answers ?? []);
  const [index, setIndex] = useState(() => loadSaved()?.index ?? 0);

  useEffect(() => {
    if (isShareView) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, answers, index }));
  }, [screen, answers, index, isShareView]);

  const vector = useMemo(() => {
    if (shareVector) return shareVector;
    return computeVector(answers);
  }, [shareVector, answers]);

  const matches: MatchResult[] = useMemo(() => {
    if (shareVector) return matchPhilosophers(shareVector, 4);
    if (answers.length === QUESTIONS.length) return matchPhilosophers(vector, 4);
    return [];
  }, [answers.length, shareVector, vector]);

  const handleAnswer = (answer: QuizAnswer) => {
    setAnswers((prev) => {
      const next = prev.filter((a) => a.questionId !== answer.questionId);
      next.push(answer);
      return next;
    });

    if (index + 1 >= QUESTIONS.length) {
      setScreen('results');
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleRetake = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers([]);
    setIndex(0);
    setScreen('intro');
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <Layout>
      {screen === 'intro' && <Intro onStart={() => setScreen('quiz')} />}
      {screen === 'quiz' && <Quiz answers={answers} index={index} onAnswer={handleAnswer} />}
      {screen === 'results' && matches.length > 0 && (
        <Results matches={matches} vector={vector} onRetake={handleRetake} isShareView={isShareView} />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
