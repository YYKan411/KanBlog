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
        label: { zh: '當面直説，即使尷尬', en: 'Say it to their face, even if awkward' },
        weights: { ethics: -1, social: -0.5, stance: -1 },
      },
      {
        id: 'b',
        label: { zh: '先了解他為什麼這樣做，再決定説不説', en: 'Understand why first, then decide whether to speak' },
        weights: { epistemology: 1, stance: 1, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '沉默，避免破壞關係', en: 'Stay silent to preserve the relationship' },
        weights: { social: -1.5, tradition: -1, ethics: 0.5 },
      },
    ],
  },
  {
    id: 'q02',
    chapterId: 'ethics',
    phase: 1,
    prompt: {
      zh: '若一個謊言能避免許多人受傷，你會……',
      en: 'If one lie could spare many people pain, you would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '説謊——結果更重要', en: 'Lie — outcomes matter more' },
        weights: { ethics: 2, epistemology: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '不説——有些線不能跨', en: 'Not lie — some lines must not be crossed' },
        weights: { ethics: -2, stance: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '看對象是誰、傷有多深', en: 'It depends who is involved and how deep the harm' },
        weights: { epistemology: 1, social: -0.5 },
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
        label: { zh: '好——讓最多人過得去', en: 'Good — let the most people get through' },
        weights: { ethics: 2, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '很難分——要看情境', en: 'Hard to split — it depends on the situation' },
        weights: { stance: 0.5, epistemology: 1, social: 0.5 },
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
        label: { zh: '請別人幫忙，自己繼續', en: 'Find someone else while you continue' },
        weights: { ethics: 1, social: 0.5, stance: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '先完成計劃——你不是萬能', en: 'Finish your plan first — you are not omnipotent' },
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
      zh: '一本從未有人讀過的書，裏面會有真理嗎？',
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
        weights: { stance: 0.5, epistemology: 1.5, existence: 0.5 },
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
        label: { zh: '兩者對話，看哪邊解釋力更強', en: 'Let them dialogue — whichever explains better' },
        weights: { stance: 0.5, epistemology: 0.5, tradition: 0.5 },
      },
    ],
  },
  {
    id: 'q08',
    chapterId: 'knowledge',
    phase: 1,
    prompt: {
      zh: '「我確定我是對的」這種感覺，對你來説……',
      en: 'The feeling "I am sure I am right" is for you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '行動的燃料', en: 'Fuel for action' },
        weights: { stance: -2, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '需要警惕的信號', en: 'A signal to stay alert' },
        weights: { stance: 2, epistemology: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '看領域——醫學不同於詩歌', en: 'Domain-dependent — medicine differs from poetry' },
        weights: { epistemology: 1, stance: 0 },
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
        weights: { epistemology: 1, tradition: -1 },
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
        label: { zh: '追問——誰受益於這個觀點', en: 'Ask who benefits from the view' },
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
        weights: { epistemology: 1.5, existence: 1, stance: 0.5 },
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
        label: { zh: '很難——可能需要重新找意義', en: 'Hard — I would need to rebuild meaning' },
        weights: { existence: -1.5, epistemology: 0.5, tradition: -0.5 },
      },
    ],
  },
  {
    id: 'q13',
    chapterId: 'freedom',
    phase: 1,
    prompt: {
      zh: '後悔對你來説是……',
      en: 'Regret is for you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '成長的材料', en: 'Material for growth' },
        weights: { existence: 1, stance: 0.5, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '應儘量減少的東西', en: 'Something to minimise' },
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
      zh: '父母期望與你真實想要衝突時，你傾向……',
      en: 'When parental expectations clash with what you want, you tend to…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '跟隨自己', en: 'Follow yourself' },
        weights: { social: 2, tradition: 2 },
      },
      {
        id: 'b',
        label: { zh: '兼顧——關係也是自由的一部分', en: 'Balance — relationship is part of freedom' },
        weights: { social: -1, tradition: -1, ethics: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '延後——先看清自己到底要什麼', en: 'Defer — clarify what you really want' },
        weights: { stance: 0.5, existence: 0.5, epistemology: 0.5 },
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
        label: { zh: '相信——身份可以重寫', en: 'Believe it — identity can be rewritten' },
        weights: { social: 1.5, tradition: 2, existence: 1 },
      },
      {
        id: 'b',
        label: { zh: '半信——處境限制選項', en: 'Half believe — situation limits options' },
        weights: { epistemology: 1.5, social: -0.5, stance: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '不信——人活在具體歷史裏', en: 'Disbelieve — we live inside concrete history' },
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
      zh: '社羣規範與個人感受衝突時，你通常……',
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
        label: { zh: '公開討論規範是否該改', en: 'Debate openly whether norms should change' },
        weights: { tradition: 1.5, social: -0.5, stance: -0.5 },
      },
    ],
  },
  {
    id: 'q17',
    chapterId: 'others',
    phase: 1,
    prompt: {
      zh: '對陌生人的痛苦，你的第一反應是……',
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
        label: { zh: '分析原因與結構', en: 'Analyse causes and structures' },
        weights: { epistemology: 1.5, tradition: 1, ethics: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '保持距離——我不瞭解全部', en: 'Keep distance — I do not know enough' },
        weights: { stance: 0.5, existence: 1, social: 0.5 },
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
        label: { zh: '更廣泛的公共事務', en: 'Broader public concerns' },
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
      zh: '「中立」在衝突中可能嗎？',
      en: 'Is "neutrality" possible in conflict?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '可能——應保持', en: 'Possible — and worth keeping' },
        weights: { stance: 1, epistemology: -0.5, ethics: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '很難——沉默也有位置', en: 'Hard — silence also takes a side' },
        weights: { tradition: 1.5, social: -0.5, stance: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '看情況——有些衝突需要站隊', en: 'Depends — some conflicts demand taking sides' },
        weights: { stance: -1, ethics: -0.5, social: 0.5 },
      },
    ],
  },
  {
    id: 'q20',
    chapterId: 'others',
    phase: 1,
    prompt: {
      zh: '傳統儀式（節日、禮儀）對你來説是……',
      en: 'Traditional rituals (festivals, etiquette) are for you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '連結與意義的容器', en: 'Vessels of connection and meaning' },
        weights: { tradition: -2, social: -1.5, existence: -1 },
      },
      {
        id: 'b',
        label: { zh: '可以改造的慣例', en: 'Conventions that can be remade' },
        weights: { tradition: 1, social: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '常是空的表演', en: 'Often empty performance' },
        weights: { tradition: 2, existence: 1, social: 1 },
      },
    ],
  },

  // ── Chapter 5: meaning (6) — phase 2 grouping ──
  {
    id: 'q21',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '若宇宙沒有預設目的，你會……',
      en: 'If the universe has no preset purpose, you…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '仍然認真活——目的由行動定義', en: 'Still live seriously — purpose is defined by action' },
        weights: { existence: 2, stance: -0.5, social: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '尋找替代框架（信仰、社羣、藝術）', en: 'Seek alternative frames (faith, community, art)' },
        weights: { existence: -1.5, tradition: -1, social: -1 },
      },
      {
        id: 'c',
        label: { zh: '接受有限——不強迫終極答案', en: 'Accept finitude — stop forcing final answers' },
        weights: { existence: 1.5, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q22',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '重複的日常（上班、做飯、睡覺）對你來説是……',
      en: 'Repetitive daily life (work, cooking, sleep) is…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '需要超越的循環', en: 'A loop to transcend' },
        weights: { existence: -1, tradition: 1.5, social: 1 },
      },
      {
        id: 'b',
        label: { zh: '可以修煉的道場', en: 'A dojo for practice' },
        weights: { existence: -1, tradition: -1.5, social: -1 },
      },
      {
        id: 'c',
        label: { zh: '像推石頭——意義在推本身', en: 'Like pushing the stone — meaning is in the push' },
        weights: { existence: 2, stance: 0.5 },
      },
    ],
  },
  {
    id: 'q23',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '死亡念頭出現時，你通常……',
      en: 'When thoughts of death arise, you usually…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '更想把握當下', en: 'Want to seize the present' },
        weights: { existence: 1, social: 0.5, ethics: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '轉向更大的故事（家族、歷史、信仰）', en: 'Turn to larger stories (family, history, faith)' },
        weights: { existence: -1.5, tradition: -1.5, social: -1 },
      },
      {
        id: 'c',
        label: { zh: '與它並存——不著急解決', en: 'Live with it — no rush to resolve' },
        weights: { stance: 0.5, existence: 1, epistemology: 0.5 },
      },
    ],
  },
  {
    id: 'q24',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '你最能感到「活著」的時刻是……',
      en: 'You feel most alive when…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '與人真實相遇', en: 'Meeting someone truthfully' },
        weights: { social: -1.5, existence: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '獨自思考或創作', en: 'Thinking or creating alone' },
        weights: { social: 1.5, epistemology: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '行動改變一點什麼', en: 'Action that changes something' },
        weights: { stance: -1.5, tradition: 1, social: -0.5 },
      },
    ],
  },
  {
    id: 'q24b',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '若你的努力對「大局」幾乎無影響，你仍會……',
      en: 'If your efforts barely move "the big picture," you would still…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '繼續——小範圍也值得', en: 'Continue — small circles matter too' },
        weights: { existence: -1, social: -1, ethics: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '轉向更可改變的事', en: 'Shift to what can actually change' },
        weights: { ethics: 1, stance: -0.5, social: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '接受有限——不強求英雄敍事', en: 'Accept limits — no need for a hero story' },
        weights: { existence: 1.5, epistemology: 0.5 },
      },
    ],
  },
  {
    id: 'q24c',
    chapterId: 'meaning',
    phase: 2,
    prompt: {
      zh: '「活著有意義」對你來説，更接近……',
      en: '"A meaningful life" is closer for you to…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '與重要的人共度時光', en: 'Time with people who matter' },
        weights: { social: -1.5, existence: -1 },
      },
      {
        id: 'b',
        label: { zh: '完成一件你相信的事', en: 'Finishing something you believe in' },
        weights: { stance: -1, tradition: 1, existence: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '日常裏的微小清晰', en: 'Small clarity in daily life' },
        weights: { existence: 1, epistemology: 0.5, social: 0.5 },
      },
    ],
  },

  // ── Chapter 6: scenarios (8) — phase 3 ──
  {
    id: 'q25',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '多年好友做咗一件你認為傷害無辜者嘅事。揭發可能令佢名譽盡毀，沉默像你共犯。你會……',
      en: 'A long-time friend did something you believe harmed an innocent person. Exposing them could ruin their reputation; silence feels like complicity. You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '公開揭發', en: 'Expose it publicly' },
        weights: { ethics: -1, social: -1, stance: -1 },
      },
      {
        id: 'b',
        label: { zh: '先私下對質，再決定', en: 'Confront privately first, then decide' },
        weights: { social: -0.5, ethics: -0.5, tradition: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '先了解全貌——急於判斷或會傷錯人', en: 'Learn more first — rushing may harm the wrong person' },
        weights: { epistemology: 1.5, social: 0.5, existence: 0.5 },
      },
    ],
  },
  {
    id: 'q26',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '天橋上，胖子的體積可以擋住電車救五人。推嗎？',
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
        label: { zh: '先嚐試自己跳下去', en: 'Try jumping myself first' },
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
        label: { zh: '揭發', en: 'Expose it' },
        weights: { ethics: -1, stance: -1.5, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '沉默——還要養家', en: 'Stay silent — you still have dependants' },
        weights: { social: -1, ethics: 0.5, existence: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '匿名或找集體行動', en: 'Anonymously or act collectively' },
        weights: { social: -1.5, epistemology: 1, tradition: 0.5 },
      },
    ],
  },
  {
    id: 'q28',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '移民後，舊鄉朋友請你「站隊表態」。你會……',
      en: 'After emigrating, old friends ask you to "pick a side publicly." You would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '表態——沉默也是立場', en: 'Speak — silence is also a stance' },
        weights: { stance: -1, tradition: 1.5, social: -0.5 },
      },
      {
        id: 'b',
        label: { zh: '拒絕——距離改變了能説的話', en: 'Refuse — distance changes what can be said' },
        weights: { social: 1, stance: 1, existence: 0.5 },
      },
      {
        id: 'c',
        label: { zh: '私下談，不公開表演', en: 'Talk privately, not perform in public' },
        weights: { social: -1, tradition: -0.5 },
      },
    ],
  },
  {
    id: 'q29',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '聚會裏有人發表你強烈不同意的言論，但並未直接傷人。你會……',
      en: 'At a gathering someone voices views you reject strongly, but no one is directly harmed. You…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '當場反駁', en: 'Challenge them on the spot' },
        weights: { stance: -1.5, tradition: 1, social: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '聽——先理解他為什麼這樣想', en: 'Listen — understand why they think so' },
        weights: { stance: 1.5, epistemology: 1, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '離開——今晚不想打仗', en: 'Leave — not fighting tonight' },
        weights: { existence: 1, social: 1 },
      },
    ],
  },
  {
    id: 'q30',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '你只能救一個：陌生人小孩，或陪伴你一生的寵物。你會……',
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
        label: { zh: '救寵物——關係也是倫理', en: 'Save the pet — bonds are ethical too' },
        weights: { social: -1, epistemology: 1, ethics: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '拒絕選擇——問題本身殘忍', en: 'Refuse the choice — the question is cruel' },
        weights: { stance: 0.5, existence: 1, ethics: -0.5 },
      },
    ],
  },
  {
    id: 'q31',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '若知道十年後會後悔今天的決定，你仍會做嗎？',
      en: 'If you knew you would regret today\'s decision in ten years, would you still make it?',
    },
    options: [
      {
        id: 'a',
        label: { zh: '會——當下真實比未來後悔重要', en: 'Yes — present truth beats future regret' },
        weights: { existence: 1.5, social: 1, tradition: 1 },
      },
      {
        id: 'b',
        label: { zh: '不會——十年後的我也算我', en: 'No — my future self counts too' },
        weights: { ethics: -0.5, existence: -1, tradition: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '不知道——未來本不確定', en: 'Unclear — the future is uncertain anyway' },
        weights: { stance: 0.5, epistemology: 1.5 },
      },
    ],
  },
  {
    id: 'q32',
    chapterId: 'scenarios',
    phase: 3,
    prompt: {
      zh: '最後一題：若必須刪除一段記憶以換取更平靜的生活，你會……',
      en: 'Final question: if you must delete one memory for a calmer life, you would…',
    },
    options: [
      {
        id: 'a',
        label: { zh: '刪——痛苦不應定義我', en: 'Delete — pain should not define me' },
        weights: { existence: -1, social: 1, ethics: 0.5 },
      },
      {
        id: 'b',
        label: { zh: '不刪——記憶構成我是誰', en: 'Not delete — memory makes who I am' },
        weights: { existence: -1.5, tradition: -1, social: -0.5 },
      },
      {
        id: 'c',
        label: { zh: '看是哪段——有些痛值得留', en: 'Depends which — some pain is worth keeping' },
        weights: { stance: 0.5, epistemology: 1, existence: 0.5 },
      },
    ],
  },
];

export const QUESTION_MAP = new Map(QUESTIONS.map((q) => [q.id, q]));
