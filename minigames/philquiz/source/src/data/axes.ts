import type { AxisId, AxisVector, LocalizedText, QuizChapter } from '../types';

export const AXES: {
  id: AxisId;
  label: LocalizedText;
  low: LocalizedText;
  high: LocalizedText;
  glossary: LocalizedText;
}[] = [
  {
    id: 'ethics',
    label: { zh: '倫理', en: 'Ethics' },
    low: { zh: '義務與底線', en: 'Duty & limits' },
    high: { zh: '後果與整體', en: 'Outcomes & the greater good' },
    glossary: {
      zh: '你更重視行為本身是否正當（義務、底線），還是結果是否令最多人受益（後果、整體）。',
      en: 'Whether you weigh the rightness of an act itself (duty, limits) or the outcomes for the most people (consequences, the greater good).',
    },
  },
  {
    id: 'epistemology',
    label: { zh: '認識', en: 'Knowing' },
    low: { zh: '原則與推理', en: 'Principles & reason' },
    high: { zh: '經驗與具體', en: 'Experience & the concrete' },
    glossary: {
      zh: '你更信任邏輯、原則與普遍推理，還是親身經驗、現場與具體脈絡。',
      en: 'Whether you trust logic, principles, and universal reasoning, or lived experience, context, and the concrete scene.',
    },
  },
  {
    id: 'existence',
    label: { zh: '存在', en: 'Existence' },
    low: { zh: '追尋意義', en: 'Seeking meaning' },
    high: { zh: '接納荒謬', en: 'Living with absurdity' },
    glossary: {
      zh: '你傾向追問人生意義、歸屬與目的，還是在無終極答案時仍認真活、接納有限。',
      en: 'Whether you seek meaning, belonging, and purpose, or live seriously while accepting finitude when no final answer arrives.',
    },
  },
  {
    id: 'social',
    label: { zh: '社羣', en: 'Community' },
    low: { zh: '關係與責任', en: 'Bonds & responsibility' },
    high: { zh: '個人與自主', en: 'Individual autonomy' },
    glossary: {
      zh: '你做決定時，更優先關係、責任與他人，還是個人自主、邊界與自我選擇。',
      en: 'Whether you prioritise bonds, responsibility, and others, or individual autonomy, boundaries, and self-direction.',
    },
  },
  {
    id: 'stance',
    label: { zh: '態度', en: 'Stance' },
    low: { zh: '確信與行動', en: 'Conviction & action' },
    high: { zh: '懷疑與謙抑', en: 'Doubt & humility' },
    glossary: {
      zh: '你傾向在關鍵時刻表態、行動，還是保留懷疑、暫緩判斷、承認自己可能看錯。',
      en: 'Whether you tend to commit and act at decisive moments, or hold doubt, defer judgment, and admit you may be wrong.',
    },
  },
  {
    id: 'tradition',
    label: { zh: '傳統', en: 'Tradition' },
    low: { zh: '承傳與經典', en: 'Heritage & continuity' },
    high: { zh: '革新與突破', en: 'Innovation & rupture' },
    glossary: {
      zh: '你更尊重經典、習俗與承傳，還是傾向質疑、改寫、打破舊有框架。',
      en: 'Whether you respect classics, customs, and continuity, or tend to question, rewrite, and break older frames.',
    },
  },
];

export const CHAPTERS: QuizChapter[] = [
  {
    id: 'ethics',
    phase: 1,
    title: { zh: '第一輪：日常道德', en: 'First round: everyday ethics' },
    subtitle: { zh: '深夜傾計時，常聽到的「應不應該」。', en: 'The should-I-shouldn’t-I questions that come up in late-night talk.' },
  },
  {
    id: 'knowledge',
    phase: 1,
    title: { zh: '第二輪：知識與真理', en: 'Second round: knowledge & truth' },
    subtitle: { zh: '你信眼見，定信推理？', en: 'Do you trust your eyes, or your arguments?' },
  },
  {
    id: 'freedom',
    phase: 1,
    title: { zh: '第三輪：自由與責任', en: 'Third round: freedom & responsibility' },
    subtitle: { zh: '選擇有重量——誰來承擔？', en: 'The weight of choice — and who carries it.' },
  },
  {
    id: 'others',
    phase: 1,
    title: { zh: '第四輪：他人與社羣', en: 'Fourth round: others & community' },
    subtitle: { zh: '「我」以外，還有誰？', en: 'Beyond “me” — who else counts?' },
  },
  {
    id: 'meaning',
    phase: 2,
    title: { zh: '第五輪：荒謬與意義', en: 'Fifth round: absurdity & meaning' },
    subtitle: { zh: '若世界無答案，你仍如何過活？', en: 'If the world offers no answer, how do you still live?' },
  },
  {
    id: 'scenarios',
    phase: 3,
    title: { zh: '最後一輪：情境試題', en: 'Final round: scenario dilemmas' },
    subtitle: { zh: '想像力實驗——像思想實驗，但帶點人味。', en: 'Thought experiments with a human aftertaste.' },
  },
];

export const EMPTY_VECTOR = (): AxisVector =>
  ({
    ethics: 0,
    epistemology: 0,
    existence: 0,
    social: 0,
    stance: 0,
    tradition: 0,
  }) satisfies AxisVector;

export const AXIS_IDS: AxisId[] = ['ethics', 'epistemology', 'existence', 'social', 'stance', 'tradition'];
