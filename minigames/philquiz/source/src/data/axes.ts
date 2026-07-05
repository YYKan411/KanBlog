import type { AxisId, AxisVector, LocalizedText, QuizChapter } from '../types';

export const AXES: { id: AxisId; label: LocalizedText; low: LocalizedText; high: LocalizedText }[] = [
  {
    id: 'ethics',
    label: { zh: '倫理', en: 'Ethics' },
    low: { zh: '義務與底線', en: 'Duty & limits' },
    high: { zh: '後果與整體', en: 'Outcomes & the greater good' },
  },
  {
    id: 'epistemology',
    label: { zh: '認識', en: 'Knowing' },
    low: { zh: '原則與推理', en: 'Principles & reason' },
    high: { zh: '經驗與具體', en: 'Experience & the concrete' },
  },
  {
    id: 'existence',
    label: { zh: '存在', en: 'Existence' },
    low: { zh: '追尋意義', en: 'Seeking meaning' },
    high: { zh: '接納荒謬', en: 'Living with absurdity' },
  },
  {
    id: 'social',
    label: { zh: '社群', en: 'Community' },
    low: { zh: '關係與責任', en: 'Bonds & responsibility' },
    high: { zh: '個人與自主', en: 'Individual autonomy' },
  },
  {
    id: 'stance',
    label: { zh: '態度', en: 'Stance' },
    low: { zh: '確信與行動', en: 'Conviction & action' },
    high: { zh: '懷疑與謙抑', en: 'Doubt & humility' },
  },
  {
    id: 'tradition',
    label: { zh: '傳統', en: 'Tradition' },
    low: { zh: '承傳與經典', en: 'Heritage & continuity' },
    high: { zh: '革新與突破', en: 'Innovation & rupture' },
  },
];

export const CHAPTERS: QuizChapter[] = [
  {
    id: 'ethics',
    phase: 1,
    title: { zh: '第一杯：日常道德', en: 'First round: everyday ethics' },
    subtitle: { zh: '深夜吧枱上，最常被問起的「應不應該」。', en: 'The should-I-shouldn’t-I questions that come up at the bar.' },
  },
  {
    id: 'knowledge',
    phase: 1,
    title: { zh: '第二杯：知識與真理', en: 'Second round: knowledge & truth' },
    subtitle: { zh: '你信眼見，定信推理？', en: 'Do you trust your eyes, or your arguments?' },
  },
  {
    id: 'freedom',
    phase: 1,
    title: { zh: '第三杯：自由與責任', en: 'Third round: freedom & responsibility' },
    subtitle: { zh: '選擇的重量，誰來承擔。', en: 'The weight of choice — and who carries it.' },
  },
  {
    id: 'others',
    phase: 1,
    title: { zh: '第四杯：他人與社群', en: 'Fourth round: others & community' },
    subtitle: { zh: '「我」以外，還有誰？', en: 'Beyond “me” — who else counts?' },
  },
  {
    id: 'meaning',
    phase: 2,
    title: { zh: '第五杯：荒謬與意義', en: 'Fifth round: absurdity & meaning' },
    subtitle: { zh: '若世界無答案，你仍如何過活？', en: 'If the world offers no answer, how do you still live?' },
  },
  {
    id: 'scenarios',
    phase: 3,
    title: { zh: '最後一輪：情境試題', en: 'Final round: scenario dilemmas' },
    subtitle: { zh: '想像力實驗——像思想實驗，但帶著人味。', en: 'Thought experiments with a human aftertaste.' },
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
