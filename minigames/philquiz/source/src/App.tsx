import { useEffect, useMemo, useState } from 'react';
import { Intro } from './components/Intro';
import { Layout } from './components/Layout';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { QUESTIONS } from './data/questions';
import {
  computeVector,
  decodeShareParam,
  matchPhilosophers,
  resolveShareVector,
} from './engine/score';
import type { AppScreen, MatchResult, QuizAnswer } from './types';

const STORAGE_KEY = 'yykan-philquiz-v3';

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
  const { t } = useLanguage();
  const params = new URLSearchParams(window.location.search);
  const sharePrimary = decodeShareParam(params.get('r'));
  const shareVector = resolveShareVector(params.get('axes'), sharePrimary);
  const isShareView = Boolean(sharePrimary || shareVector);

  const [screen, setScreen] = useState<AppScreen>(() => {
    if (isShareView) return 'results';
    const saved = loadSaved();
    // Mid-quiz progress exists: offer continue-or-restart instead of a silent jump.
    if (saved?.screen === 'quiz' && saved.answers.length > 0) return 'resume';
    return saved?.screen ?? 'intro';
  });
  const [answers, setAnswers] = useState<QuizAnswer[]>(() => loadSaved()?.answers ?? []);
  const [index, setIndex] = useState(() =>
    Math.min(loadSaved()?.index ?? 0, QUESTIONS.length - 1),
  );

  useEffect(() => {
    if (isShareView) return;
    const persistedScreen: AppScreen = screen === 'resume' ? 'quiz' : screen;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen: persistedScreen, answers, index }));
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

  // Saved state from an older question set can leave screen==='results' with no
  // matches — clear it and return to the intro instead of stranding the user.
  useEffect(() => {
    if (screen === 'results' && !isShareView && matches.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers([]);
      setIndex(0);
      setScreen('intro');
    }
  }, [screen, isShareView, matches.length]);

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

  const handleBack = () => setIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers([]);
    setIndex(0);
    setScreen('intro');
  };

  const handleRetake = () => {
    restart();
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <Layout>
      {screen === 'intro' && <Intro onStart={() => setScreen('quiz')} />}
      {screen === 'resume' && (
        <section className="panel resume-panel">
          <p className="lede">
            {t({
              zh: `上次做到第 ${Math.min(index + 1, QUESTIONS.length)} 題（共 ${QUESTIONS.length} 題）。繼續，還是重新開始？`,
              en: `You were on question ${Math.min(index + 1, QUESTIONS.length)} of ${QUESTIONS.length}. Continue, or start over?`,
            })}
          </p>
          <div className="resume-actions">
            <button type="button" className="primary-btn" onClick={() => setScreen('quiz')}>
              {t({ zh: '繼續', en: 'Continue' })}
            </button>
            <button type="button" className="ghost-btn" onClick={restart}>
              {t({ zh: '重新開始', en: 'Start over' })}
            </button>
          </div>
        </section>
      )}
      {screen === 'quiz' && (
        <Quiz answers={answers} index={index} onAnswer={handleAnswer} onBack={handleBack} />
      )}
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
