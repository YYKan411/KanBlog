import type { QuizQuestion } from '../types';

export const QUESTIONS: QuizQuestion[] = [
  // ── Chapter 1: ethics (5) ──
  {
    id: 'q01',
    chapterId: 'ethics',
    phase: 1,
    prompt: {
      zh: '朋友做了你認為不對的事。你會……',
      en: 'A friend does something you think is wrong. You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '當面直說，即使尷尬', en: 'Say it to their face, even if awkward' },
        weights: { ethics: -1, social: -0.5, stance: -1 },
      },
      {
        id: 'b',
        label: { zh: '先了解他為什麼這樣做，再決定说不说', en: 'Understand why first, then decide whether to speak' },
        weights: { epistemology: 1, stance: 1, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '沉默，避免破坏关系', en: 'Stay silent to preserve the relationship' },
        weights: { social: -1.5, tradition: -1, ethics: 0.5 },
      },
    ],
  },
  {
    id: 'q02',
    chapterId: 'ethics',
    phase: 1,
    prompt: {
      zh: '若一個謊言能避免许多人受伤，你會……',
      en: 'If one lie could spare many people pain, you would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '說謊——結果更重要', en: 'Lie — outcomes matter more' },
        weights: { ethics: 2, epistemology: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '不说——有些线不能跨', en: 'Not lie — some lines must not be crossed' },
        weights: { ethics: -2, stance: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '看对象是誰、伤有多深', en: 'It depends who is involved and how deep the harm' },
        weights: { epistemology: 1, social: -0.5, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q03',
    chapterId: 'ethics',
    phase: 1,
    prompt: {
      zh: '對你而言，「對」更重要還是「好」更重要？',
      en: 'For you, is "right" or "good" more important?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '對——即使結果不好', en: 'Right — even if the outcome is bad' },
        weights: { ethics: -2, existence: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '好——让最多人过得去', en: 'Good — let the most people get through' },
        weights: { ethics: 2, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '很难分——要看情境', en: 'Hard to split — it depends on the situation' },
        weights: { stance: 1.5, epistemology: 1 },
      },
    ],
  },
  {
    id: 'q04',
    chapterId: 'ethics',
    phase: 1,
    prompt: {
      zh: '陌生人急需幫助，但幫忙會耽誤你的重要計劃。你會……',
      en: 'A stranger urgently needs help, but helping will derail your important plans. You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '停下來幫', en: 'Stop and help' },
        weights: { ethics: -1, social: -1.5, existence: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '找別人代幫，自己继续', en: 'Find someone else while you continue' },
        weights: { ethics: 1, social: 0.5, stance: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '先完成计划——你不是万能', en: 'Finish your plan first — you are not omnipotent' },
        weights: { social: 1.5, ethics: 0.5, existence: 1 },
      },
    ],
  },
  {
    id: 'q05',
    chapterId: 'ethics',
    phase: 1,
    prompt: {
      zh: '若規則與良心衝突，你通常……',
      en: 'When rules clash with conscience, you usually…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '跟良心', en: 'Follow conscience' },
        weights: { ethics: -1, social: 1, tradition: 1.5 },
      },
      {
        id: 'b',
        label: { zh: '跟規則——秩序不能亂', en: 'Follow rules — order must hold' },
        weights: { tradition: -1.5, ethics: -1, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '公開質疑規則本身', en: 'Publicly question the rule itself' },
        weights: { tradition: 2, stance: -1, social: 0.5 },
      },
    ],
  },

  // ── Chapter 2: knowledge (5) ──
  {
    id: 'q06',
    chapterId: 'knowledge',
    phase: 1,
    prompt: {
      zh: '一本從未有人讀過的書，裡面會有真理嗎？',
      en: 'Can a book no one has ever read contain truth?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '會——真理不依賴被讀', en: 'Yes — truth does not depend on being read' },
        weights: { epistemology: -1.5, existence: -1 },
      },
      {
        id: 'b',
        label: { zh: '不太像——真理要在關係中才活', en: 'Unlikely — truth lives in relation' },
        weights: { epistemology: 1.5, social: -1 },
      },
      {
        id: 'c',
        label: { zh: '問題本身可能問錯了', en: 'The question itself may be wrong' },
        weights: { stance: 2, existence: 1 },
      },
    ],
  },
  {
    id: 'q07',
    chapterId: 'knowledge',
    phase: 1,
    prompt: {
      zh: '當專家與你的親身經驗矛盾，你會……',
      en: 'When experts contradict your lived experience, you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '信專家', en: 'Trust the experts' },
        weights: { epistemology: -1, tradition: -0.5, stance: -1 },
      },
      {
        id: 'b',
        label: { zh: '信自己', en: 'Trust yourself' },
        weights: { epistemology: 1.5, social: 1, tradition: 1 },
      },
      {
        id: 'c',
        label: { zh: '两者對話，看哪邊解釋力更強', en: 'Let them dialogue — whichever explains better' },
        weights: { stance: 1, epistemology: 0.5, tradition: 0.5 },
      },
    ],
  },
  {
    id: 'q08',
    chapterId: 'knowledge',
    phase: 1,
    prompt: {
      zh: '「我確定我是對的」這種感覺，對你來說……',
      en: 'The feeling "I am sure I am right" is for you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '行动的燃料', en: 'Fuel for action' },
        weights: { stance: -2, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '需要警惕的信号', en: 'A signal to stay alert' },
        weights: { stance: 2, epistemology: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '看领域——医学不同于诗歌', en: 'Domain-dependent — medicine differs from poetry' },
        weights: { epistemology: 1, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q09',
    chapterId: 'knowledge',
    phase: 1,
    prompt: {
      zh: '你更相信……',
      en: 'You trust more in…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '邏輯推導', en: 'Logical inference' },
        weights: { epistemology: -2, ethics: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '身體與現場', en: 'The body and the scene itself' },
        weights: { epistemology: 2, social: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '長時間的實踐與修正', en: 'Long practice and revision' },
        weights: { epistemology: 1, tradition: -1, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q10',
    chapterId: 'knowledge',
    phase: 1,
    prompt: {
      zh: '若一個觀點令你不舒服，但論據很強，你會……',
      en: 'If a view makes you uncomfortable but the argument is strong, you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '接受——真理比舒服重要', en: 'Accept — truth beats comfort' },
        weights: { stance: -1.5, epistemology: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '暫停——情緒也是資訊', en: 'Pause — emotion is information too' },
        weights: { epistemology: 1, social: -0.5, stance: 1 },
      },
      {
        id: 'c',
        label: { zh: '追問——谁受益於這個觀點', en: 'Ask who benefits from the view' },
        weights: { tradition: 1.5, epistemology: 1, social: -0.5 },
      },
    ],
  },

  // ── Chapter 3: freedom (5) ──
  {
    id: 'q11',
    chapterId: 'freedom',
    phase: 1,
    prompt: {
      zh: '人生重大選擇，你覺得主要是……',
      en: 'Major life choices are mainly…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '個人自由', en: 'Personal freedom' },
        weights: { social: 2, tradition: 1.5 },
      },
      {
        id: 'b',
        label: { zh: '對他人的責任', en: 'Responsibility to others' },
        weights: { social: -2, ethics: -1 },
      },
      {
        id: 'c',
        label: { zh: '結構與運氣的產物', en: 'Products of structure and luck' },
        weights: { epistemology: 1.5, existence: 1, stance: 1 },
      },
    ],
  },
  {
    id: 'q12',
    chapterId: 'freedom',
    phase: 1,
    prompt: {
      zh: '若明知選擇無「終極意義」，你仍會認真選嗎？',
      en: 'If you knew choices had no ultimate meaning, would you still choose seriously?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '會——選本身就是回答', en: 'Yes — choosing is the answer' },
        weights: { existence: 2, social: 1 },
      },
      {
        id: 'b',
        label: { zh: '會——為了他者與日常', en: 'Yes — for others and daily life' },
        weights: { existence: -1, social: -1.5 },
      },
      {
        id: 'c',
        label: { zh: '很难——可能需要重新找意义', en: 'Hard — I would need to rebuild meaning' },
        weights: { existence: -1.5, stance: 1, tradition: -0.5 },
      },
    ],
  },
  {
    id: 'q13',
    chapterId: 'freedom',
    phase: 1,
    prompt: {
      zh: '後悔對你來說是……',
      en: 'Regret is for you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '成长的材料', en: 'Material for growth' },
        weights: { existence: 1, stance: 0.5, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '应尽量减少的东西', en: 'Something to minimise' },
        weights: { ethics: 1, stance: -1 },
      },
      {
        id: 'c',
        label: { zh: '提醒我曾經真實地活過', en: 'Proof I once lived fully' },
        weights: { existence: 0.5, social: 0.5, epistemology: 0.5 },
      },
    ],
  },
  {
    id: 'q14',
    chapterId: 'freedom',
    phase: 1,
    prompt: {
      zh: '父母期望与你真实想要冲突时，你倾向……',
      en: 'When parental expectations clash with what you want, you tend to…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '跟随自己', en: 'Follow yourself' },
        weights: { social: 2, tradition: 2 },
      },
      {
        id: 'b',
        label: { zh: '兼顾——关系也是自由的一部分', en: 'Balance — relationship is part of freedom' },
        weights: { social: -1, tradition: -1, ethics: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '延后——先看清自己到底要什么', en: 'Defer — clarify what you really want' },
        weights: { stance: 1.5, existence: 0.5 },
      },
    ],
  },
  {
    id: 'q15',
    chapterId: 'freedom',
    phase: 1,
    prompt: {
      zh: '「你可以成為任何人」這句話，你……',
      en: '"You can become anyone" — you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '相信——身份可以重写', en: 'Believe it — identity can be rewritten' },
        weights: { social: 1.5, tradition: 2, existence: 1 },
      },
      {
        id: 'b',
        label: { zh: '半信——处境限制选项', en: 'Half believe — situation limits options' },
        weights: { epistemology: 1.5, social: -0.5, stance: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '不信——人活在具体历史里', en: 'Disbelieve — we live inside concrete history' },
        weights: { tradition: 0.5, social: -1, existence: -0.5 },
      },
    ],
  },

  // ── Chapter 4: others (5) ──
  {
    id: 'q16',
    chapterId: 'others',
    phase: 1,
    prompt: {
      zh: '社群規範與個人感受衝突時，你通常……',
      en: 'When community norms clash with personal feeling, you usually…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '尊重規範', en: 'Respect the norms' },
        weights: { social: -2, tradition: -2 },
      },
      {
        id: 'b',
        label: { zh: '尊重感受', en: 'Respect the feeling' },
        weights: { social: 1.5, existence: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '公开讨论规范是否该改', en: 'Debate openly whether norms should change' },
        weights: { tradition: 1.5, social: -0.5, stance: -0.5 },
      },
    ],
  },
  {
    id: 'q17',
    chapterId: 'others',
    phase: 1,
    prompt: {
      zh: '對陌生人的痛苦，你的第一反应是……',
      en: 'Your first response to a stranger\'s suffering is…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '感同身受', en: 'Empathic resonance' },
        weights: { social: -1.5, ethics: -0.5, existence: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '分析原因与结构', en: 'Analyse causes and structures' },
        weights: { epistemology: 1.5, tradition: 1, ethics: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '保持距离——我不了解全部', en: 'Keep distance — I do not know enough' },
        weights: { stance: 1.5, existence: 1 },
      },
    ],
  },
  {
    id: 'q18',
    chapterId: 'others',
    phase: 1,
    prompt: {
      zh: '你更願意把時間給……',
      en: 'You would rather give time to…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '少數深交的人', en: 'A few close people' },
        weights: { social: -1, ethics: -0.5, tradition: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '更广泛的公共事务', en: 'Broader public concerns' },
        weights: { social: -1.5, tradition: 0.5, stance: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '自己——先把自己活清楚', en: 'Yourself — get your own life clear first' },
        weights: { social: 2, existence: 1 },
      },
    ],
  },
  {
    id: 'q19',
    chapterId: 'others',
    phase: 1,
    prompt: {
      zh: '「中立」在冲突中可能吗？',
      en: 'Is "neutrality" possible in conflict?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '可能——应保持', en: 'Possible — and worth keeping' },
        weights: { stance: 1, epistemology: -0.5, ethics: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '很难——沉默也有位置', en: 'Hard — silence also takes a side' },
        weights: { tradition: 1.5, social: -0.5, stance: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '看情况——有些冲突需要站队', en: 'Depends — some conflicts demand taking sides' },
        weights: { stance: -1, ethics: -0.5, social: 0.5 },
      },
    ],
  },
  {
    id: 'q20',
    chapterId: 'others',
    phase: 1,
    prompt: {
      zh: '传统仪式（节日、礼仪）对你来说是……',
      en: 'Traditional rituals (festivals, etiquette) are for you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '连结与意义的容器', en: 'Vessels of connection and meaning' },
        weights: { tradition: -2, social: -1.5, existence: -1 },
      },
      {
        id: 'b',
        label: { zh: '可以改造的惯例', en: 'Conventions that can be remade' },
        weights: { tradition: 1, social: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '常是空的表演', en: 'Often empty performance' },
        weights: { tradition: 2, existence: 1, social: 1 },
      },
    ],
  },

  // ── Chapter 5: meaning (4) — phase 2 grouping ──
  {
    id: 'q21',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '若宇宙没有预设目的，你會……',
      en: 'If the universe has no preset purpose, you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '仍然认真活——目的由行动定义', en: 'Still live seriously — purpose is defined by action' },
        weights: { existence: 2, stance: -0.5, social: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '寻找替代框架（信仰、社群、艺术）', en: 'Seek alternative frames (faith, community, art)' },
        weights: { existence: -1.5, tradition: -1, social: -1 },
      },
      {
        id: 'c',
        label: { zh: '接受有限——不强迫终极答案', en: 'Accept finitude — stop forcing final answers' },
        weights: { existence: 1.5, stance: 1.5 },
      },
    ],
  },
  {
    id: 'q22',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '重复的日常（上班、做饭、睡觉）对你来说是……',
      en: 'Repetitive daily life (work, cooking, sleep) is…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '需要超越的循环', en: 'A loop to transcend' },
        weights: { existence: -1, tradition: 1.5, social: 1 },
      },
      {
        id: 'b',
        label: { zh: '可以修炼的道场', en: 'A dojo for practice' },
        weights: { existence: -1, tradition: -1.5, social: -1 },
      },
      {
        id: 'c',
        label: { zh: '像推石头——意义在推本身', en: 'Like pushing the stone — meaning is in the push' },
        weights: { existence: 2, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q23',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '死亡念头出现时，你通常……',
      en: 'When thoughts of death arise, you usually…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '更想把握当下', en: 'Want to seize the present' },
        weights: { existence: 1, social: 0.5, ethics: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '转向更大的故事（家族、历史、信仰）', en: 'Turn to larger stories (family, history, faith)' },
        weights: { existence: -1.5, tradition: -1.5, social: -1 },
      },
      {
        id: 'c',
        label: { zh: '与它并存——不急着解决', en: 'Live with it — no rush to resolve' },
        weights: { stance: 1.5, existence: 1, epistemology: 0.5 },
      },
    ],
  },
  {
    id: 'q24',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '你最能感到「活着」的时刻是……',
      en: 'You feel most alive when…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '与人真实相遇', en: 'Meeting someone truthfully' },
        weights: { social: -1.5, existence: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '独自思考或创作', en: 'Thinking or creating alone' },
        weights: { social: 1.5, epistemology: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '行动改变一点什么', en: 'Action that changes something' },
        weights: { stance: -1.5, tradition: 1, social: -0.5 },
      },
    ],
  },

  // ── Chapter 6: scenarios (8) — phase 3 ──
  {
    id: 'q25',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '電車失控。你可以拉桿，改道撞死一人，救五人。你會……',
      en: 'A runaway trolley. You can pull a lever to kill one and save five. You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '拉桿', en: 'Pull the lever' },
        weights: { ethics: 2, stance: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '不拉——不能主动杀人', en: 'Not pull — must not actively kill' },
        weights: { ethics: -2, stance: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '無法決定——這不是我的位置', en: 'Cannot decide — not my place' },
        weights: { stance: 1.5, existence: 1, social: 0.5 },
      },
    ],
  },
  {
    id: 'q26',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '天橋上，胖子的体积可以挡住电车救五人。推吗？',
      en: 'On a footbridge, a large stranger\'s body could stop the trolley and save five. Push?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '推', en: 'Push' },
        weights: { ethics: 2, social: 1, stance: -1 },
      },
      {
        id: 'b',
        label: { zh: '不推——這不同於拉桿', en: 'Not push — this is not like the lever' },
        weights: { ethics: -2, epistemology: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '先尝试自己跳下去', en: 'Try jumping myself first' },
        weights: { ethics: -1, social: -1, existence: 1 },
      },
    ],
  },
  {
    id: 'q27',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '你掌握證據可以揭發上司不公，但會失去工作。你會……',
      en: 'You have evidence to expose an unfair boss, but you will lose your job. You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '揭发', en: 'Expose it' },
        weights: { ethics: -1, stance: -1.5, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '沉默——还要养家', en: 'Stay silent — you still have dependants' },
        weights: { social: -1, ethics: 0.5, existence: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '匿名或找集体行动', en: 'Anonymously or act collectively' },
        weights: { social: -1.5, epistemology: 1, tradition: 0.5 },
      },
    ],
  },
  {
    id: 'q28',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '移民後，旧乡朋友请你「站队表态」。你會……',
      en: 'After emigrating, old friends ask you to "pick a side publicly." You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '表态——沉默也是立场', en: 'Speak — silence is also a stance' },
        weights: { stance: -1, tradition: 1.5, social: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '拒绝——距离改变了能说的话', en: 'Refuse — distance changes what can be said' },
        weights: { social: 1, stance: 1, existence: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '私下谈，不公开表演', en: 'Talk privately, not perform in public' },
        weights: { social: -1, tradition: -0.5, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q29',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '酒吧里有人发表你强烈不同意的言论，但并未直接伤人。你會……',
      en: 'At the bar someone voices views you reject strongly, but no one is directly harmed. You…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '当场反驳', en: 'Challenge them on the spot' },
        weights: { stance: -1.5, tradition: 1, social: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '聽——先理解他為什麼這樣想', en: 'Listen — understand why they think so' },
        weights: { stance: 1.5, epistemology: 1, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '离开——今晚不想打仗', en: 'Leave — not fighting tonight' },
        weights: { existence: 1, social: 1, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q30',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '你只能救一个：陌生人小孩，或陪伴你一生的宠物。你會……',
      en: 'You can save only one: a stranger\'s child, or the pet who shared your life. You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '救小孩', en: 'Save the child' },
        weights: { ethics: 1.5, social: -1 },
      },
      {
        id: 'b',
        label: { zh: '救宠物——关系也是伦理', en: 'Save the pet — bonds are ethical too' },
        weights: { social: -1, epistemology: 1, ethics: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '拒绝选择——问题本身残忍', en: 'Refuse the choice — the question is cruel' },
        weights: { stance: 1.5, existence: 1, ethics: -0.5 },
      },
    ],
  },
  {
    id: 'q31',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '若知道十年後會後悔今天的決定，你仍會做吗？',
      en: 'If you knew you would regret today\'s decision in ten years, would you still make it?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '会——当下真实比未来后悔重要', en: 'Yes — present truth beats future regret' },
        weights: { existence: 1.5, social: 1, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '不会——十年后的我也算我', en: 'No — my future self counts too' },
        weights: { ethics: -0.5, existence: -1, tradition: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '不知道——未来本不确定', en: 'Unclear — the future is uncertain anyway' },
        weights: { stance: 2, epistemology: 1 },
      },
    ],
  },
  {
    id: 'q32',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '最後一題：若必须删除一段记忆以换取更平静的生活，你會……',
      en: 'Final question: if you must delete one memory for a calmer life, you would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '删——痛苦不应定义我', en: 'Delete — pain should not define me' },
        weights: { existence: -1, social: 1, ethics: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '不删——记忆构成我是谁', en: 'Not delete — memory makes who I am' },
        weights: { existence: -1.5, tradition: -1, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '看是哪段——有些痛值得留', en: 'Depends which — some pain is worth keeping' },
        weights: { stance: 1, epistemology: 1, existence: 0.5 },
      },
    ],
  },
];

export const QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));
