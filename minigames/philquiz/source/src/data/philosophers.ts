import type { Philosopher } from '../types';

export const PHILOSOPHERS: Philosopher[] = [
  {
    id: 'camus',
    name: { zh: '阿爾貝·卡繆', en: 'Albert Camus' },
    epithet: { zh: '荒謬中的反抗者', en: 'The rebel in the absurd' },
    era: { zh: '1913–1960', en: '1913–1960' },
    region: { zh: '阿爾及利亞／法國', en: 'Algeria / France' },
    centroid: { ethics: 0.05, epistemology: 0.55, existence: 1.85, social: 1.2, stance: 1.05, tradition: 0.8 },
    barQuote: {
      zh: '「必須想像西西弗斯是快樂的。」——不是因為有希望，而是因為推石頭本身已是回答。',
      en: '"One must imagine Sisyphus happy." — not because there is hope, but because the pushing itself is the answer.',
    },
    biography: [
      {
        zh: '卡繆生於法屬阿爾及利亞的貧困社區，在地中海的陽光與貧苦之間長大。他早年以記者身份報導社會不公，後來以《異鄉人》《鼠疫》《西西弗的神話》等作品成為二十世紀最重要的作家—思想家之一，並於 1957 年獲得諾貝爾文學獎。',
        en: 'Camus was born into poverty in French Algeria and grew up between Mediterranean sunlight and hardship. He began as a journalist covering injustice, then became one of the twentieth century\'s defining writer-thinkers through works such as *The Stranger*, *The Plague*, and *The Myth of Sisyphus*, winning the Nobel Prize in Literature in 1957.',
      },
      {
        zh: '他拒絕被簡單歸入「存在主義」，也拒絕任何以未來烏托邦之名正當化當下之惡的做法。對他而言，世界並不欠我們意義；但在這個前提下，人仍可以選擇如何活——以清醒、以團結、以拒絕謊言。',
        en: 'He resisted being filed under "existentialism" and rejected any doctrine that justified present evil in the name of a future utopia. For him the world owes us no meaning — yet we may still choose how to live: lucidly, in solidarity, and without lies.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你的答案顯示：你不太相信「歷史終會給出完美解釋」。當制度、意義或宏大敍事失效時，你寧願誠實面對荒謬，也不願用漂亮話語麻醉自己。這很接近卡繆——不是悲觀，而是拒絕自欺。',
        en: 'Your answers suggest you don\'t really trust that history will eventually hand down a perfect explanation. When institutions, meaning, or grand narratives fail, you\'d rather face the absurd honestly than anaesthetise yourself with fine words. That is very close to Camus — not pessimism, but a refusal of self-deception.',
      },
      {
        zh: '你也傾向在具體處境中做決定：救誰、説什麼真話、今天如何過——而不是等待一套終極理論。卡繆式的自由，是在太陽底下推石頭，仍然選擇站直。',
        en: 'You also lean toward deciding in concrete situations — whom to help, which truth to speak, how to get through today — rather than waiting for a final theory. Camus-style freedom is standing upright while pushing the stone in full sunlight.',
      },
    ],
    blindSpots: [
      {
        zh: '卡繆對「形上學式慰藉」的警惕，有時會變成對一切超越性語言的過度懷疑；並非每個尋找意義的人，都是在逃避。',
        en: 'Camus\'s suspicion of metaphysical consolation can harden into distrust of all transcendent language; not everyone searching for meaning is simply evading reality.',
      },
      {
        zh: '他的反抗倫理強調個人清醒，卻未必充分處理結構性壓迫如何限制「選擇」本身——這一點，後來不少解殖與女性主義思想都有補充。',
        en: 'His ethics of revolt stresses lucid individual choice, yet may underplay how structural oppression limits choice itself — a gap later filled by decolonial and feminist thought, among others.',
      },
    ],
    relatedIds: ['beauvoir', 'zhuangzi', 'nietzsche'],
    blogLinks: [{ slug: 'sisyphus', title: { zh: '西西弗斯', en: 'Sisyphus' } }],
  },
  {
    id: 'confucius',
    name: { zh: '孔子', en: 'Confucius' },
    epithet: { zh: '在關係中成為君子', en: 'Becoming exemplary in relation' },
    era: { zh: '公元前 551–479', en: '551–479 BCE' },
    region: { zh: '春秋時代魯國', en: 'Lu, Spring and Autumn China' },
    centroid: { ethics: -1.35, epistemology: -0.9, existence: -1.8, social: -1.6, stance: -0.4, tradition: -1.7 },
    barQuote: {
      zh: '「己所不欲，勿施於人。」——聽似簡單，但要在一輩子的關係裏做到，並不簡單。',
      en: '"Do not impose on others what you yourself do not desire." — it sounds simple; to live it out across a lifetime of relationships is not.',
    },
    biography: [
      {
        zh: '孔子名丘，字仲尼，生於魯國陬邑。他早年從政，後周遊列國，試圖以禮樂與德治匡扶亂世，卻屢屢碰壁。晚年返魯，整理經典、教導弟子，其言論由門人編纂為《論語》。',
        en: 'Confucius, Kong Qiu styled Zhongni, was born in Zou in the state of Lu. He served in office, then travelled among the states hoping to restore order through ritual and moral governance, meeting repeated frustration. In old age he returned to Lu, edited classics, and taught disciples whose records became the *Analects*.',
      },
      {
        zh: '他關心的不是抽象命題，而是人如何成為「君子」：在父子、君臣、朋友之間，學會適度、誠實與分寸。對他而言，倫理不在雲端，而在你今日如何對待一個具體的人。',
        en: 'He cared less about abstract propositions than about how one becomes *junzi* — exemplary — in the bonds between parent and child, ruler and subject, friend and friend: proportion, sincerity, tact. Ethics, for him, is not in the clouds but in how you treat a concrete person today.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你多次把「關係」「責任」「分寸」放在個人衝動之前。這並非缺乏原則，而是相信：人之所以為人，是在與他人共處中修煉出來的。',
        en: 'You repeatedly put relationship, responsibility, and proportion ahead of private impulse. That is not a lack of principle — it is the conviction that we become human by living well with others.',
      },
      {
        zh: '你也尊重傳統與經典，不是盲目復古，而是把前人積累視為可對話的資源——這很接近孔子「述而不作，信而好古」的態度。',
        en: 'You also respect tradition and classics — not as blind revival, but as accumulated resources for dialogue. That echoes Confucius: "I transmit rather than innovate; I trust in and love antiquity."',
      },
    ],
    blindSpots: [
      {
        zh: '以「和諧」為最高價值時，可能壓制對不公的直言，尤其當權力結構本身需要被質疑。',
        en: 'When harmony is the supreme value, frank protest against injustice can be suppressed — especially when power itself needs questioning.',
      },
      {
        zh: '其倫理常假設相對穩定的社會角色；在高度流動、個人選擇多元的現代，需要重新詮釋，而非直接套用。',
        en: 'Its ethics often assume relatively stable social roles; in a mobile, plural modern life, it must be reinterpreted rather than pasted on wholesale.',
      },
    ],
    relatedIds: ['wang-yangming', 'gandhi', 'ibn-rushd'],
    blogLinks: [{ slug: 'bao-faan', title: { zh: '飽飯', en: 'A Profound Satiety' } }],
  },
  {
    id: 'kant',
    name: { zh: '伊曼努爾·康德', en: 'Immanuel Kant' },
    epithet: { zh: '義務的守夜人', en: 'Guardian of duty' },
    era: { zh: '1724–1804', en: '1724–1804' },
    region: { zh: 'Königsberg（今加里寧格勒）／普魯士', en: 'Königsberg / Prussia' },
    centroid: { ethics: -1.75, epistemology: -1.6, existence: -1.65, social: -0.45, stance: -0.95, tradition: -1.15 },
    barQuote: {
      zh: '「兩件事物我愈是思考愈覺神奇，心中充滿敬畏：我頭上的星空與我心中的道德律。」',
      en: '"Two things fill the mind with ever new and increasing admiration and awe: the starry heavens above me and the moral law within me."',
    },
    biography: [
      {
        zh: '康德一生幾乎未離開故鄉 Königsberg，以規律聞名：下午三時散步，鄰里據此校時。他在批判哲學中重新界定理性、知識與道德的邊界，寫下《純粹理性批判》《實踐理性批判》等著作，深刻影響後世。',
        en: 'Kant scarcely left his native Königsberg, famed for his routine — the afternoon walk at three o\'clock by which neighbours set their clocks. In his critical philosophy he redrew the limits of reason, knowledge, and morality in works such as the *Critique of Pure Reason* and *Critique of Practical Reason*, shaping generations to come.',
      },
      {
        zh: '在倫理上，他提出「定言命令」：只按照你能同時願它成為普遍法則的準則而行。人永遠不可僅僅被當作手段，而必須同時被視為目的。',
        en: 'In ethics he formulated the categorical imperative: act only on maxims you could will as universal law. Humanity must never be treated merely as a means, but always also as an end.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你在若干情境中寧可承擔個人代價，也不願跨過某些底線——即使這樣做「對整體更有利」。這顯示你把人本身視為不可被計算掉的一票。',
        en: 'In several scenarios you would accept personal cost rather than cross certain lines — even when the alternative seems "better for the whole." You treat persons as never simply expendable in the arithmetic.',
      },
      {
        zh: '你也相信原則應該普遍化：若某行為只允許自己做、不容他人做，便難以正當化。這正是康德式道德推理的核心直覺。',
        en: 'You also believe principles should universalise: if an act is permissible for you but not for others, it is hard to justify. That is the core intuition of Kantian moral reasoning.',
      },
    ],
    blindSpots: [
      {
        zh: '過度強調普遍法則，可能忽略具體處境、情感與關係中的特殊責任。',
        en: 'An overemphasis on universal law can overlook situated context, emotion, and special obligations within relationships.',
      },
      {
        zh: '康德對「理性」的界定，長期被批評為帶有歐洲中心與男性中心的假設；其政治實踐亦未完全兌現其道德理想。',
        en: 'Kant\'s conception of "reason" has been criticised as Eurocentric and androcentric; his political practice did not fully live up to his moral ideals.',
      },
    ],
    relatedIds: ['mill', 'arendt', 'wang-yangming'],
    blogLinks: [{ slug: 'footbridge-paradox', title: { zh: '橋上悖論', en: 'Paradox over the Footbridge' } }],
  },
  {
    id: 'zhuangzi',
    name: { zh: '莊子', en: 'Zhuangzi' },
    epithet: { zh: '蝶夢與逍遙', en: 'Butterfly dreams & easy wandering' },
    era: { zh: '約公元前 4 世紀', en: 'c. 4th century BCE' },
    region: { zh: '戰國時代宋國', en: 'Song, Warring States China' },
    centroid: { ethics: 0.45, epistemology: 0.8, existence: 1.65, social: 1.2, stance: 1.55, tradition: 0.35 },
    barQuote: {
      zh: '「昔者莊周夢為胡蝶，栩栩然胡蝶也……不知周之夢為胡蝶與？胡蝶之夢為周與？」',
      en: '"Once Zhuang Zhou dreamt he was a butterfly, fluttering about as a butterfly would… Did Zhou dream the butterfly, or the butterfly dream Zhou?"',
    },
    biography: [
      {
        zh: '《莊子》一書相傳多為莊周及其後學所撰，以寓言、反諷、荒誕想像著稱。他拒絕把人生窄化為單一標準，質疑名教、功利與對「正確答案」的執著。',
        en: 'The *Zhuangzi* is attributed mainly to Zhuang Zhou and later followers, famed for parable, irony, and extravagant imagination. He resisted narrowing life to a single standard, questioning moral labels, utility, and the obsession with the "right answer."',
      },
      {
        zh: '他並非單純「躺平」，而是追問：誰的視角在定義成敗？能否在變化中保持精神的自由？「逍遙」不是逃避，而是不被外物完全綁架。',
        en: 'He was not simply "opting out." He asked whose perspective defines success and failure, and whether the spirit can stay free amid change. *Xiaoyao* — easy wandering — is not escape but refusing to be wholly owned by externals.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你對「唯一正解」保持懷疑，願意從不同角度重新描述同一問題。這種鬆動感，很像莊子對名相的戲謔。',
        en: 'You stay suspicious of the one correct answer and will redescribe the same problem from another angle. That looseness resembles Zhuangzi\'s play with names and categories.',
      },
      {
        zh: '當他人急於判斷時，你傾向保留餘地——不是優柔寡斷，而是看見視角本身的侷限。蝶與周，未必需要立刻分個勝負。',
        en: 'When others rush to judge, you tend to hold space — not indecision, but awareness of perspective\'s limits. Butterfly and Zhou need not be settled tonight.',
      },
    ],
    blindSpots: [
      {
        zh: '過度相對化，可能削弱對具體苦難的承擔——並非所有處境都只需「換個角度看」。',
        en: 'Too much perspectival play can weaken response to real suffering — not every situation is solved by a change of view.',
      },
      {
        zh: '逍遙理想若脫離社會責任，容易被誤讀為對不公的冷感；莊子本人對權力仍有尖銳批判，但文本開放性高，易被各取所需。',
        en: 'If *xiaoyao* detaches from social responsibility it can read as indifference to injustice; Zhuangzi did skewer power, yet the text\'s openness invites selective reading.',
      },
    ],
    relatedIds: ['laozi', 'socrates', 'camus'],
    blogLinks: [{ slug: 'the-cat-teachers', title: { zh: '貓老師', en: 'The Cat Teachers' } }],
  },
  {
    id: 'beauvoir',
    name: { zh: '西蒙·德·波娃', en: 'Simone de Beauvoir' },
    epithet: { zh: '處境中的自由', en: 'Freedom in situation' },
    era: { zh: '1908–1986', en: '1908–1986' },
    region: { zh: '法國', en: 'France' },
    centroid: { ethics: 0.05, epistemology: 0.75, existence: 1.2, social: 1.4, stance: -0.15, tradition: 1.4 },
    barQuote: {
      zh: '「人並非生而為女，而是變成女人。」——存在先於本質，也先於被指派的角色。',
      en: '"One is not born, but rather becomes, woman." — existence precedes essence, and assigned roles too.',
    },
    biography: [
      {
        zh: '波娃是二十世紀最重要的存在主義哲學家與作家之一，以《第二性》系統分析女性如何被建構為「他者」，並以小説、回憶錄持續書寫自由、愛與政治。',
        en: 'Beauvoir was among the twentieth century\'s foremost existential philosophers and writers. *The Second Sex* analysed how woman is constructed as Other; her novels and memoirs continued to trace freedom, love, and politics.',
      },
      {
        zh: '她強調：自由不是真空中的選擇，而是在具體處境、身體、階級與性別中實踐。真正的倫理，要問誰的選擇被看見，誰的選擇從一開始就被剝奪。',
        en: 'She insisted freedom is not choice in a vacuum but practice within situation — body, class, gender. Real ethics asks whose choices are visible and whose are denied from the start.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你重視個人自主，同時看見身份、處境如何形塑選項。你不把「選或不選」簡化為意志薄弱，而會追問：選項是誰安排的？',
        en: 'You value autonomy yet see how identity and situation shape the menu. You don\'t reduce "choosing or not" to weak will — you ask who arranged the options.',
      },
      {
        zh: '你也傾向打破被派定的角色——無論是性別、移民、或「應該怎樣活」的社會劇本。這很接近波娃對「變成」的強調。',
        en: 'You also resist assigned roles — gender, migration, social scripts for how one ought to live. That aligns with Beauvoir\'s stress on *becoming*.',
      },
    ],
    blindSpots: [
      {
        zh: '早期存在主義框架對殖民、種族等議題著墨有限；後人批評其視野仍有歐洲中心痕跡。',
        en: 'Early existential frames gave limited room to colonial and racial questions; critics note Eurocentric residues in her horizon.',
      },
      {
        zh: '過度強調個人覺醒與選擇，可能低估結構壓力需要集體行動，而非僅靠個人「成為自己」。',
        en: 'Overstressing personal awakening can underplay structural injustice that demands collective action, not only individual self-becoming.',
      },
    ],
    relatedIds: ['fanon', 'du-bois', 'camus'],
    blogLinks: [{ slug: 'footbridge-paradox', title: { zh: '橋上悖論', en: 'Paradox over the Footbridge' } }],
  },
  {
    id: 'buddha',
    name: { zh: '釋迦牟尼', en: 'The Buddha' },
    epithet: { zh: '中道與止苦', en: 'Middle way & the end of suffering' },
    era: { zh: '約公元前 5 世紀', en: 'c. 5th century BCE' },
    region: { zh: '古印度', en: 'Ancient India' },
    centroid: { ethics: -0.85, epistemology: 1.05, existence: -1.45, social: -1.35, stance: 0.8, tradition: -0.7 },
    barQuote: {
      zh: '「諸行無常，諸法無我。」——不是虛無，而是邀請你看清執著如何製造苦。',
      en: '"All conditioned things are impermanent; all phenomena are not-self." — not nihilism, but an invitation to see how clinging manufactures suffering.',
      },
    biography: [
      {
        zh: '釋迦牟尼原為迦毗羅衞國王子，見老、病、死、出家修行者後，離宮求道。經多年極端苦修與反思，於菩提樹下證悟，此後四十五年教導中道：不陷縱欲，也不陷自我折磨。',
        en: 'Born a prince of Kapilavastu, he left palace life after encountering old age, sickness, death, and a renunciant. After years of extreme asceticism and reflection he awakened beneath the Bodhi tree, then for forty-five years taught a middle way between indulgence and self-torture.',
      },
      {
        zh: '其核心關切是苦及其止息：透過正念、智慧與慈悲，看清無常與無我，鬆開對「我必須如何被看見」的執著。這既是哲學，也是可修習的生活技藝。',
        en: 'His central concern was suffering and its cessation: through mindfulness, wisdom, and compassion, seeing impermanence and non-self, loosening the grip of "how I must be seen." It is philosophy and a practicable art of living.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你在答案中常尋求「不極端」：既不盲目樂觀，也不陷入虛無；願意看見執著如何放大痛苦——這很接近佛教心理學式的洞察。',
        en: 'Your answers often seek a non-extreme path — neither blind optimism nor nihilism; you notice how clinging amplifies pain. That echoes the Buddhist psychological insight.',
      },
      {
        zh: '你也把關懷他人、減少傷害視為倫理核心，而非單純個人勝利。慈悲在此不是口號，而是可訓練的取向。',
        en: 'You treat care for others and harm reduction as ethical core, not personal victory alone. Compassion here is trainable orientation, not a slogan.',
      },
    ],
    blindSpots: [
      {
        zh: '「放下執著」若被誤讀，可能變成對社會不公的順從，或要求受害者「看開」。',
        en: '"Letting go" misread can become compliance with injustice, or telling victims to accept what should be changed.',
      },
      {
        zh: '不同佛教傳統對政治、性、身體的態度差異極大；以「佛陀」為單一標籤，難免簡化千年演變。',
        en: 'Buddhist traditions diverge sharply on politics, sexuality, and the body; labelling you "the Buddha type" simplifies millennia of variation.',
      },
    ],
    relatedIds: ['laozi', 'gandhi', 'zhuangzi'],
    blogLinks: [{ slug: 'the-cat-teachers', title: { zh: '貓老師', en: 'The Cat Teachers' } }],
  },
  {
    id: 'fanon',
    name: { zh: '弗朗茨·法農', en: 'Frantz Fanon' },
    epithet: { zh: '被殖民的身體與解放', en: 'Colonised bodies & liberation' },
    era: { zh: '1925–1961', en: '1925–1961' },
    region: { zh: '馬提尼克／阿爾及利亞／法國', en: 'Martinique / Algeria / France' },
    centroid: { ethics: 0.45, epistemology: 1.05, existence: 0.25, social: -0.3, stance: -1.25, tradition: 1.6 },
    barQuote: {
      zh: '「每個世代都該發現其使命，完成它或背叛它。」',
      en: '"Each generation must, out of relative obscurity, discover its mission, fulfil it, or betray it."',
    },
    biography: [
      {
        zh: '法農生於法屬馬提尼克，後在法國學醫並成為精神科醫生，於阿爾及利亞戰爭期間服務並支持阿爾及利亞獨立。其著作《黑皮膚，白面具》《全世界受苦的人》分析殖民如何內化為心理創傷與自我否定。',
        en: 'Born in Martinique, Fanon studied medicine in France and became a psychiatrist, serving in Algeria during the war of independence. *Black Skin, White Masks* and *The Wretched of the Earth* analyse how colonisation is internalised as psychic wound and self-negation.',
      },
      {
        zh: '他拒絕把壓迫只當「誤解」，而視之為具體的暴力結構；解放因此不只是改變想法，而是重塑能夠行動、能夠自認的主體。',
        en: 'He refused to treat oppression as mere misunderstanding — it is structural violence. Liberation is not only changing minds but remaking subjects capable of action and self-recognition.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你對「中立」「客觀」保持警惕，相信視角從來帶有歷史與權力位置。這接近法農對殖民凝視的拆解。',
        en: 'You are wary of "neutrality" and "objectivity," believing perspective always carries history and power. That aligns with Fanon\'s dismantling of the colonial gaze.',
      },
      {
        zh: '你也傾向在關鍵時刻選擇行動，而非無限延宕的反思——尤其當沉默等同於共謀。',
        en: 'You lean toward action at decisive moments rather than endless deferral — especially when silence equals complicity.',
      },
    ],
    blindSpots: [
      {
        zh: '革命語言若過激，可能正當化新的暴力；法農本人對暴力有複雜論述，後世常有簡化引用。',
        en: 'Revolutionary rhetoric can legitimise new violence; Fanon\'s own account of violence is complex and often quoted selectively.',
      },
      {
        zh: '以民族解放為框架，未必充分處理階級、性別等內部差異；後殖民思想在此有持續辯論。',
        en: 'National liberation frames may not fully address internal differences of class and gender; postcolonial debate continues here.',
      },
    ],
    relatedIds: ['du-bois', 'beauvoir', 'gandhi'],
    blogLinks: [{ slug: 'footbridge-paradox', title: { zh: '橋上悖論', en: 'Paradox over the Footbridge' } }],
  },
  {
    id: 'gandhi',
    name: { zh: '聖雄甘地', en: 'Mahatma Gandhi' },
    epithet: { zh: '真理與非暴力', en: 'Truth-force & nonviolence' },
    era: { zh: '1869–1948', en: '1869–1948' },
    region: { zh: '印度／南非', en: 'India / South Africa' },
    centroid: { ethics: -1.7, epistemology: 0.8, existence: -1.75, social: -1.4, stance: -0.85, tradition: -1.2 },
    barQuote: {
      zh: '「以眼還眼，只會令全世界失明。」——但對他而言，非暴力不是軟弱，而是更艱難的紀律。',
      en: '"An eye for an eye will make the whole world blind." — for him nonviolence was not weakness but harder discipline.',
    },
    biography: [
      {
        zh: '甘地出身印度，在南非經歷種族歧視後發展出「真理堅持」（Satyagraha）與非暴力抗爭，回印後領導反殖民運動。他以簡樸生活、禁食、監禁與羣眾行動，試圖同時改造自我與社會。',
        en: 'Gandhi, born in India, developed *satyagraha* — truth-force — and nonviolent resistance after experiencing racism in South Africa. Returning home he led anti-colonial struggle through simple living, fasts, imprisonment, and mass action aiming to transform self and society together.',
      },
      {
        zh: '他相信手段與目的不可分：若以不正當方式取得「正義」，那正義已被污染。倫理因此是每日可實踐的修煉，而非口號。',
        en: 'He held means and ends inseparable: justice won by unjust methods is already corrupted. Ethics is daily practice, not slogans.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你重視「如何贏」至少與「贏什麼」同等重要；不願為達目的而踐踏底線。這與甘地的手段—目的倫理呼應。',
        en: 'You care how one wins at least as much as what one wins; you resist trampling limits for the goal. That echoes Gandhi\'s means-ends ethic.',
      },
      {
        zh: '你也把自我修養與公共責任連在一起——改變世界前，先問自己能否站得住。並非完美主義，而是誠實。',
        en: 'You link self-cultivation with public duty — before changing the world, ask whether you can stand upright. Not perfectionism, but honesty.',
      },
    ],
    blindSpots: [
      {
        zh: '非暴力理想在極端壓迫下是否足夠，仍有激烈爭論；也可能被強者要求弱者「保持克制」。',
        en: 'Whether nonviolence suffices under extreme oppression remains fiercely debated; the powerful may demand it only of the powerless.',
      },
      {
        zh: '甘地對種姓、性別等議題的立場複雜且具時代侷限；不宜將其神化為無矛盾聖像。',
        en: 'Gandhi\'s stances on caste and gender were complex and period-bound; he should not be idolised as flawless.',
      },
    ],
    relatedIds: ['buddha', 'wang-yangming', 'confucius'],
    blogLinks: [{ slug: 'candleblossoms', title: { zh: '蠟燭花', en: 'Candle Blossoms' } }],
  },
  {
    id: 'ibn-rushd',
    name: { zh: '伊本·魯什德', en: 'Ibn Rushd (Averroes)' },
    epithet: { zh: '理性與啟示的橋', en: 'Bridge of reason & revelation' },
    era: { zh: '1126–1198', en: '1126–1198' },
    region: { zh: '安達盧斯（伊斯蘭西班牙）', en: 'Al-Andalus (Islamic Spain)' },
    centroid: { ethics: -1.1, epistemology: -1.7, existence: -1.8, social: -1.05, stance: -0.5, tradition: -1.45 },
    barQuote: {
      zh: '「真理與真理不會衝突。」——哲學與神聖啟示，若同為真，終可相互印證。',
      en: '"Truth does not contradict truth." — philosophy and revelation, if both true, should ultimately accord.',
    },
    biography: [
      {
        zh: '伊本·魯什德生於科爾多瓦，是法官、醫者、哲學家與亞里士多德注釋者。他試圖調和理性探究與伊斯蘭啟示，強調用哲學理解宗教文本，而非盲目字面化。',
        en: 'Ibn Rushd was born in Córdoba — jurist, physician, philosopher, and commentator on Aristotle. He sought to harmonise rational inquiry with Islamic revelation, using philosophy to interpret scripture rather than literalism alone.',
      },
      {
        zh: '其思想在中世紀伊斯蘭世界引發爭議，卻深刻影響拉丁基督教學術與歐洲理性傳統——是跨文明對話的關鍵人物之一。',
        en: 'Controversial in the medieval Islamic world, his work deeply shaped Latin Christian scholasticism and European rational traditions — a key figure in cross-civilisational dialogue.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你相信傳統與理性可以對話，而非非此即彼。對你而言，繼承經典並不意味停止思考。',
        en: 'You believe tradition and reason can converse rather than cancel each other. Inheriting classics does not mean ceasing to think.',
      },
      {
        zh: '你也傾向在多元來源中尋找一致——科學、道德、信仰若皆指向真，便不應互相恐懼。',
        en: 'You seek coherence across sources — if science, ethics, and faith aim at truth, they need not fear one another.',
      },
    ],
    blindSpots: [
      {
        zh: '調和工程可能低估真正的衝突——有些價值並非稍作詮釋即可一致。',
        en: 'Projects of harmonisation may understate genuine conflict — some values do not align by finer interpretation alone.',
      },
      {
        zh: '以精英理性詮釋啟示，可能被指忽略普通信徒的宗教體驗與社羣實踐。',
        en: 'Elite rational interpretation of revelation can be accused of sidelining ordinary believers\' experience and communal practice.',
      },
    ],
    relatedIds: ['confucius', 'socrates', 'kant'],
    blogLinks: [{ slug: 'why-overthink-on-an-empty-stomach', title: { zh: '做乜諗嘢唔食飯？', en: 'Why Overthink on an Empty Stomach?' } }],
  },
  {
    id: 'mill',
    name: { zh: '約翰·史都華·彌爾', en: 'John Stuart Mill' },
    epithet: { zh: '自由與最大幸福', en: 'Liberty & the greatest happiness' },
    era: { zh: '1806–1873', en: '1806–1873' },
    region: { zh: '英國', en: 'United Kingdom' },
    centroid: { ethics: 1.55, epistemology: 0.5, existence: 0.15, social: 1.4, stance: -0.5, tradition: 1.1 },
    barQuote: {
      zh: '「做一個不滿足的人，好過做一頭滿足的豬；做一個不滿足的蘇格拉底，好過做一個滿足的傻瓜。」——快樂也有高低之分。',
      en: '"Better to be a human being dissatisfied than a pig satisfied; better to be Socrates dissatisfied than a fool satisfied." — pleasures differ in quality, not only quantity.',
    },
    biography: [
      {
        zh: '彌爾自幼受父親與功利主義傳統嚴格訓練，年輕時曾陷精神危機，後來透過詩歌、愛與友誼重新找到生活感受。他發展「改良版」功利主義，並以《論自由》辯護個人自由對社會進步的必要性。',
        en: 'Mill was rigorously educated in utilitarian tradition from childhood, suffered a mental crisis in youth, and recovered feeling for life through poetry, love, and friendship. He refined utilitarianism and in *On Liberty* defended individual freedom as vital to social progress.',
      },
      {
        zh: '他同時關注女性權利、奴隸制廢除與代議政治，試圖把「最大多數人的最大幸福」與個人自主、高等快樂結合。',
        en: 'He engaged women\'s rights, abolition, and representative government, trying to unite "the greatest happiness of the greatest number" with autonomy and higher pleasures.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你在權衡後果時，會認真計算「誰受益、誰受傷」——不是冷血的算計，而是負責任的衡量。這頗有彌爾的味道。',
        en: 'When weighing outcomes you seriously ask who benefits and who is harmed — not cold calculation but responsible measure. Very Mill.',
      },
      {
        zh: '你也重視言論、實驗與個人生活領域不可被任意侵犯——自由對你而言是幸福與真理的條件，而非裝飾。',
        en: 'You value speech, experiment, and a private sphere inviolable by whim — liberty as condition for happiness and truth, not ornament.',
      },
    ],
    blindSpots: [
      {
        zh: '功利計算可能把少數人變成可犧牲的小數——彌爾有修正，但問題仍在。',
        en: 'Utilitarian arithmetic can make minorities expendable decimals — Mill revised the formula, but the risk remains.',
      },
      {
        zh: '「高等快樂」由誰判定，可能帶有階級與文化偏見；精英常假定自己較懂「好生活」。',
        en: '"Higher pleasures" risk class and cultural bias — elites often assume they know the good life best.',
      },
    ],
    relatedIds: ['kant', 'beauvoir', 'camus'],
    blogLinks: [{ slug: 'footbridge-paradox', title: { zh: '橋上悖論', en: 'Paradox over the Footbridge' } }],
  },
  {
    id: 'laozi',
    name: { zh: '老子', en: 'Laozi' },
    epithet: { zh: '無為而治', en: 'Wu wei — acting without forcing' },
    era: { zh: '約公元前 6 世紀（傳）', en: 'trad. c. 6th century BCE' },
    region: { zh: '周朝中國', en: 'Zhou China' },
    centroid: { ethics: 0, epistemology: 0.55, existence: 1.15, social: -0.25, stance: 1.55, tradition: -0.7 },
    barQuote: {
      zh: '「道可道，非常道。」——能説出口的，已經不是那個「道」的全部。',
      en: '"The Way that can be spoken is not the eternal Way." — what can be said is already not the whole.',
    },
    biography: [
      {
        zh: '《道德經》傳為老子所作，其人歷史難考，但文本影響深遠。以「道」為宇宙本源，主張無為、柔弱勝剛強、返璞歸真，對中國政治、宗教、藝術與生活哲學均有深遠影響。',
        en: 'The *Daodejing* is attributed to Laozi, a figure historically elusive yet immensely influential. Taking the *Dao* as source, it teaches *wu wei*, softness overcoming hardness, and return to simplicity — shaping Chinese politics, religion, art, and lived philosophy.',
      },
      {
        zh: '他並非單純消極，而是質疑過度控制、過度言説與過度競爭——在適當時候讓事情自然成其自身。',
        en: 'Not mere passivity, it questions over-control, over-speech, and over-competition — allowing things to ripen in their time.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你對「越用力越糟」的處境有直覺——有時留白、後退、不回應，比硬拗更正確。這很接近無為的智慧。',
        en: 'You sense when more force makes things worse — sometimes space, retreat, or silence beats strain. That is *wu wei*\'s intuition.',
      },
      {
        zh: '你也對語言與標籤保持警惕，知道名相會框死人。道，不必今晚就講清。',
        en: 'You are wary of language and labels, knowing names can cage. The Way need not be settled tonight.',
      },
    ],
    blindSpots: [
      {
        zh: '無為可能被誤用為對不公的冷漠，或成為既得利益者維持現狀的藉口。',
        en: '*Wu wei* can be misused as indifference to injustice or an excuse for beneficiaries of the status quo.',
      },
      {
        zh: '「自然」並非總是善——若不加批判，可能浪漫化本已壓迫性的「傳統自然秩序」。',
        en: '"Nature" is not always good — uncritical appeal can romanticise oppressive "natural" orders.',
      },
    ],
    relatedIds: ['zhuangzi', 'buddha', 'confucius'],
    blogLinks: [{ slug: 'lands-end', title: { zh: '地之盡頭大風吹', en: 'Land\'s End' } }],
  },
  {
    id: 'socrates',
    name: { zh: '蘇格拉底', en: 'Socrates' },
    epithet: { zh: '未檢討的人生不值得過', en: 'The unexamined life is not worth living' },
    era: { zh: '公元前 470–399', en: '470–399 BCE' },
    region: { zh: '古雅典', en: 'Ancient Athens' },
    centroid: { ethics: -0.8, epistemology: -0.5, existence: -0.55, social: -0.3, stance: 1.4, tradition: -0.55 },
    barQuote: {
      zh: '「我唯一知道的，是我一無所知。」——這不是謙虛套話，而是提問的開場白。',
      en: '"I know that I know nothing." — not false modesty, but the opening of inquiry.',
    },
    biography: [
      {
        zh: '蘇格拉底本人無著述，形象主要來自柏拉圖、色諾芬等弟子記錄。他在雅典街頭與廣場以問答方式挑戰人們的自以為知，最終被控不敬與腐化青年，飲鴆而死。',
        en: 'Socrates wrote nothing; we know him mainly through Plato and Xenophon. He questioned confident knowledge in Athens\' streets and squares, was tried for impiety and corrupting youth, and died by hemlock.',
      },
      {
        zh: '他的方法不是傳授答案，而是逼出矛盾、澄清概念——什麼是勇氣、正義、虔敬？若連定義都説不清，憑什麼行動？',
        en: 'His method was not delivering answers but exposing contradictions and clarifying concepts — courage, justice, piety: if we cannot define them, on what basis do we act?',
      },
    ],
    worldviewMatch: [
      {
        zh: '你寧可暫時不結論，也要把問題問到底——這種「知不知」的誠實，頗有蘇格拉底之風。',
        en: 'You would rather suspend conclusion and keep asking — that honesty of not-knowing is Socratic.',
      },
      {
        zh: '你也相信善與知識相關：許多壞決定，來自未經審視的假設。深夜傾計若夠真誠，也是哲學。',
        en: 'You tie the good to knowledge: many bad decisions come from unexamined assumptions. A sincere late-night chat is philosophy too.',
      },
    ],
    blindSpots: [
      {
        zh: '詰問法若缺乏關懷，可能變成羞辱式的「贏辯論」——雅典青年對蘇格拉底觀感並不一致。',
        en: 'The elenchus without care can become shaming debate — Athenian youths did not uniformly love him.',
      },
      {
        zh: '過度強調理性對話，可能排除情感、身體與政治權力不對稱——不是所有人都能平等「開麥」。',
        en: 'Overemphasis on rational dialogue can exclude emotion, embodiment, and power asymmetry — not everyone gets equal floor time.',
      },
    ],
    relatedIds: ['kant', 'zhuangzi', 'mill'],
    blogLinks: [{ slug: 'why-overthink-on-an-empty-stomach', title: { zh: '做乜諗嘢唔食飯？', en: 'Why Overthink on an Empty Stomach?' } }],
  },
  {
    id: 'arendt',
    name: { zh: '漢娜·阿倫特', en: 'Hannah Arendt' },
    epithet: { zh: '在公共中思考', en: 'Thinking in public' },
    era: { zh: '1906–1975', en: '1906–1975' },
    region: { zh: '德國／美國', en: 'Germany / United States' },
    centroid: { ethics: -0.6, epistemology: 0.85, existence: -0.95, social: -1.15, stance: -0.8, tradition: 0.75 },
    barQuote: {
      zh: '「邪惡的平庸。」——最可怕的不總是惡魔，而是不再思考的人。',
      en: '"The banality of evil." — the horror is often not a devil but people who stop thinking.',
    },
    biography: [
      {
        zh: '阿倫特出身德國猶太家庭，納粹崛起後流亡，後以《極權主義的起源》《人的境況》等著作聞名。她區分勞動、工作、行動，強調公共領域中多元的他者如何使意義成為可能。',
        en: 'Arendt, a German-Jewish scholar, fled the Nazis and wrote *The Origins of Totalitarianism* and *The Human Condition*. She distinguished labour, work, and action, stressing how plural others in public life make meaning possible.',
      },
      {
        zh: '她對艾希曼審判的報道引發巨大爭議，卻持久提醒：道德崩潰常始於停止判斷、停止承擔「我能否與自我共存」。',
        en: 'Her report on the Eichmann trial was fiercely debated yet enduring: moral collapse often begins when people stop judging and stop asking whether they can live with themselves.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你把「公共」「他人」「可共同看見的世界」放在私人感受之外的重要位置——政治對你而言不是權鬥八卦，而是如何一起活。',
        en: 'You place the public, others, and a shared visible world beside private feeling — politics is not gossip but how we live together.',
      },
      {
        zh: '你也警惕盲從與官僚式「只是跟命令」——思考是道德行動的前提，不是事後的裝飾。',
        en: 'You are wary of obedience and bureaucratic "just following orders" — thinking precedes moral action; it is not decoration after the fact.',
      },
    ],
    blindSpots: [
      {
        zh: '「公共領域」的理想化可能忽視家務、照護勞動與邊緣羣體的可見性。',
        en: 'Idealised "public realm" can overlook domestic and care labour and the visibility of marginalised groups.',
      },
      {
        zh: '她對某些解放運動與殖民問題的判斷曾受批評；不宜將其簡化為單一道德偶像。',
        en: 'Her judgments on some liberation movements and colonial questions drew criticism; she should not be simplified into a single moral icon.',
      },
    ],
    relatedIds: ['kant', 'du-bois', 'fanon'],
    blogLinks: [{ slug: 'all-quiet-at-hastings', title: { zh: 'Hastings 的寧靜', en: 'All Quiet at Hastings' } }],
  },
  {
    id: 'du-bois',
    name: { zh: 'W·E·B·杜波依斯', en: 'W. E. B. Du Bois' },
    epithet: { zh: '雙重意識', en: 'Double consciousness' },
    era: { zh: '1868–1963', en: '1868–1963' },
    region: { zh: '美國', en: 'United States' },
    centroid: { ethics: -0.3, epistemology: 1.35, existence: -1.05, social: -0.95, stance: -0.65, tradition: 0.8 },
    barQuote: {
      zh: '「二十世紀的問題，是膚色界線的問題。」——問題本身已是哲學。',
      en: '"The problem of the twentieth century is the problem of the color-line." — the question itself is philosophy.',
    },
    biography: [
      {
        zh: '杜波依斯是美國歷史學家、社會學家與民權先驅，首位獲哈佛大學哲學博士的非裔美國人之一。他提出「雙重意識」——在非裔美國人身上，自我觀照與白人凝視同時存在。',
        en: 'Du Bois was an historian, sociologist, and civil-rights pioneer among the first African Americans to earn a Harvard PhD in philosophy. He formulated "double consciousness" — seeing oneself both from within and through the white gaze.',
      },
      {
        zh: '他終身連結學術、新聞、組織行動與反殖民關懷，晚年加入加納國籍。其思想橫跨種族正義、民主與教育權。',
        en: 'He linked scholarship, journalism, organising, and anti-colonial concern across a lifetime, taking Ghanaian citizenship in old age. His thought spans racial justice, democracy, and the right to education.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你相信經驗與身份會塑造你能看見什麼、看不見什麼——並因此拒絕「無色」的中立神話。',
        en: 'You believe experience and identity shape what one can and cannot see — refusing the myth of colourless neutrality.',
      },
      {
        zh: '你也把正義視為需要知識、組織與世代接力的事業，而非一夜頓悟——頗像杜波依斯。',
        en: 'You treat justice as work requiring knowledge, organisation, and generational relay — not overnight enlightenment. Very Du Bois.',
      },
    ],
    blindSpots: [
      {
        zh: '雙重意識框架主要源於美國種族經驗，未必直接套用所有語境——包括香港的複雜身份。',
        en: 'Double consciousness arises from American racial experience and does not map directly onto every context — including Hong Kong\'s complex identities.',
      },
      {
        zh: '精英教育路徑若被理想化，可能忽視底層社羣的聲音與知識形式。',
        en: 'Idealising elite education can sideline voices and knowledges from communities at the bottom.',
      },
    ],
    relatedIds: ['fanon', 'beauvoir', 'arendt'],
    blogLinks: [{ slug: 'footbridge-paradox', title: { zh: '橋上悖論', en: 'Paradox over the Footbridge' } }],
  },
  {
    id: 'nietzsche',
    name: { zh: '弗里德里希·尼采', en: 'Friedrich Nietzsche' },
    epithet: { zh: '成為你自己', en: 'Become who you are' },
    era: { zh: '1844–1900', en: '1844–1900' },
    region: { zh: '德國／瑞士／意大利', en: 'Germany / Switzerland / Italy' },
    centroid: { ethics: 0.8, epistemology: 0.35, existence: 0.9, social: 1.25, stance: -1.15, tradition: 1.65 },
    barQuote: {
      zh: '「殺死上帝之後，什麼仍值得相信？」——他逼我們自己回答，而不是替他回答。',
      en: '"After the death of God, what remains worth believing?" — he forces us to answer for ourselves, not for him.',
    },
    biography: [
      {
        zh: '尼采以古典語文學者起家，後脫離學院，以格言、詩歌與「哲學錘」風格寫作。他批判基督教道德、羣體心態與虛無主義，提出永恆回歸、權力意志、超人等充滿爭議的概念。',
        en: 'Nietzsche began as a classical philologist, left the academy, and wrote in aphorism, poetry, and hammer-strike prose. He critiqued Christian morality, herd mentality, and nihilism, proposing eternal recurrence, will to power, and the Übermensch — all fiercely contested.',
      },
      {
        zh: '他 1889 年精神崩潰，年僅四十四歲；著作卻被後世大量誤讀與挪用——從納粹到存在主義到後現代，皆曾選擇性引用。',
        en: 'His mind collapsed in 1889, at only forty-four; his work was vastly misread and appropriated — by Nazis, existentialists, postmodernists, each selectively.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你對「大家都這樣」保持本能警惕，不願未經審視就接受主流價值。你問：這套道德為誰服務？',
        en: 'You instinctively distrust "everyone does it" and refuse mainstream values unexamined. You ask: whose interests does this morality serve?',
      },
      {
        zh: '你也把自我創造、風格與誠實視為生命任務——即使這意味著孤獨或誤解。',
        en: 'You treat self-creation, style, and honesty as life tasks — even at the cost of loneliness or misunderstanding.',
      },
    ],
    blindSpots: [
      {
        zh: '對「強力」的讚美易被誤讀為社會達爾文主義；尼采本人複雜，但文本開放給危險引用。',
        en: 'Praise of strength is easily misread as social Darwinism; Nietzsche is complex, yet his texts invite dangerous citation.',
      },
      {
        zh: '強調個體超越，可能忽視團結、照護與結構性壓迫——「成為自己」在不平等社會裏並非同等可能。',
        en: 'Stress on individual overcoming can neglect solidarity, care, and structural oppression — "becoming oneself" is not equally available.',
      },
    ],
    relatedIds: ['camus', 'beauvoir', 'zhuangzi'],
    blogLinks: [{ slug: 'sisyphus', title: { zh: '西西弗斯', en: 'Sisyphus' } }],
  },
  {
    id: 'wang-yangming',
    name: { zh: '王陽明', en: 'Wang Yangming' },
    epithet: { zh: '知行合一', en: 'Unity of knowledge and action' },
    era: { zh: '1472–1529', en: '1472–1529' },
    region: { zh: '明朝中國', en: 'Ming China' },
    centroid: { ethics: -1.3, epistemology: 0.5, existence: -1.75, social: -1.5, stance: -1.25, tradition: -1.25 },
    barQuote: {
      zh: '「知是行的主意，行是知的功夫；知是行之始，行是知之成。」——知道而不做，只是未知。',
      en: '"Knowledge is the idea of action; action is the effort of knowledge." — to know without acting is not yet to know.',
    },
    biography: [
      {
        zh: '王守仁，號陽明，明代思想家、軍事家與官員。龍場悟道後發展心學，主張「致良知」「知行合一」，影響東亞儒學數百年。',
        en: 'Wang Shouren, styled Yangming, was a Ming philosopher, general, and official. After enlightenment at Longchang he developed the School of Mind (xinxue), teaching "extension of innate knowing" and the unity of knowledge and action — shaping East Asian Confucianism for centuries.',
      },
      {
        zh: '他並非空談心性，而在平亂、施政、教化中實踐——道德必須在具體事上磨練，而非懸於口。',
        en: 'He did not merely theorise mind: he practiced in campaigns, governance, and teaching — morality must be forged in concrete affairs, not hung on the lips.',
      },
    ],
    worldviewMatch: [
      {
        zh: '你相信真正的「知道」會體現在行動上——若説重視正義卻從不行動，你會懷疑那是否只是口號。',
        en: 'You believe real knowing shows in action — if one claims justice yet never acts, you suspect slogans over conviction.',
      },
      {
        zh: '你也重視內心良知與日常責任的一體：在家庭、工作、社羣中具體地做人——頗有王陽明的味道。',
        en: 'You unite inner conscience with daily duty: becoming a person in family, work, and community — very Yangming.',
      },
    ],
    blindSpots: [
      {
        zh: '「良知」若被權威定義，可能壓制異議——心學亦曾被政治化利用。',
        en: 'If "innate knowing" is defined by authority it can suppress dissent — the School of Mind was also politicised.',
      },
      {
        zh: '強調主觀覺悟，可能低估制度變革與外部約束；並非人人都有同等的「實踐」空間。',
        en: 'Stress on subjective awakening may underplay institutional change and external constraints — not everyone has equal room to act.',
      },
    ],
    relatedIds: ['confucius', 'gandhi', 'kant'],
    blogLinks: [{ slug: 'bao-faan', title: { zh: '飽飯', en: 'A Profound Satiety' } }],
  },
];

export const PHILOSOPHER_MAP = new Map(PHILOSOPHERS.map((p) => [p.id, p]));
