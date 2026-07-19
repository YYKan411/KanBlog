import { CHAPTERS } from '../data/axes';
import { QUESTIONS } from '../data/questions';
import type { QuizAnswer } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QuizProps {
  answers: QuizAnswer[];
  index: number;
  onAnswer: (answer: QuizAnswer) => void;
  onBack: () => void;
}

const HALFWAY_INDEX = Math.floor(QUESTIONS.length / 2);

export function Quiz({ answers, index, onAnswer, onBack }: QuizProps) {
  const { t } = useLanguage();
  const question = QUESTIONS[index];
  const chapter = CHAPTERS.find((c) => c.id === question.chapterId)!;
  const chapterQuestions = QUESTIONS.filter((q) => q.chapterId === chapter.id);
  const chapterIndex = chapterQuestions.findIndex((q) => q.id === question.id);
  const selected = answers.find((a) => a.questionId === question.id)?.optionId;

  const isNewChapter =
    index === 0 || QUESTIONS[index - 1].chapterId !== question.chapterId;

  return (
    <section className="panel quiz-panel">
      <div className="progress-meta">
        <span>
          {t({ zh: '第', en: 'Question ' })}
          {index + 1}
          {t({ zh: ` / ${QUESTIONS.length} 題`, en: ` of ${QUESTIONS.length}` })}
        </span>
        <div className="progress-bar" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      {isNewChapter && (
        <div className="chapter-banner">
          <h2>{t(chapter.title)}</h2>
          <p>{t(chapter.subtitle)}</p>
          {chapter.phase === 3 && (
            <p className="chapter-note">
              {t({
                zh: '最後一輪：玩幾個想像實驗。冇標準答案，淨係睇你點揀。',
                en: 'Final round: thought experiments. No clever answer — only your trade-offs.',
              })}
            </p>
          )}
        </div>
      )}

      {index === HALFWAY_INDEX && (
        <p className="halfway-note">
          {t({
            zh: '過咗一半。你個輪廓開始浮出嚟……',
            en: 'Past halfway. Your profile is taking shape…',
          })}
        </p>
      )}

      <h3 className="question-text">{t(question.prompt)}</h3>
      <div className="options">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`option-btn${selected === option.id ? ' selected' : ''}`}
            onClick={() => onAnswer({ questionId: question.id, optionId: option.id })}
          >
            <span className="option-label">{t(option.label)}</span>
          </button>
        ))}
      </div>

      <div className="quiz-nav">
        {index > 0 ? (
          <button type="button" className="ghost-btn back-btn" onClick={onBack}>
            {t({ zh: '← 上一題', en: '← Previous' })}
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
        <p className="chapter-progress">
          {t(chapter.title)} · {chapterIndex + 1}/{chapterQuestions.length}
        </p>
      </div>
    </section>
  );
}
