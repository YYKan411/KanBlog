/**
 * 思想偵探室 · The Thought Detective's Office
 * Eight cases, one real dataset (16 historical thinkers) — no theme switcher.
 * Authored via Workflow fan-out, adversarially verified against a real
 * sqlite3 rebuild of philosophers-data.js, then reshaped from the authoring
 * (flat) schema into the nested schema case-app.js's render/validate code
 * actually consumes.
 */
export const CASES = [
  {
    id: "case1",
    title: {
      zh: "案件一：認人",
      en: "Case 1: Know Your Suspects"
    },
    premise: {
      zh: "有讀者話喺你文入面見到唔同思想家反覆出現，想知呢班人之間係咪真係有關係。",
      en: "A reader noticed different thinkers keep showing up across your essays and wants to know if they are really connected."
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "開波先，睇下呢個資料庫入面總共有幾多位思想家喺度。",
          en: "Start simple — see how many thinkers are sitting in this database at all."
        },
        sql: "SELECT COUNT(*) FROM thinkers;",
        payoff: {
          zh: "十六位，橫跨兩千幾年、四大洲。案件正式開始。",
          en: "Sixteen of them, spanning two and a half thousand years and four continents. The case is open."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "睇吓佢哋大概係咩人 — 邊個、幾時生、幾時死、喺邊度。",
          en: "Get a first look at who they are — name, birth year, death year, and where they were from."
        },
        sql: "SELECT id, name_zh, born_year, died_year, region_zh FROM thinkers LIMIT 5;",
        payoff: {
          zh: "出返嚟嘅五個 — 卡繆、孔子、康德、莊子、波娃 — 時代同地域完全唔同。呢班人本身冇乜共通點，先至令讀者覺得佢哋反覆出現係件出奇事。",
          en: "The first five back — Camus, Confucius, Kant, Zhuangzi, Beauvoir — barely share an era or a region. No wonder the reader found it odd that they keep turning up together."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "讀者話呢班人嚟自五湖四海，即刻用 WHERE 試吓揀返「淨係嚟自邊度」嘅人 — 例如淨係喺美國出生嗰位。",
          en: "Since the reader says these thinkers come from all over, use WHERE to pull out just the ones from one specific place — say, the one from the United States."
        },
        sql: "SELECT id, name_zh, name_en, region_en FROM thinkers WHERE region_en = 'United States';",
        payoff: {
          zh: "得返杜波依斯一個。WHERE 揀嘅係「符合條件嗰啲列」，同揀邊幾條欄係兩回事。",
          en: "Only Du Bois comes back. WHERE selects the rows that match a condition — it has nothing to do with which columns you display."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "你留意到有啲 born_year 係負數 —— 呢個 database 用負數代表公元前（BCE）。你懷疑，讀者講嘅「反覆出現」，會唔會同邊個年代有關？試搵晒喺公元前 400 年之前出生嘅思想家（即係 born_year < -400），睇吓入面有邊幾位。",
          en: "You notice some born_year values are negative — this database uses negative numbers for BCE. You wonder whether the reader's \"keeps showing up\" has something to do with era. Find every thinker born before 400 BCE (that is, born_year < -400) and see who qualifies."
        },
        starter: "SELECT id, name_zh, name_en, born_year FROM thinkers WHERE born_year < 0;",
        payoff: {
          zh: "三位 — 佛陀、孔子、蘇格拉底。全部都係公元前嘅人，但翻查 resonances 表，佢哋三個之間一條連結都冇。原來「同年代」唔係反覆出現嘅原因。",
          en: "Three names — the Buddha, Confucius, Socrates. All pre-400 BCE, yet the resonances table shows not one link between any pair of them. Sharing an era, it turns out, is not what makes them recur."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT id, name_zh, name_en, born_year FROM thinkers WHERE born_year < -400"
        },
        hints: {
          zh: [
            "你而家個 starter 攞緊所有負數嘅 born_year — 即係所有 BCE 嘅人，唔止公元前 400 年之前。睇吓個 threshold 啱唔啱。",
            "將條件由 born_year < 0 改做 born_year < -400。",
            "偽代碼：SELECT id, name_zh, name_en, born_year FROM thinkers WHERE born_year < -400"
          ],
          en: [
            "Your starter currently grabs everyone with a negative born_year — every BCE thinker, not just those before 400 BCE. Check whether the threshold is right.",
            "Change the condition from born_year < 0 to born_year < -400.",
            "Pseudocode: SELECT id, name_zh, name_en, born_year FROM thinkers WHERE born_year < -400"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "「反覆出現」呢個講法，會唔會其實講緊 essays？呢班思想家有部分係共用緊同一篇讀物。用 DISTINCT 睇吓：essays 表總共有幾多列，同真正獨立嘅文章又有幾多。",
          en: "Maybe \"keeps showing up\" really means the essays. Some of these thinkers share the very same piece of reading. Use DISTINCT to check: how many rows sit in essays, versus how many genuinely distinct essays there are."
        },
        sql: "SELECT COUNT(*) AS total_rows, COUNT(DISTINCT slug) AS distinct_essays FROM essays;",
        payoff: {
          zh: "十六列，但淨係八篇獨立文章 —— 即係平均每篇文章畀兩位思想家共用。讀者所講嘅「反覆出現」，原來喺度已經有真憑實據。",
          en: "Sixteen rows, but only eight distinct essays — on average, every essay is shared by two thinkers. The reader's \"keeps showing up\" turns out to have real evidence right here."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "暫時放低 essays，返去睇返啲思想家本身。邊三位嘅在世時間最耐？用 (died_year - born_year) 計返個 lifespan，由大到細排，攞頭三名。留意：呢度會撞到同分，所以第二個排序欄要清楚寫明係邊個 —— 用 id 由細到大做 tiebreak，先至每次都攞到同一個答案。",
          en: "Set the essays aside and look at the thinkers themselves. Which three lived the longest? Compute the lifespan as (died_year - born_year), order by it descending, and take the top three. Mind the tie you will hit here — name the second sort column explicitly. Use id ascending as the tiebreak, so the answer stays the same every time you run it."
        },
        starter: "SELECT id, name_zh, name_en, (died_year - born_year) AS lifespan FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL ORDER BY lifespan DESC LIMIT 3;",
        payoff: {
          zh: "杜波依斯（95 年）、莊子（83 年）、佛陀（80 年）—— 同分嘅康德就啱啱好跌出三甲。加咗 id 做 tiebreak，呢個結果先至企得穩，唔會因為執行次序唔同而變。",
          en: "Du Bois (95 years), Zhuangzi (83), and the Buddha (80) — Kant, tied at that same 80, just misses out on third place. With id as the tiebreak, this result finally holds still, whatever order the database happens to process ties in."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT id, name_zh, name_en, (died_year - born_year) AS lifespan FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL ORDER BY lifespan DESC, id ASC LIMIT 3"
        },
        hints: {
          zh: [
            "康德同佛陀嘅 lifespan 一樣都係 80 年 —— 淨係用 ORDER BY lifespan DESC，第三名畀邊個係「睇彩數」，唔同時間跑可能會唔同。",
            "加多一個排序欄嚟分先後：ORDER BY lifespan DESC, id ASC。",
            "偽代碼：SELECT id, name_zh, name_en, (died_year - born_year) AS lifespan FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL ORDER BY lifespan DESC, id ASC LIMIT 3"
          ],
          en: [
            "Kant and the Buddha are tied at exactly 80 years — with only ORDER BY lifespan DESC, who lands in third place is down to luck, and could vary between runs.",
            "Add a second sort column to break the tie: ORDER BY lifespan DESC, id ASC.",
            "Pseudocode: SELECT id, name_zh, name_en, (died_year - born_year) AS lifespan FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL ORDER BY lifespan DESC, id ASC LIMIT 3"
          ]
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "咁「同年代」唔係答案，個 essays 表就已經證明真係有共用嘅嘢。最後一步，返去 resonances 表本身，直接查證：孔子同王陽明 —— 相隔成兩千年嘅兩代儒家 —— 呢個 site 有冇將佢哋標記做互相 resonate？",
          en: "So era was not the answer, and the essays table has already shown genuine sharing. For the last move, go straight to the resonances table and check directly: Confucius and Wang Yangming — two Confucian thinkers two thousand years apart — does this site mark them as resonating with each other?"
        },
        starter: "SELECT * FROM resonances WHERE thinker_id = 'confucius';",
        payoff: {
          zh: "有連結，仲係雙向嘅 —— 王陽明嗰邊都有一條返去孔子。讀者係啱嘅：呢班思想家唔係亂咁擺埋一齊，係真係搵到脈絡先至連埋。案件close。",
          en: "Linked, and reciprocally — Wang Yangming's own row points straight back to Confucius. The reader was right: these thinkers are not thrown together at random; the links only exist where a genuine thread was traced. Case closed."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT * FROM resonances WHERE thinker_id = 'confucius' AND related_id = 'wang-yangming'"
        },
        hints: {
          zh: [
            "諗吓 resonances 表有兩條欄，thinker_id 同 related_id。",
            "用 WHERE 同時篩兩條欄：thinker_id = ... AND related_id = ...",
            "偽代碼：SELECT * FROM resonances WHERE thinker_id = 'confucius' AND related_id = 'wang-yangming'"
          ],
          en: [
            "Think about the two columns in resonances — thinker_id and related_id.",
            "Filter on both columns at once: WHERE thinker_id = ... AND related_id = ...",
            "Pseudocode: SELECT * FROM resonances WHERE thinker_id = 'confucius' AND related_id = 'wang-yangming'"
          ]
        }
      }
    ]
  },
  {
    id: "case2",
    title: {
      zh: "案件二：邊個同邊個",
      en: "Case 2: Who's With Whom"
    },
    premise: {
      zh: "案件一查完 resonances 表之後，有讀者留言彈：「淨係話有連結唔夠喎——佢哋係咪真係喺同一篇文入面一齊出過場？仲有，佢哋係咪個個都親手寫過嘢？」呢單案就係要用 JOIN，去確認邊個同邊個真係綁埋喺同一篇文，同埋——查到最後——邊個原來乜嘢都冇留低。",
      en: "After Case 1 sorted out the resonances, a reader pushed back: knowing two thinkers are linked isn't the same as knowing they actually appear together in the same essay — and did every one of them genuinely write something down themselves? This case reaches for JOIN, to confirm who is truly paired with whom in the essays, and — by the end — who, it turns out, left nothing in writing at all."
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "先睇個最簡單嘅配對：邊兩位思想家，係喺同一篇文入面一齊出現？用 INNER JOIN，將 thinkers 表同 essays 表，沿住 thinker_id 同 id 呢條線焊埋一齊。",
          en: "Start with the simplest pairing: which two thinkers actually turn up inside the same essay? INNER JOIN welds the thinkers and essays tables together along the thinker_id / id seam."
        },
        sql: "SELECT t.name_zh, t.name_en, e.title_zh, e.title_en FROM thinkers t INNER JOIN essays e ON t.id = e.thinker_id WHERE e.slug = 'sisyphus';",
        payoff: {
          zh: "卡繆同尼采，兩個人揸住同一篇《推石頭之人》。INNER JOIN 淨係留低兩張表都夾得到嘅列——冇對應 essay 嘅思想家，喺呢度直頭唔會出現。",
          en: "Camus and Nietzsche, both inside 'He Who Pushes the Stone'. INNER JOIN keeps only the rows that match on both sides — any thinker without a matching essay simply does not show up here at all."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "呢度仲有一篇文，擠咗成班人入去——《橋上悖論》。用返同一招 INNER JOIN，睇實際係邊 5 個。",
          en: "One essay in particular crams in rather a crowd — 'Paradox over the Footbridge'. The same INNER JOIN move reveals exactly which five."
        },
        sql: "SELECT t.id, t.name_zh, t.name_en FROM thinkers t INNER JOIN essays e ON t.id = e.thinker_id WHERE e.slug = 'footbridge-paradox' ORDER BY t.id;",
        payoff: {
          zh: "康德、波娃、法農、彌爾、杜波依斯——足足五位，一鑊過企晒喺呢條電車難題嘅橋度。",
          en: "Kant, Beauvoir, Fanon, Mill, Du Bois — five of them, all standing together on this trolley-problem footbridge."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "換轉你嚟查：另有一篇文，叫《做乜諗嘢唔食飯？》，你去搵吓實際上邊班人揸住呢篇——記住，兩張表要用 INNER JOIN 講明點夾，唔好淨係喺 FROM 度擺兩個表名就算（嗰種寫法會變成盲配，每一列同每一列夾一次）。",
          en: "Your turn: another essay, 'Why Overthink on an Empty Stomach?' — find out who is actually inside it. Mind that just listing two tables in FROM without an explicit INNER JOIN pairs every row against every row blindly, not only the matches."
        },
        starter: "SELECT t.name_zh, t.name_en FROM thinkers t, essays e WHERE e.slug = 'why-overthink-on-an-empty-stomach';",
        payoff: {
          zh: "伊本·魯什德同蘇格拉底。留意蘇格拉底個名——一陣間佢重出江湖，不過就換咗個身份。",
          en: "Ibn Rushd and Socrates. Keep an eye on that second name — Socrates is about to resurface, wearing a different hat."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT t.name_zh, t.name_en FROM thinkers t INNER JOIN essays e ON t.id = e.thinker_id WHERE e.slug = 'why-overthink-on-an-empty-stomach';",
          mustContainSQL: [
            "inner join"
          ]
        },
        hints: {
          zh: [
            "淨係將兩個表名擺埋喺 FROM，冇講明點樣夾返，個結果會膨脹——你要話畀資料庫聽，thinkers 嘅 id 同 essays 嘅 thinker_id 係同一樣嘢。",
            "用 INNER JOIN ... ON t.id = e.thinker_id，先至夾得返啱嘅配對。",
            "偽代碼：SELECT t.name_zh, t.name_en FROM thinkers t INNER JOIN essays e ON t.id = e.thinker_id WHERE e.slug = 'why-overthink-on-an-empty-stomach';"
          ],
          en: [
            "Just listing two tables in FROM without saying how they relate lets the result balloon — you need to tell the database that thinkers.id and essays.thinker_id are the same thing.",
            "Use INNER JOIN ... ON t.id = e.thinker_id to line up only the genuine matches.",
            "Pseudocode: SELECT t.name_zh, t.name_en FROM thinkers t INNER JOIN essays e ON t.id = e.thinker_id WHERE e.slug = 'why-overthink-on-an-empty-stomach';"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "而家轉線：邊個思想家，其實從來冇親手留低過一份自己嘅著作？單靠 INNER JOIN 搵唔到呢啲「消失嘅疑犯」——冇對應 works 嘅人，INNER JOIN 會直接令佢隱形。呢度要用 LEFT JOIN：凡係 thinkers 嘅列，一律留低，夾唔到嘅 works 欄就填 NULL。",
          en: "Now the case turns: which thinkers left behind no work of their own? INNER JOIN could never surface these vanishing suspects — anyone without a matching row in works simply disappears from it. This calls for LEFT JOIN: keep every row from thinkers regardless, and fill the works columns with NULL wherever there is no match."
        },
        sql: "SELECT t.name_zh, t.name_en, w.title_zh, w.title_en FROM thinkers t LEFT JOIN works w ON t.id = w.thinker_id ORDER BY (w.title_en IS NULL) DESC, t.id;",
        payoff: {
          zh: "睇頭三行——釋迦牟尼、孔子、蘇格拉底，works 嗰兩欄全部係 NULL。呢三位，喺呢個資料庫入面，係真係一份親手寫嘅著作都冇。",
          en: "Look at the first three rows — the Buddha, Confucius, Socrates — both works columns sit empty. In this database, these three genuinely have not one personally-authored work to their name."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "咁而家用返呢招，自己捉返晒呢班「冇留低隻字」嘅人——唔好靠肉眼喺廿行度數，用 WHERE ... IS NULL，叫資料庫自動篩返出嚟。",
          en: "Now use the same trick yourself to round up every thinker who left nothing in writing — don't eyeball twenty rows, let WHERE ... IS NULL do the filtering."
        },
        starter: "SELECT t.id, t.name_zh, t.name_en FROM thinkers t INNER JOIN works w ON t.id = w.thinker_id;",
        payoff: {
          zh: "三個名，冚唪唥喺度：孔子、釋迦牟尼、蘇格拉底。",
          en: "Three names, and only three: Confucius, the Buddha, Socrates."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT t.id, t.name_zh, t.name_en FROM thinkers t LEFT JOIN works w ON t.id = w.thinker_id WHERE w.thinker_id IS NULL;",
          mustContainSQL: [
            "left join",
            "is null"
          ]
        },
        hints: {
          zh: [
            "INNER JOIN 淨係畀你睇到「有著作」嗰班人——你而家想搵嘅係反過來，冇著作嗰班。",
            "改用 LEFT JOIN 保留晒所有 thinkers，再喺 WHERE 度篩 works 嗰邊嘅欄做 IS NULL。",
            "偽代碼：SELECT t.id, t.name_zh, t.name_en FROM thinkers t LEFT JOIN works w ON t.id = w.thinker_id WHERE w.thinker_id IS NULL;"
          ],
          en: [
            "INNER JOIN only shows you the thinkers who do have a work — you now want the opposite, the ones who don't.",
            "Switch to LEFT JOIN to keep every thinker, then filter in WHERE on the works-side column being IS NULL.",
            "Pseudocode: SELECT t.id, t.name_zh, t.name_en FROM thinkers t LEFT JOIN works w ON t.id = w.thinker_id WHERE w.thinker_id IS NULL;"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "案件收尾——呢三位其實有個共通點：佢哋嘅諗法，全部係由學生執筆記低，自己反而冇留低隻字。孔子有《論語》（學生輯錄）、釋迦牟尼嘅教導由弟子結集成經、蘇格拉底就靠柏拉圖幫佢寫低對話。呢張 site 記低嘅，就係佢哋自己講過嘅嗰句話。",
          en: "Case closed, almost — what these three share is that their thought reaches us only through their students' pens, never their own: Confucius through the Analects his disciples compiled, the Buddha's teachings gathered into sutras by his followers, Socrates surviving chiefly through Plato's dialogues. What this site holds of them, fittingly, is just the words they are recorded as having spoken."
        },
        sql: "SELECT name_zh, name_en, quote_zh, quote_en FROM thinkers WHERE id IN ('confucius','buddha','socrates');",
        payoff: {
          zh: "三句嘢，冇一份自己嘅著作——但每一句，都仲喺度。",
          en: "Three sayings, not one authored book between them — and yet every saying still stands."
        }
      }
    ]
  },
  {
    id: "case3",
    title: {
      zh: "案件三：朋友嘅朋友",
      en: "Case 3: A Friend of a Friend"
    },
    premise: {
      zh: "又有讀者留言，話留意到你成日將思想家兩個兩個咁擺埋一齊，叫做「resonance」。佢想知深啲：如果孔子連咗去某個人，嗰個人又連咗第二個人，係咪即係孔子同嗰第二個人都算「friend of a friend」？仲有，呢啲箭嘴係咪掉轉都通？",
      en: "Another reader has written in, having noticed how often the site pairs thinkers together under &quot;resonance&quot;. They want to dig deeper: if Confucius links to someone, and that someone links on to a third person, does that make Confucius a friend of a friend of the third? And do those arrows even run both ways?"
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "先睇下 resonances 表入面，孔子直接連住邊幾位。",
          en: "Start with what resonances actually stores: who Confucius is directly linked to."
        },
        sql: "SELECT thinker_id, related_id FROM resonances WHERE thinker_id = 'confucius';",
        payoff: {
          zh: "得返三個 id，但你淨係識個 id，唔識係邊個 — 要另外解番做名先睇得明。",
          en: "Three raw ids and nothing else — you need to resolve them into names before they mean anything."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "唔想淨係郁手 JOIN，試吓用 subquery 嚟解返呢三個 id 做返正經名。WHERE id IN (...) 呢種寫法，入面嗰句 SELECT 會行先，攞到一張 id 清單，出面嘅 WHERE 就照住嚟揀 — 同用 JOIN 出返嚟嘅結果係一樣，淨係另一種講法。",
          en: "Rather than reach straight for a JOIN, resolve those three ids into real names with a subquery: WHERE id IN (...) runs the inner SELECT first, turns it into a list, and the outer query filters against it — a plain JOIN would return the same rows, this is simply an alternative phrasing worth knowing."
        },
        sql: "SELECT id, name_zh, name_en FROM thinkers WHERE id IN (SELECT related_id FROM resonances WHERE thinker_id = 'confucius');",
        payoff: {
          zh: "三個名：王陽明、聖雄甘地、伊本·魯什德。",
          en: "Three names: Wang Yangming, Mahatma Gandhi, and Ibn Rushd."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "但係 resonances 係有方向嘅 — thinker_id 指向 related_id，唔一定啱掉轉。孔子連出去嗰三個人係咪都會連番轉頭嚟搵佢？練習：用返同一種 subquery 寫法，但今次要搵「邊個指緊向孔子」嘅人，即係邊個嘅 related_id = 'confucius'。",
          en: "But resonances is a directed graph — thinker_id points to related_id, with no promise the arrow runs back. Do the three people Confucius points to also point back at him? Exercise: reuse the same IN-subquery shape, but this time find who points towards Confucius — whose related_id is 'confucius'."
        },
        starter: "SELECT id, name_zh, name_en FROM thinkers WHERE id IN (SELECT related_id FROM resonances WHERE thinker_id = 'confucius');",
        payoff: {
          zh: "四個人指緊嚟孔子：甘地、伊本·魯什德、王陽明 — 呢三個同之前果批一樣，係雙向嘅。但仲有多一個：老子。老子指住孔子，但孔子個 outgoing list 入面冇老子。條箭嘴原來唔係一定掉得轉。",
          en: "Four people point towards Confucius: Gandhi, Ibn Rushd, and Wang Yangming — mutual with the earlier three — plus one more: Laozi. Laozi points at Confucius, but Confucius's own outgoing list never points back at Laozi. The arrow, it turns out, does not always run both ways."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT id, name_zh, name_en FROM thinkers WHERE id IN (SELECT thinker_id FROM resonances WHERE related_id = 'confucius')",
          mustContainSQL: [
            "in (select"
          ]
        },
        hints: {
          zh: [
            "諗吓：出面果句要搵嘅係邊個嘅箭嘭「指去」孔子，唔係孔子「指去邊個」— 睇清楚 resonances 用邊一條欄。",
            "用 WHERE id IN (SELECT thinker_id FROM resonances WHERE related_id = 'confucius') — 入面嗰句揀嘅係 thinker_id，唔係 related_id。",
            "偽代碼：SELECT id, name_zh, name_en FROM thinkers WHERE id IN (SELECT thinker_id FROM resonances WHERE related_id = 'confucius')"
          ],
          en: [
            "Think about which column of resonances actually holds an arrow pointing towards Confucius, rather than away from him.",
            "Use WHERE id IN (SELECT thinker_id FROM resonances WHERE related_id = 'confucius') — the inner SELECT should pull thinker_id, not related_id.",
            "Pseudocode: SELECT id, name_zh, name_en FROM thinkers WHERE id IN (SELECT thinker_id FROM resonances WHERE related_id = 'confucius')"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "都好，而家先返去問緊個大問題：friend of a friend。要行多一步，就要將 resonances 呢張表接自己一次 — 一個叫 r1（第一步），一個叫 r2（第二步），用 r1.related_id = r2.thinker_id 駁埋一齊。",
          en: "Right — back to the bigger question: friend of a friend. Taking one more hop means joining resonances to itself: alias one copy r1 for the first hop, another r2 for the second, and connect them with r1.related_id = r2.thinker_id."
        },
        sql: "SELECT r1.thinker_id, r1.related_id AS hop1, r2.related_id AS hop2\nFROM resonances r1\nJOIN resonances r2 ON r1.related_id = r2.thinker_id\nWHERE r1.thinker_id = 'confucius';",
        payoff: {
          zh: "九行，唔係三行。仲要留意：有兩行行番轉頭去返孔子自己度 — 呢個網唔係一條直路，佢有返轉頭嘅圈；亦都有重複（例如王陽明再指去甘地又指去 confucius）。",
          en: "Nine rows, not three. Two of them loop straight back to Confucius himself — this network is not a straight line, it has cycles — and several targets repeat, since Wang Yangming's own links to Gandhi and back to Confucius each surface again."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "呢九行入面有好多雜訊：有自己兜番轉頭嘅、有本身已經係直接朋友嘅（王陽明、甘地、伊本·魯什德）。練習：執到淨返「真係新㨂到」嘅 friend of a friend — 即係要 DISTINCT，仲要剔走孔子自己，同埋剔走原本已經係直接連住嘅嗰三個。",
          en: "Nine rows of noise: some loop back to Confucius, others are already his direct friends (Wang Yangming, Gandhi, Ibn Rushd). Exercise: strip it down to the genuinely new two-hop discoveries — DISTINCT, with Confucius himself excluded, and the three already-direct friends excluded too."
        },
        starter: "SELECT r2.related_id AS two_hop\nFROM resonances r1\nJOIN resonances r2 ON r1.related_id = r2.thinker_id\nWHERE r1.thinker_id = 'confucius';",
        payoff: {
          zh: "淨返三個：康德、佛陀、蘇格拉底。呢三個先至係真正嘅「朋友嘅朋友」— 孔子本人從未直接連過佢哋，但透過王陽明、甘地或伊本·魯什德，兩步之內就搵得到。",
          en: "Three names remain: Kant, the Buddha, and Socrates. These are the genuine friends of a friend — Confucius has no direct link to any of them, yet each sits two hops away through Wang Yangming, Gandhi, or Ibn Rushd."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT DISTINCT r2.related_id AS two_hop FROM resonances r1 JOIN resonances r2 ON r1.related_id = r2.thinker_id WHERE r1.thinker_id = 'confucius' AND r2.related_id != 'confucius' AND r2.related_id NOT IN (SELECT related_id FROM resonances WHERE thinker_id = 'confucius')",
          mustContainSQL: [
            "distinct",
            "join"
          ]
        },
        hints: {
          zh: [
            "先諗：要去重複用邊個關鍵字？仲要諗吓點樣先可以「剔走」啲你唔想要嘅 id — 又係嗰招 subquery。",
            "加 DISTINCT，再用 AND r2.related_id != 'confucius' AND r2.related_id NOT IN (SELECT related_id FROM resonances WHERE thinker_id = 'confucius') 嚟剔走自己同已經係直接朋友嘅。",
            "偽代碼：SELECT DISTINCT r2.related_id AS two_hop FROM resonances r1 JOIN resonances r2 ON r1.related_id = r2.thinker_id WHERE r1.thinker_id = 'confucius' AND r2.related_id != 'confucius' AND r2.related_id NOT IN (SELECT related_id FROM resonances WHERE thinker_id = 'confucius')"
          ],
          en: [
            "Think first: which keyword removes duplicates? And how might you 'exclude' unwanted ids — that subquery trick from before still applies.",
            "Add DISTINCT, then AND r2.related_id != 'confucius' AND r2.related_id NOT IN (SELECT related_id FROM resonances WHERE thinker_id = 'confucius') to drop Confucius himself and his existing direct friends.",
            "Pseudocode: SELECT DISTINCT r2.related_id AS two_hop FROM resonances r1 JOIN resonances r2 ON r1.related_id = r2.thinker_id WHERE r1.thinker_id = 'confucius' AND r2.related_id != 'confucius' AND r2.related_id NOT IN (SELECT related_id FROM resonances WHERE thinker_id = 'confucius')"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "查到呢度，不如將孔子成個直接關係網一次過整靚佢，唔好淨係睇 id — 將 thinkers 接兩次（一次做起點，一次做終點），中間夾住 resonances，就會出到成句「邊個同邊個 resonate」嘅句子。",
          en: "Having got this far, it is worth laying out Confucius's whole direct network properly, not just as ids — join thinkers to itself twice (once for the start, once for the end) with resonances in between, and out comes a readable 'who resonates with whom' table."
        },
        sql: "SELECT t1.name_zh AS from_zh, t1.name_en AS from_en, t2.name_zh AS to_zh, t2.name_en AS to_en\nFROM thinkers t1\nJOIN resonances r ON t1.id = r.thinker_id\nJOIN thinkers t2 ON r.related_id = t2.id\nWHERE r.thinker_id = 'confucius' OR r.related_id = 'confucius'\nORDER BY from_en, to_en;",
        payoff: {
          zh: "七行，靚靚哋見晒：孔子出咗三箭（去伊本·魯什德、甘地、王陽明），但收到四箭 — 多咗老子單向指嚟。三張表（thinkers、resonances、再嚟多次 thinkers）砌埋一齊，個關係網終於睇得明。",
          en: "Seven readable rows: three arrows leave Confucius (to Ibn Rushd, Gandhi, Wang Yangming), but four arrive — Laozi's one-way arrow among them. Three table references — thinkers, resonances, and thinkers again — and the network finally reads in plain names."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "最尾一步：王陽明同孔子、甘地、康德嗰三個，係咪又係好似老子咁得單程飛，定係實牙實齒雙向？練習：照返上面嗰條 pattern，將主角換做王陽明，起埋佢嘅全部直接關係。",
          en: "One last check: is Wang Yangming's circle with Confucius, Gandhi, and Kant a one-way arrow like Laozi's, or fully reciprocal? Exercise: reuse the exact pattern above, swapping the subject to Wang Yangming, to lay out his whole direct network."
        },
        starter: "SELECT t1.name_zh AS from_zh, t1.name_en AS from_en, t2.name_zh AS to_zh, t2.name_en AS to_en\nFROM thinkers t1\nJOIN resonances r ON t1.id = r.thinker_id\nJOIN thinkers t2 ON r.related_id = t2.id\nWHERE r.thinker_id = 'confucius' OR r.related_id = 'confucius';",
        payoff: {
          zh: "六行，三對，每對都雙向齊全：王陽明—孔子、王陽明—康德、王陽明—甘地，一入一出冇漏。呢個先係真正嘅閉環 — 同老子嗰單程箭嘴啱啱相反，案件到呢度先算查完。",
          en: "Six rows, three pairs, every one reciprocated: Wang Yangming with Confucius, with Kant, with Gandhi — arrow out, arrow back, no gaps. This is a genuine closed loop, the mirror image of Laozi's one-way arrow, and the case can finally close."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT t1.name_zh AS from_zh, t1.name_en AS from_en, t2.name_zh AS to_zh, t2.name_en AS to_en FROM thinkers t1 JOIN resonances r ON t1.id = r.thinker_id JOIN thinkers t2 ON r.related_id = t2.id WHERE r.thinker_id = 'wang-yangming' OR r.related_id = 'wang-yangming'",
          mustContainSQL: [
            "wang-yangming"
          ]
        },
        hints: {
          zh: [
            "諗吓：上面條 query 邊兩處寫死咗 'confucius' — 呢兩處都要換過。",
            "將 WHERE r.thinker_id = 'confucius' OR r.related_id = 'confucius' 改做 WHERE r.thinker_id = 'wang-yangming' OR r.related_id = 'wang-yangming'。",
            "偽代碼：SELECT t1.name_zh AS from_zh, t1.name_en AS from_en, t2.name_zh AS to_zh, t2.name_en AS to_en FROM thinkers t1 JOIN resonances r ON t1.id = r.thinker_id JOIN thinkers t2 ON r.related_id = t2.id WHERE r.thinker_id = 'wang-yangming' OR r.related_id = 'wang-yangming'"
          ],
          en: [
            "Think about it: where in the query above is 'confucius' hard-coded — both spots need changing.",
            "Change WHERE r.thinker_id = 'confucius' OR r.related_id = 'confucius' to WHERE r.thinker_id = 'wang-yangming' OR r.related_id = 'wang-yangming'.",
            "Pseudocode: SELECT t1.name_zh AS from_zh, t1.name_en AS from_en, t2.name_zh AS to_zh, t2.name_en AS to_en FROM thinkers t1 JOIN resonances r ON t1.id = r.thinker_id JOIN thinkers t2 ON r.related_id = t2.id WHERE r.thinker_id = 'wang-yangming' OR r.related_id = 'wang-yangming'"
          ]
        }
      }
    ]
  },
  {
    id: "case4",
    title: {
      zh: "案件四：估漏咗邊個",
      en: "Case Four: Who's Missing?"
    },
    premise: {
      zh: "編輯想整一個名單：邊啲著作嘅出版年份，同莊子、老子嗰兩本冇記錄年份嘅著作唔一樣，等網站可以話俾讀者知邊幾本書實際有年份可考。落手寫個睇落好合理嘅 query，成頁竟然清晒——十七本書好似一齊人間蒸發。啲書去咗邊？",
      en: "An editor wants a simple list: which works carry a year that differs from Zhuangzi's and Laozi's undated ones, so the site can point readers to books it can actually date. Write what looks like a perfectly reasonable query, though, and the page comes back empty — as if all seventeen works had vanished at once. Where did they go?"
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "開波先，睇下 works 表總共有幾多本著作喺度。",
          en: "Start by checking how many works are sitting in the table altogether."
        },
        sql: "SELECT COUNT(*) AS total FROM works;",
        payoff: {
          zh: "十七本。呢個數要記住，遲啲會用得著。",
          en: "Seventeen. Keep that number in mind — it matters later."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "跟住搵下，邊幾本書嘅 year 係空嘅——呢個先係真正嘅線索。",
          en: "Next, find which works have no year recorded at all — that's the actual clue."
        },
        sql: "SELECT thinker_id, title_zh, title_en, year FROM works WHERE year IS NULL;",
        payoff: {
          zh: "得返莊子同老子嗰兩本：《莊子（內篇）》同《道德經》。呢個係史實，唔係整壞咗嘅資料——冇人知呢兩本書實際係邊年寫成。",
          en: "Only Zhuangzi's and Laozi's works: Zhuangzi (Inner Chapters) and the Daodejing. This is genuine history, not corrupted data — nobody knows exactly when either was written."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "編輯想要嘅名單就係咁：搵晒啲著作嘅年份唔喺莊子、老子嗰堆入面嘅。落手寫個好似好合理嘅 NOT IN，睇吓出咩。",
          en: "That's exactly the list the editor wants: every work whose year isn't among Zhuangzi's and Laozi's. Write the seemingly reasonable NOT IN, and see what comes back."
        },
        sql: "SELECT thinker_id, title_zh, year FROM works WHERE year NOT IN (SELECT year FROM works WHERE thinker_id IN ('zhuangzi', 'laozi'));",
        payoff: {
          zh: "0 行。十七本書一本都冇返嚟——冇報錯，靜雞雞就係咁多。呢個先係案件嘅核心：啲書全部『被消失』咗。",
          en: "Zero rows. Not one of the seventeen works comes back — no error, just silence. This is the heart of the case: the books have all been quietly made to disappear."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "十七本入面，真係本本都同莊子、老子撞年份？邊有咁啱嘅巧合。打開個 subquery 自己睇下佢實際攞到啲乜。",
          en: "Do all seventeen works really share a year with Zhuangzi or Laozi? That seems an unlikely coincidence. Open the subquery on its own and see exactly what it returns."
        },
        sql: "SELECT year FROM works WHERE thinker_id IN ('zhuangzi', 'laozi');",
        payoff: {
          zh: "見到未？subquery 攞返嚟嘅唔係『冇符合嘅年份』，而係兩粒實實在在嘅 NULL。SQL 同 NULL 比較，答案永遠唔係 true 又唔係 false，淨係『唔知道』——NOT IN 一旦撞到呢粒『唔知道』，成條 WHERE 就即刻人間蒸發，乜都唔剩返。",
          en: "There it is: the subquery didn't return 'no matching year' — it returned two literal NULLs. Comparing anything to NULL in SQL is never true or false, only 'unknown' — and the instant NOT IN meets that unknown, the whole WHERE clause vanishes into nothing."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "而家你要幫編輯執返呢條 query。唔好再用會撞板嘅 NOT IN，試吓用 NOT EXISTS 嚟講返同一件事：『呢本書嘅年份，喺莊子／老子嗰堆入面搵唔到一行相等嘅』。",
          en: "Time to fix the editor's query. Instead of the NOT IN that keeps tripping over NULL, use NOT EXISTS to say the same thing: 'no row among Zhuangzi's and Laozi's works shares this year.'"
        },
        starter: "SELECT thinker_id, title_zh, year FROM works WHERE year NOT IN (SELECT year FROM works WHERE thinker_id IN ('zhuangzi', 'laozi'));",
        payoff: {
          zh: "✓ 十七行全部返晒嚟——連莊子、老子自己嗰兩本都喺度。佢哋嘅年份本身就係『未知』，NULL 從來冇同任何嘢『相等』過，所以邊個都冇被錯誤咁篩走。",
          en: "All seventeen rows are back — including Zhuangzi's and Laozi's own two works. Their year is genuinely unknown, and NULL never equals anything, so nobody was wrongly filtered out."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT thinker_id, title_zh, year FROM works w WHERE NOT EXISTS (SELECT 1 FROM works z WHERE z.thinker_id IN ('zhuangzi', 'laozi') AND z.year = w.year)",
          mustContainSQL: [
            "not exists"
          ]
        },
        hints: {
          zh: [
            "問吓自己：你想搵嘅唔係『年份唔喺個名單度』，而係『搵唔到一行子查詢嘅年份同呢行相等』。",
            "用 NOT EXISTS (SELECT 1 FROM works z WHERE ...) 做相關子查詢（correlated subquery），入面拎 outer query 嘅 year 嚟比較。",
            "偽代碼：SELECT thinker_id, title_zh, year FROM works w WHERE NOT EXISTS (SELECT 1 FROM works z WHERE z.thinker_id IN ('zhuangzi', 'laozi') AND z.year = w.year)"
          ],
          en: [
            "Ask yourself: you're not after 'year not in that list' — you're after 'no subquery row exists whose year matches this one.'",
            "Use NOT EXISTS (SELECT 1 FROM works z WHERE ...) as a correlated subquery, comparing against the outer query's own year.",
            "Pseudocode: SELECT thinker_id, title_zh, year FROM works w WHERE NOT EXISTS (SELECT 1 FROM works z WHERE z.thinker_id IN ('zhuangzi', 'laozi') AND z.year = w.year)"
          ]
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "NOT EXISTS 掂咗，但如果編輯個 style guide 話一定要見到 NOT IN 呢隻字，你都唔使推翻晒成條 query——淨係喺子查詢入面剪走嗰粒 NULL 就得。試吓。",
          en: "NOT EXISTS solved it, but suppose the editor's style guide insists on keeping the word NOT IN. You don't need to rebuild the whole query — just cut the NULL out of the subquery before it can poison anything. Try it."
        },
        starter: "SELECT thinker_id, title_zh, year FROM works WHERE year NOT IN (SELECT year FROM works WHERE thinker_id IN ('zhuangzi', 'laozi'));",
        payoff: {
          zh: "✓ 一樣攞返十七行。子查詢而家淨係得返空——兩位嘅年份全部畀 IS NOT NULL 篩走咗——NOT IN 對住一個空名單，梗係乜都唔會擋。",
          en: "Same seventeen rows. The subquery is now empty — IS NOT NULL removed both of their years — and NOT IN against an empty list blocks nothing."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT thinker_id, title_zh, year FROM works WHERE year NOT IN (SELECT year FROM works WHERE thinker_id IN ('zhuangzi', 'laozi') AND year IS NOT NULL)",
          mustContainSQL: [
            "not in",
            "is not null"
          ]
        },
        hints: {
          zh: [
            "問題唔喺 NOT IN 本身，喺子查詢個結果入面混咗 NULL 入去。",
            "喺子查詢嘅 WHERE 度加多一個條件，擋住 NULL 唔畀佢入嚟。",
            "偽代碼：SELECT thinker_id, title_zh, year FROM works WHERE year NOT IN (SELECT year FROM works WHERE thinker_id IN ('zhuangzi', 'laozi') AND year IS NOT NULL)"
          ],
          en: [
            "The problem isn't NOT IN itself — it's that the subquery's result set contains a NULL.",
            "Add one more condition to the subquery's WHERE clause to keep NULL out.",
            "Pseudocode: SELECT thinker_id, title_zh, year FROM works WHERE year NOT IN (SELECT year FROM works WHERE thinker_id IN ('zhuangzi', 'laozi') AND year IS NOT NULL)"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "收工前補一刀：NOT IN 本身唔係衰人，淨係當個 subquery 入面冇 NULL，佢照樣做得妥妥當當。試吓攞卡繆自己兩本著作嘅年份嚟做 subquery——兩本都係 1942，冇 NULL。",
          en: "One last thing before closing the case: NOT IN was never the villain. When its subquery is NULL-free, it behaves perfectly. Try it with Camus's own two works as the subquery — both dated 1942, no NULL in sight."
        },
        sql: "SELECT thinker_id, title_zh, year FROM works WHERE year NOT IN (SELECT year FROM works WHERE thinker_id = 'camus') ORDER BY thinker_id;",
        payoff: {
          zh: "呢次得返十三行。卡繆自己兩本梗係唔見（同 1942 相等，篩走啱），但連莊子、老子嗰兩本都一齊消失埋——佢哋嘅 year 本身係 NULL，同任何數字比較（包括呢個 1942）一樣係『唔知道』，所以連佢哋自己嗰兩行都畀 WHERE 蒸發咗。NULL 唔止會毒害成個 subquery，都會靜雞雞毒害佢自己嗰行。",
          en: "This time you get thirteen rows. Camus's own two works are correctly gone (equal to 1942), but Zhuangzi's and Laozi's two works vanish too — their own year is NULL, and NULL compared against anything, even a clean 1942, is still 'unknown', so WHERE quietly drops their rows as well. NULL doesn't just poison the subquery side; it poisons its own row just as silently."
        }
      }
    ]
  },
  {
    id: "case5",
    title: {
      zh: "案件五：分類分級",
      en: "Case Five: Sort, Grade, Rank"
    },
    premise: {
      zh: "網站編輯話而家個 database 大到唔可以掟喺度由得讀者自己揭，佢想要一份「分類目錄」：邊班人嚟自邊度、邊篇文章原來唔止得一個主角、邊個世代先夠格叫「古代」，仲有同鄉之中邊個資歷最深。呢份目錄，就要由你用 SQL 起。",
      en: "The site's editor says the archive has grown too large to leave for readers to sift through unaided, and wants a proper \"sorting guide\": where each thinker is from, which essays turn out to have more than one lead, which century counts as \"Ancient,\" and who is senior among thinkers sharing a region. Building that guide, in SQL, is your job."
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "第一項工作：整理地域分佈。落 GROUP BY region_zh，計吓每個地方出咗幾多位思想家，順便計埋佢哋出世年份嘅平均數。",
          en: "First job: sort by region. GROUP BY region_zh, count how many thinkers per place, and throw in the average birth year while you're at it."
        },
        sql: "SELECT region_zh, COUNT(*) AS cnt, AVG(born_year) AS avg_born\nFROM thinkers\nGROUP BY region_zh\nORDER BY cnt DESC, region_zh;",
        payoff: {
          zh: "睇清楚啲數：十六位思想家，十六個唔同嘅地方——冇兩個係同鄉。仲有，老子嗰行 avg_born 係 NULL，因為佢個人出世年本身就係 NULL，一個人嘅組冇嘢好平均。",
          en: "Look closely: sixteen thinkers, sixteen different places — no two share a region. And Laozi's row shows avg_born as NULL, because his own born_year is NULL to begin with; there is nothing to average in a group of one."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "地域呢條線索死咗。轉個方向：呢個 site 淨係將某啲思想家放埋入同一篇 essay 度（essays 表），即係話有啲『文章』其實可能唔止得一個主角。搵出邊啲 essay 嘅 thinker_id 數目多過一個。",
          en: "The region angle is a dead end. Try another route: this site groups certain thinkers under the same essay (the essays table) — meaning some of these \"essays\" credit more than one lead. Find which essays have more than one thinker_id attached."
        },
        starter: "SELECT slug, COUNT(*) AS n_thinkers\nFROM essays\nGROUP BY slug;",
        payoff: {
          zh: "篩到五篇『大合照』：『橋上悖論』一次過影咗五位；『推石頭之人』、『飽飯』、『貓老師』、『做乜諗嘢唔食飯？』就各自兩位。淨返嗰三篇——『蠟燭花』、『地之盡頭大風吹』、『喜士定無戰事』——先係獨腳戲。",
          en: "Five essays turn out to be group shots: \"Paradox over the Footbridge\" alone credits five; \"He Who Pushes the Stone\", \"A Profound Satiety\", \"The Cat Teachers\" and \"Why Overthink on an Empty Stomach?\" each have two. Only \"Candle Blossoms\", \"Land's End\" and \"All Quiet at Hastings\" remain solo pieces."
        },
        validate: {
          type: "columns",
          expectedSQL: "SELECT slug, COUNT(*) AS n_thinkers FROM essays GROUP BY slug HAVING COUNT(*) > 1",
          columns: [
            "slug",
            "n_thinkers"
          ],
          mustContainSQL: [
            "having"
          ]
        },
        hints: {
          zh: [
            "諗吓你想搵嘅係邊『組』嘅數目大過一，即係要喺 GROUP BY 之後再篩選返個組，唔係篩返啲原始行。",
            "WHERE 淨係可以喺分組之前篩行；你想篩嘅係 COUNT(*) 呢個聚合結果，呢種情況要用 HAVING。",
            "偽代碼：SELECT slug, COUNT(*) AS n_thinkers FROM essays GROUP BY slug HAVING COUNT(*) > 1"
          ],
          en: [
            "Think about which \"groups\" you want — the ones whose count is greater than one, filtered after grouping, not the raw rows before it.",
            "WHERE only filters rows before grouping; to filter on the aggregate COUNT(*) itself you need HAVING.",
            "Pseudocode: SELECT slug, COUNT(*) AS n_thinkers FROM essays GROUP BY slug HAVING COUNT(*) > 1"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "『橋上悖論』先係今次最大條線索。用 essays JOIN thinkers，睇吓入面實際係邊五個人。",
          en: "\"Paradox over the Footbridge\" is the biggest lead. JOIN essays to thinkers and see exactly who the five are."
        },
        sql: "SELECT t.name_zh, t.name_en\nFROM essays e\nJOIN thinkers t ON t.id = e.thinker_id\nWHERE e.slug = 'footbridge-paradox';",
        payoff: {
          zh: "康德、波娃、法農、彌爾、杜波依斯——義務論、存在主義、後殖民思想、效益主義、種族理論，全部畀呢條橋上嘅二選一難題拉埋一齊。呢個 site 揀嘅係將佢哋擺喺同一篇度討論，唔係話佢哋歷史上真係開過會。",
          en: "Kant, Beauvoir, Fanon, Mill and Du Bois — deontology, existentialism, postcolonial thought, utilitarianism and race theory, all conscripted by the same footbridge dilemma. The site chooses to discuss them together in one essay; it is not a claim that they ever historically convened."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "地域搵唔到規律，文章又睇完。不如換個角度分類——跨『年代』分級：邊個係『古代』、邊個係『前現代』、邊個係『現代』？老子出世同過身年份都係 NULL，落手前要諗清楚點處理佢。",
          en: "Region led nowhere and the essays are covered. Try sorting by era instead — who counts as \"Ancient,\" \"Pre-modern,\" or \"Modern\"? Laozi's born_year and died_year are both NULL, so decide how to handle that before you write anything."
        },
        starter: "SELECT id, died_year,\n  CASE WHEN died_year < 0 THEN '古代'\n       ELSE '現代'\n  END AS era\nFROM thinkers;",
        payoff: {
          zh: "分級要企得住腳，唔可以由 ELSE 白撞老子個 NULL——所以要專門加一條 IS NULL 判斷，畀佢自己有個『無法考證』級，唔係亂咁塞落其他級度。",
          en: "The tiers only hold up if Laozi's NULL doesn't fall through to ELSE by accident — hence the dedicated IS NULL branch, giving him his own \"Undated\" tier rather than a guess."
        },
        validate: {
          type: "columns",
          expectedSQL: "SELECT id, died_year, CASE WHEN died_year IS NULL THEN '無法考證' WHEN died_year < 0 THEN '古代' WHEN died_year < 1700 THEN '前現代' ELSE '現代' END AS era FROM thinkers",
          columns: [
            "id",
            "died_year",
            "era"
          ],
          mustContainSQL: [
            "case",
            "when",
            "is null"
          ]
        },
        hints: {
          zh: [
            "諗吓總共要分幾多級——唔只得『古代』同『現代』兩級，中間仲有一級『前現代』，仲有老子個 NULL 要諗清楚擺喺邊。",
            "CASE WHEN 由上至下逐個試，中咗就唔再睇後面；記得將 died_year IS NULL 嗰個判斷擺得夠早，唔好等跌落 ELSE 先撞到佢。",
            "偽代碼：CASE WHEN died_year IS NULL THEN '無法考證' WHEN died_year < 0 THEN '古代' WHEN died_year < 1700 THEN '前現代' ELSE '現代' END AS era"
          ],
          en: [
            "Work out how many tiers you actually need — not just \"Ancient\" and \"Modern,\" there is a \"Pre-modern\" tier in between, and Laozi's NULL needs a deliberate home.",
            "CASE WHEN tries conditions top to bottom and stops at the first match; put the died_year IS NULL check early enough that it never falls through to ELSE by accident.",
            "Pseudocode: CASE WHEN died_year IS NULL THEN 'Undated' WHEN died_year < 0 THEN 'Ancient' WHEN died_year < 1700 THEN 'Pre-modern' ELSE 'Modern' END AS era"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "分級表寫好，宜家數吓每級有幾多人——將 CASE WHEN 個結果包做 subquery，再 GROUP BY 嗰個 era。",
          en: "With the tiers written, count how many land in each — wrap the CASE WHEN result as a subquery and GROUP BY the era."
        },
        sql: "SELECT era, COUNT(*) AS cnt FROM (\n  SELECT id,\n    CASE WHEN died_year IS NULL THEN '無法考證'\n         WHEN died_year < 0 THEN '古代'\n         WHEN died_year < 1700 THEN '前現代'\n         ELSE '現代'\n    END AS era\n  FROM thinkers\n)\nGROUP BY era\nORDER BY cnt DESC;",
        payoff: {
          zh: "現代 9 位、古代 4 位、前現代 2 位，老子獨自一級。冇邊級一係得返得一個人，一係吞晒成班人，分得算幾平衡。",
          en: "Nine Modern, four Ancient, two Pre-modern, and Laozi alone in his own tier. No bucket is left with just one person, and none swallows the whole crowd — a reasonably even split."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "最後一項：『同鄉排名』——喺每個 region_zh 入面，按 born_year 由細去大排返先後次序。用 RANK() OVER (PARTITION BY ... ORDER BY ...)。",
          en: "Last job: a \"local seniority\" ranking — inside each region_zh, order thinkers by born_year using RANK() OVER (PARTITION BY ... ORDER BY ...)."
        },
        starter: "SELECT id, region_zh, born_year\nFROM thinkers;",
        payoff: {
          zh: "十六行，rnk 全部係 1。唔係你寫錯——呢個就係第一步搵到嗰個事實嘅另一種講法：冇兩個人同鄉，每個 partition 淨係得一個人，梗係自己就係第一。",
          en: "All sixteen rows come back rnk = 1. That is not a mistake — it is the same fact from step one, restated: with no two thinkers sharing a region, every partition holds exactly one person, who is trivially first."
        },
        validate: {
          type: "columns",
          expectedSQL: "SELECT id, region_zh, born_year, RANK() OVER (PARTITION BY region_zh ORDER BY born_year) AS rnk FROM thinkers",
          columns: [
            "id",
            "region_zh",
            "born_year",
            "rnk"
          ],
          mustContainSQL: [
            "partition by",
            "rank("
          ]
        },
        hints: {
          zh: [
            "PARTITION BY 定義邊班人先要放埋一齊排；ORDER BY 就係嗰組入面點排先後次序。",
            "寫法係 RANK() OVER (PARTITION BY region_zh ORDER BY born_year)，成句擺喺 SELECT 嗰粒 column 度，同 COUNT(*) 唔同，唔會令啲行縮埋一齊。",
            "偽代碼：SELECT id, region_zh, born_year, RANK() OVER (PARTITION BY region_zh ORDER BY born_year) AS rnk FROM thinkers"
          ],
          en: [
            "PARTITION BY decides which rows get grouped together for ranking; ORDER BY decides the order inside each group.",
            "The form is RANK() OVER (PARTITION BY region_zh ORDER BY born_year), written as one expression in the SELECT list — unlike COUNT(*), it doesn't collapse the rows.",
            "Pseudocode: SELECT id, region_zh, born_year, RANK() OVER (PARTITION BY region_zh ORDER BY born_year) AS rnk FROM thinkers"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "排名呢招喺 region_zh 度使唔出嚟，不如試吓唔分組，齋按 born_year 由細去大幫全部十六人排一次。留意最頭嗰個係邊個。",
          en: "Ranking by region turned up nothing new; try it without partitioning at all — order all sixteen by born_year ascending, and see who lands first."
        },
        sql: "SELECT id, born_year, RANK() OVER (ORDER BY born_year) AS rnk\nFROM thinkers\nORDER BY rnk;",
        payoff: {
          zh: "排第一嘅係老子——佢個 born_year 明明係 NULL。SQLite 遇著由細去大嘅 ORDER BY，會將 NULL 當做比任何數字都細，所以擺咗喺最前。呢個係 SQLite 喺呢個真實 build 度嘅實際行為，唔係話老子歷史上真係『最早出世』——佢個出世年根本冇記錄落嚟，千祈唔好將呢個排名讀成史實。",
          en: "The row ranked first is Laozi — whose born_year is NULL. In ascending ORDER BY, SQLite treats NULL as smaller than any real number, so it sorts to the front. That is genuine SQLite behaviour verified on this real build, not a claim that Laozi was historically \"born first\" — his birth year was simply never recorded, and this ranking should not be mistaken for history."
        }
      }
    ]
  },
  {
    id: "case6",
    title: {
      zh: "案件六：資料唔靠得住",
      en: "Case 6: Data You Can't Rely On"
    },
    premise: {
      zh: "有讀者寄信嚟話，見到老子嗰行 born_year 同 died_year 兩欄都係空嘅，仲問你個 database 係咪整壞咗資料。你要落手查清楚：呢個係唔係打漏咗嘢，定係老子生卒年呢個問題，連歷史學界自己都仲未有定案。",
      en: "A reader has written in to say Laozi's row has both born_year and died_year blank, and wants to know whether the database itself is broken. Time to look into it properly: is this missing data entry, or is Laozi's very date of birth and death still an open question among historians."
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "第一步，梗係要核實吓讀者講嘅係咪屬實。用 IS NULL 揾出邊個思想家嘅 born_year 係唔知嘅。",
          en: "First, verify the claim itself. Use IS NULL to find which thinker actually has an unknown born_year."
        },
        sql: "SELECT id, name_zh, name_en, born_year, died_year FROM thinkers WHERE born_year IS NULL;",
        payoff: {
          zh: "真係得一個人——老子。成個表冇散，係佢一行嘅事。",
          en: "Only one person: Laozi. The rest of the table is intact; this is one row, not a wholesale failure."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "睇吓老子行嘅其他資料仲喺唔喺度先——如果連 epithet、quote、佢著作嘅年份都一齊冇埋，先真係要懷疑係漏咗成舊嘢資料；如果唔係，就可能係另一個故事。",
          en: "Check whether the rest of Laozi's record is intact — if the epithet, the quote, and even his work's year were all missing too, that would suggest a genuinely broken entry rather than something else."
        },
        sql: "SELECT t.id, t.name_zh, t.name_en, t.epithet_zh, t.epithet_en, t.quote_zh, t.quote_en, t.born_year, t.died_year, w.title_zh, w.title_en, w.year FROM thinkers t JOIN works w ON w.thinker_id = t.id WHERE t.id = 'laozi';",
        payoff: {
          zh: "老子嘅 epithet、quote 全部齊全，淨係得 born_year、died_year，連埋佢本人著作《道德經》嗰個 year，一齊係 NULL。呢個唔係打錯字，係老子呢個人物幾時生、幾時死，甚至《道德經》幾時成書，喺歷史學界本身都仲有爭議——連本書都冇一個實實在在嘅成書年份。",
          en: "Laozi's epithet and quote are both present; only born_year, died_year, and even the year of his own work the Daodejing are NULL. This is not a typo. When Laozi lived, and when the Daodejing was actually composed, remain genuinely disputed among historians — even the book has no settled date."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "練習：唔好淨係信自己個假設。用 IS NULL 一次過檢查 born_year 同 died_year 兩欄，睇吓成個 thinkers 表入面，係咪真係得返老子一個人有呢個問題。",
          en: "Exercise: do not simply trust your first assumption. Check both born_year and died_year with IS NULL together, to confirm Laozi really is the only affected row in the whole table."
        },
        starter: "SELECT id, name_zh, name_en, born_year, died_year FROM thinkers WHERE born_year IS NULL;",
        payoff: {
          zh: "兩欄一齊查，結果都係得返老子一個。查清楚咗：呢個 table 冇散，淨係老子嗰行，係歷史問題，唔係你個 database 嘅問題。",
          en: "Checking both columns together still returns only Laozi. Confirmed: the table is not broken. This one row is a historical question, not a database one."
        },
        validate: {
          type: "sql",
          expectedSQL: "SELECT id, name_zh, name_en, born_year, died_year FROM thinkers WHERE born_year IS NULL OR died_year IS NULL;"
        },
        hints: {
          zh: [
            "諗吓：如果得 died_year 唔知，但 born_year 有資料，呢條 starter query 會唔會漏咗嗰行？",
            "用 OR 將兩個 IS NULL 條件連埋一齊查。",
            "偽代碼：SELECT id, name_zh, name_en, born_year, died_year FROM thinkers WHERE born_year IS NULL OR died_year IS NULL"
          ],
          en: [
            "Think about it: if only died_year were missing while born_year was present, would this starter miss that row?",
            "Combine both IS NULL checks with OR.",
            "Pseudocode: SELECT id, name_zh, name_en, born_year, died_year FROM thinkers WHERE born_year IS NULL OR died_year IS NULL"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "而家轉去計啲實在嘅嘢：每位思想家死嗰陣幾多歲（died_year - born_year）。留意呢種減數對負數（BCE 年份）一樣 work，例如孔子。",
          en: "Now for something more concrete: each thinker's age at death (died_year - born_year). Note that this simple subtraction works correctly even for negative (BCE) years, as with Confucius."
        },
        sql: "SELECT id, name_zh, name_en, born_year, died_year, died_year - born_year AS age_at_death FROM thinkers ORDER BY age_at_death;",
        payoff: {
          zh: "孔子：-479 減 (-551) = 72歲，計啱嘅。但老子嗰行呢？born_year 同 died_year 都係 NULL，個減數自動變成 NULL，仲排咗喺最上面——SQL 唔會嗌錯，佢淨係靜靜雞唔計得，你自己要留心先睇得出。",
          en: "Confucius: -479 minus -551 equals 72, correctly computed. But Laozi's row, with both born_year and died_year NULL, has the subtraction quietly resolve to NULL — and it sorts to the very top. SQL raises no error; it simply fails to compute, and only careful reading catches it."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "呢種「靜靜雞唔計得」嘅情況，喺 works 表都一樣出現。假設你想整一份「呢本書出咗幾多年」嘅報告——但《莊子》內篇同《道德經》兩本書都冇 year。用 COALESCE 幫個空白位擺返一句講得通嘅字，先唔會喺報告度見到一堆數字之後，突然斷咗。",
          en: "The same silent failure shows up in the works table. Suppose you want a \"years since publication\" report — but both the Zhuangzi Inner Chapters and the Daodejing have no year. Use COALESCE to give those blanks a sensible label, rather than leaving a report of figures that simply stops mid-list."
        },
        sql: "SELECT thinker_id, title_zh, title_en, year, COALESCE(CAST(2026 - year AS TEXT), '年份不詳，無法計算') AS years_since_label FROM works ORDER BY thinker_id;",
        payoff: {
          zh: "而家見到，大部份作品都有實際年數（例如康德《純粹理性批判》245年），但《莊子》同《道德經》就顯示「年份不詳，無法計算」——讀報告嘅人一眼睇到就知係缺資料，唔會誤會做個計算本身壞咗。",
          en: "Every work with a known year now shows a real figure (Kant's Critique of Pure Reason: 245 years), while the Zhuangzi and the Daodejing display \"date uncertain, cannot be computed\" — a reader can tell instantly this is missing data, not a broken calculation."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "練習：用返同一招，幫 thinkers 表整一條「顯示用」嘅出生年欄——born_year 有資料就照跟，冇資料（即係老子）就顯示「年份不詳」。",
          en: "Exercise: apply the same trick to the thinkers table. Build a display-ready birth-year column that shows the real value where known, and the label \"unknown\" for Laozi."
        },
        starter: "SELECT id, name_zh, name_en, born_year FROM thinkers;",
        payoff: {
          zh: "老子而家顯示「年份不詳」，唔係一格空白——之後隨便邊個界面攞呢條 query 出嚟 display，都唔會靜靜雞留低一個怪異嘅空格畀用家自己估。",
          en: "Laozi now reads \"unknown\", not a blank cell. Whichever interface pulls this query will no longer leave a strange gap for the user to puzzle over."
        },
        validate: {
          type: "columns",
          expectedSQL: "SELECT id, name_zh, name_en, COALESCE(CAST(born_year AS TEXT), '年份不詳') AS born_year_label FROM thinkers;",
          columns: [
            "id",
            "name_zh",
            "name_en",
            "born_year_label"
          ]
        },
        hints: {
          zh: [
            "諗吓：COALESCE 嘅兩個參數要係同一種 type，但 born_year 係 INTEGER，你想擺返去嗰個 fallback 就係文字。",
            "用 CAST(born_year AS TEXT) 將個數字轉做文字，先可以同 fallback 字串一齊擺入 COALESCE。",
            "偽代碼：SELECT id, name_zh, name_en, COALESCE(CAST(born_year AS TEXT), '年份不詳') AS born_year_label FROM thinkers"
          ],
          en: [
            "Think about it: COALESCE's two arguments should share a type, but born_year is an INTEGER while your fallback is text.",
            "Use CAST(born_year AS TEXT) to turn the number into text first, so it can sit alongside the fallback string in COALESCE.",
            "Pseudocode: SELECT id, name_zh, name_en, COALESCE(CAST(born_year AS TEXT), '年份不詳') AS born_year_label FROM thinkers"
          ]
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "案件去到呢度，已經清楚：老子嘅生卒年，唔係打錯，而係佢個人喺歷史上本身就有爭議。但莊子唔同——莊子確實有 born_year（-369），不過學界對呢班先秦人物嘅確實年份，一路都有唔同講法。假設你有個治先秦思想史嘅朋友，寄咗篇新論文畀你，將莊子傳統引用嘅出生年收窄咗去 -365 年。你要做嘅唔係「修正錯誤」——莊子原本嗰個 -369 冇壞——而係記錄一項新資訊。記住：淨係更新莊子嗰一行。",
          en: "By now the case is clear: Laozi's missing dates are not a typo but a genuine historical dispute. Zhuangzi is different — he already has a born_year (-369), though scholars have long offered slightly different figures for Warring States-era dates. Suppose a classicist friend sends you a new paper narrowing Zhuangzi's traditionally-cited birth year to -365. The task here is not to \"fix an error\" — the existing -369 was never broken — but to record a new piece of information. Remember: update only Zhuangzi's row."
        },
        starter: "-- 記得：淨係更新莊子嗰一行，唔好郁到第啲思想家。\nUPDATE thinkers SET born_year = -365;\n",
        payoff: {
          zh: "莊子而家係 -365，孔子仲係 -551，冇被拖落水。案件收工：老子嘅空白留返畀歷史學界，莊子嘅新資訊就安安穩穩記錄咗落嚟——兩種「唔靠得住」，一種要尊重佢仲未有答案，一種要負責任噉樣更新。",
          en: "Zhuangzi now reads -365; Confucius remains untouched at -551. Case closed: Laozi's blank stays exactly where it belongs, left to the historians, while Zhuangzi's new information has been recorded with care. Two different kinds of \"unreliable data\" — one to be respected as still unresolved, the other to be updated responsibly."
        },
        validate: {
          type: "fix",
          mustContainSQL: [
            "update",
            "where"
          ],
          checkSQL: "SELECT id, born_year FROM thinkers WHERE id IN ('zhuangzi','confucius','camus') ORDER BY id;",
          columns: [
            "id",
            "born_year"
          ],
          expectedValues: [
            [
              "camus",
              1913
            ],
            [
              "confucius",
              -551
            ],
            [
              "zhuangzi",
              -365
            ]
          ]
        },
        hints: {
          zh: [
            "諗吓：呢句 UPDATE 而家冇 WHERE，會唔會連孔子個 born_year 都一齊被你改埋？",
            "用 WHERE id = 'zhuangzi' 將呢句 UPDATE 鎖定喺莊子嗰一行。",
            "偽代碼：UPDATE thinkers SET born_year = -365 WHERE id = 'zhuangzi';"
          ],
          en: [
            "Think about it: with no WHERE clause, would this UPDATE also overwrite Confucius's born_year?",
            "Add WHERE id = 'zhuangzi' to scope the UPDATE to Zhuangzi's row alone.",
            "Pseudocode: UPDATE thinkers SET born_year = -365 WHERE id = 'zhuangzi';"
          ]
        }
      }
    ]
  },
  {
    id: "case7",
    title: {
      zh: "案件七：一次過睇晒",
      en: "Case 7: See It All At Once"
    },
    premise: {
      zh: "編輯部話依家每次交報告都要開幾條 query 慢慢夾數，好費時——佢哋想要嘅係一次過攞晒啲乾淨數字，仲要有齊「有著作」同「冇著作」嗰兩批思想家嘅名單，唔使分開睇。",
      en: "The editorial desk is tired of you running several separate queries and manually reconciling the numbers for every report — they want the clean figures pulled in one go, plus a single roster covering both those who left a written work behind and those who did not."
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "檔案室要求一份「乾淨版」嘅資料先可以計後續嘅嘢——但十六位思想家入面，會唔會有邊個嘅出生／死亡年份根本冇記錄？",
          en: "Before anything else can be computed, the archive wants to know: among the sixteen thinkers, does anyone actually lack a recorded birth or death year?"
        },
        sql: "SELECT id, name_zh, name_en, born_year, died_year FROM thinkers WHERE born_year IS NULL OR died_year IS NULL;",
        payoff: {
          zh: "得返老子一個——佢冇實際生卒年，係史學界公認嘅懸案，唔係你資料庫爛咗。",
          en: "Only Laozi turns up — his birth and death years are a genuine open question in scholarship, not a broken database."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "咁而家診斷有幾多位剩返「有齊生卒年」嘅——如果之後仲要計呢批人嘅平均在世歲數，個 WHERE 係咪要抄多次先得？",
          en: "Now check how many thinkers remain once both years are required to be present — and note that if a follow-up figure is also needed from this same group, must that WHERE be typed out twice?"
        },
        sql: "SELECT COUNT(*) FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL;",
        payoff: {
          zh: "十五位——除咗老子之外全部有齊年份。但如果落一步仲要計佢哋嘅平均歲數，呢句 WHERE 就要抄多次，好囉嗦，仲容易兩邊寫得唔一致。",
          en: "Fifteen — everyone except Laozi. But if the next step also needs an average from that same group, retyping that WHERE is tedious, and risks the two copies quietly drifting apart."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "用一個 WITH clean_rows AS (...) 將「生卒年齊全」嘅思想家改埋名，一次過喺呢個 CTE 度計 COUNT 又計佢哋嘅平均在世歲數（AVG(died_year - born_year)），唔使個 WHERE 寫兩次。輸出：documented_count, avg_age_at_death。",
          en: "Use a single WITH clean_rows AS (...) to name the thinkers with a fully-known lifespan, then compute both a COUNT and their average years lived — AVG(died_year - born_year) — from that one CTE, without typing the WHERE twice. Columns: documented_count, avg_age_at_death."
        },
        starter: "WITH clean_rows AS (\n  SELECT born_year, died_year FROM thinkers\n  WHERE \n)\n\nSELECT COUNT(*) AS documented_count, AVG(",
        payoff: {
          zh: "十五位有齊生卒年嘅思想家，平均在世大約69.5年（呢個只係粗略計法——歷史紀年冇「0年」呢回事，但用嚟睇個大勢已經夠）。",
          en: "Fifteen thinkers have a fully-known lifespan, averaging roughly 69.5 years (a rough figure only — there was no year zero in the calendars involved — but good enough to see the trend)."
        },
        validate: {
          type: "columns",
          expectedSQL: "WITH clean_rows AS (\n  SELECT born_year, died_year FROM thinkers\n  WHERE born_year IS NOT NULL AND died_year IS NOT NULL\n)\nSELECT COUNT(*) AS documented_count, AVG(died_year - born_year) AS avg_age_at_death FROM clean_rows",
          columns: [
            "documented_count",
            "avg_age_at_death"
          ],
          mustContainSQL: [
            "with",
            "is not null"
          ]
        },
        hints: {
          zh: [
            "諗吓：呢次想由同一批「乾淨」思想家度，一次過攞 COUNT 又攞平均歲數，個篩選條件駛唔駛喺兩條 query 度各寫一次？",
            "用 WITH clean_rows AS (SELECT born_year, died_year FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL) 將個已篩選結果改名，跟住主 query 淨係 SELECT COUNT(*) AS documented_count, AVG(died_year - born_year) AS avg_age_at_death FROM clean_rows。",
            "偽代碼：WITH clean_rows AS (SELECT born_year, died_year FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL) SELECT COUNT(*) AS documented_count, AVG(died_year - born_year) AS avg_age_at_death FROM clean_rows"
          ],
          en: [
            "Think about it: you need both a COUNT and an average age from the same clean group of thinkers — must that filter be written out twice, in two separate queries?",
            "Use WITH clean_rows AS (SELECT born_year, died_year FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL) to name the already-filtered rows, then let the outer query simply SELECT COUNT(*) AS documented_count, AVG(died_year - born_year) AS avg_age_at_death FROM clean_rows.",
            "Pseudocode: WITH clean_rows AS (SELECT born_year, died_year FROM thinkers WHERE born_year IS NOT NULL AND died_year IS NOT NULL) SELECT COUNT(*) AS documented_count, AVG(died_year - born_year) AS avg_age_at_death FROM clean_rows"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "報告仲有一項要交代：邊幾位思想家根本冇留低過親筆著作？用 NOT EXISTS 喺 works 表度搵。",
          en: "The report also needs to flag something else: which thinkers left behind no personally-authored work at all? Use NOT EXISTS against the works table to find out."
        },
        sql: "SELECT t.id, t.name_zh, t.name_en FROM thinkers t\nWHERE NOT EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)\nORDER BY t.id;",
        payoff: {
          zh: "得返三位：孔子、佛陀、蘇格拉底——三個都係史上有記載嘅「述而不作」，冇親手留低文字著作，呢個係史實，唔係資料庫瑕疵。",
          en: "Just three: Confucius, the Buddha, and Socrates — each is well documented as having personally written nothing down. That is a genuine historical fact, not a gap in the data."
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "而家要將呢兩批人整埋做一張名單：用 UNION 將「有著作」(has_works) 同「冇著作」(no_works) 嘅思想家疊埋一齊，加返個 status 欄註明邊個係邊。輸出：status, name。",
          en: "Now merge both groups into one roster: use UNION to stack thinkers who have at least one recorded work (has_works) with those who have none (no_works), tagging each half with a status column. Columns: status, name."
        },
        starter: "SELECT \n  \nFROM thinkers t\nWHERE \n\nUNION\n\nSELECT \n  \nFROM thinkers t\nWHERE ",
        payoff: {
          zh: "十六行，一個都冇走漏：十三位有著作，三位冇。",
          en: "Sixteen rows, nobody missing: thirteen with works, three without."
        },
        validate: {
          type: "columns",
          expectedSQL: "SELECT 'has_works' AS status, name_zh AS name FROM thinkers t WHERE EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)\nUNION\nSELECT 'no_works' AS status, name_zh AS name FROM thinkers t WHERE NOT EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)",
          columns: [
            "status",
            "name"
          ],
          mustContainSQL: [
            "union"
          ],
          mustNotContainSQL: [
            "union all"
          ]
        },
        hints: {
          zh: [
            "諗吓：你想將「有著作」嗰班同「冇著作」嗰班變做一張名單，兩個 SELECT 之間要用邊個 keyword 疊埋？",
            "兩邊都揀一個文字 literal 做 status（例如 'has_works' AS status）同 name_zh AS name，中間寫 UNION；分邊嘅條件就用 EXISTS / NOT EXISTS 對住 works 表嚟判斷。",
            "偽代碼：SELECT 'has_works' AS status, name_zh AS name FROM thinkers t WHERE EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id) UNION SELECT 'no_works' AS status, name_zh AS name FROM thinkers t WHERE NOT EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)"
          ],
          en: [
            "Think about it: you want to turn the has-works group and the no-works group into one list — which keyword stacks two SELECTs together?",
            "On both sides select a literal status column (e.g. 'has_works' AS status) alongside name_zh AS name, with UNION in between; use EXISTS / NOT EXISTS against the works table to decide which side each thinker belongs to.",
            "Pseudocode: SELECT 'has_works' AS status, name_zh AS name FROM thinkers t WHERE EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id) UNION SELECT 'no_works' AS status, name_zh AS name FROM thinkers t WHERE NOT EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "案件標題係「一次過睇晒」——就用返上面嗰個 has_works／no_works 分類，一條 query 同時攞返 UNION 同 UNION ALL 嘅行數，睇下呢兩批人有冇真正重複嘅列。",
          en: "True to this case's title — see it all at once — reuse the has_works/no_works split and pull both the UNION and UNION ALL row counts in a single query, to check whether any row is a genuine duplicate across the two halves."
        },
        sql: "SELECT\n  (SELECT COUNT(*) FROM (\n     SELECT 'has_works' AS status, id FROM thinkers t WHERE EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)\n     UNION\n     SELECT 'no_works' AS status, id FROM thinkers t WHERE NOT EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)\n  )) AS union_count,\n  (SELECT COUNT(*) FROM (\n     SELECT 'has_works' AS status, id FROM thinkers t WHERE EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)\n     UNION ALL\n     SELECT 'no_works' AS status, id FROM thinkers t WHERE NOT EXISTS (SELECT 1 FROM works w WHERE w.thinker_id = t.id)\n  )) AS union_all_count;",
        payoff: {
          zh: "兩個都係16——即係話冇一行係真正重複嘅。因為「有著作」同「冇著作」本身就係互斥類別，UNION 嘅去重功能喺呢度其實冇嘢好剔，但寫法都要啱先可以疊到——結案。",
          en: "Both come to sixteen — meaning no row is a genuine duplicate. Since has_works and no_works are mutually exclusive categories to begin with, UNION's deduplication never actually has anything to remove here — but the syntax still had to be correct for the stacking to work. Case closed."
        }
      }
    ]
  },
  {
    id: "case8",
    title: {
      zh: "案件八：查案要快",
      en: "Case Eight: The Need for Speed"
    },
    premise: {
      zh: "又有爆料入嚟：「嗰個喺法國嘅思想家有嫌疑，你快啲同我搵佢出嚟。」你手起刀落，落 SQL 搵到個人，本來可以收工——但你諗多一層：而家呢個檔案室得十六個人先咁快搵到，如果第日呢度有十萬個檔案，你依家用緊嘅呢種搵法，係咪仲係咁快？呢單案唔係查邊個做過乜嘢，而係查資料庫自己點樣去搵嘢。",
      en: "Another tip has come in: \"the thinker based in France is worth a look — find them, fast.\" You fire off a query, get your answer, and could call it a day — except a thought nags at you: this room only has sixteen thinkers, which is why the lookup felt instant. If it ever held a hundred thousand case files, would the same method still be quick? This case is not about who did what; it is about how the database itself goes looking for things."
    },
    steps: [
      {
        kind: "demo",
        lead: {
          zh: "開波之前，你想知呢間「檔案室」而家有幾大——先數下有幾多位思想家記錄在案。",
          en: "Before anything else, you want to know how large this case-file room actually is — start by counting how many thinkers are on record."
        },
        sql: "SELECT COUNT(*) FROM thinkers;",
        payoff: {
          zh: "十六個人。細細個檔案室，但呢單案嘅重點唔係大細，而係搵法。",
          en: "Sixteen. A small room — but the point of this case is not size, it is method."
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "熱線嗰位話「嗰個喺法國嘅思想家」。落單，直接用 region_zh 篩返個人出嚟。",
          en: "The tipster said \"the thinker based in France.\" Put it straight into a filter on region_zh and see who comes up."
        },
        sql: "SELECT id, name_zh, name_en, region_zh FROM thinkers WHERE region_zh = '法國';",
        payoff: {
          zh: "得咗，係西蒙·德·波娃。條數好準——但你諗多一層：SQLite 啱啱係喺十六行入面點樣搵到呢一行嘅？",
          en: "Found her — Simone de Beauvoir. The answer is exact, but a question nags: how exactly did SQLite find this one row among the sixteen?"
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "唔好淨係攞答案——今次要打開資料庫個「思路」。喺同一條 WHERE region_zh = '法國' 嘅查詢前面，加 EXPLAIN QUERY PLAN，睇下佢實際上點樣去搵。",
          en: "Do not just take the answer — this time, open up the database's own train of thought. Put EXPLAIN QUERY PLAN in front of the very same WHERE region_zh = '法國' lookup and see how it actually searches."
        },
        starter: "SELECT * FROM thinkers WHERE region_zh = '法國';",
        payoff: {
          zh: "出返嚟嘅係 SCAN thinkers——即係話資料庫十六行梗係逐行check晒，先至搵到波娃。細庫入面睇唔出快慢，但如果呢間檔案室有十萬行，呢種「逐個check」嘅代價就即刻現形。",
          en: "The result reads SCAN thinkers — the database checked every one of the sixteen rows in turn before it found Beauvoir. At this size you cannot feel the cost, but if this room held a hundred thousand files, that row-by-row habit would show itself at once."
        },
        validate: {
          type: "explain",
          mustContainSQL: [
            "thinkers",
            "region_zh",
            "法國"
          ]
        },
        hints: {
          zh: [
            "EXPLAIN 唔會俾返業務數據，佢會話你知資料庫行緊邊條「路」去搵資料。",
            "語句開頭要寫 EXPLAIN QUERY PLAN，後面照跟返嗰條原本嘅 SELECT。",
            "偽代碼：\nEXPLAIN QUERY PLAN\nSELECT * FROM thinkers WHERE region_zh = '法國';"
          ],
          en: [
            "EXPLAIN does not hand back business rows — it reports the path the database is taking to find them.",
            "Start the statement with EXPLAIN QUERY PLAN, then keep the original SELECT that follows.",
            "Pseudocode:\nEXPLAIN QUERY PLAN\nSELECT * FROM thinkers WHERE region_zh = '法國';"
          ]
        }
      },
      {
        kind: "exercise",
        lead: {
          zh: "依家你知道問題所在——冇 index 嘅話，查一個地區都要成間房逐個check。喺 region_zh 呢一欄開返個 index，等下次搵人快啲。",
          en: "Now that you know what is really happening — without an index, a single region lookup means checking the whole room one by one — build an index on region_zh so the next search can skip straight to the answer."
        },
        starter: "CREATE INDEX ",
        payoff: {
          zh: "Index 起好。唔好周圍亂開 index——每加一個，寫入資料嗰陣都要多做嘢維護佢，所以淨係開喺你真係成日用嚟搵嘢嗰啲欄。",
          en: "Index built. Do not scatter indexes everywhere — each one adds upkeep on every write, so reserve them for the columns you genuinely search on often."
        },
        validate: {
          type: "index",
          name: "idx_thinkers_region",
          table: "thinkers",
          column: "region_zh"
        },
        hints: {
          zh: [
            "諗吓邊個表、邊一欄係你想加快嘅——即係啱啱 EXPLAIN 話你知嗰個 SCAN 緊嘅欄。",
            "語法係 CREATE INDEX 索引名 ON 表名(欄名);",
            "偽代碼：CREATE INDEX idx_thinkers_region ON thinkers(region_zh);"
          ],
          en: [
            "Think about which table and column you want to speed up — the very one EXPLAIN just reported as the SCAN target.",
            "The syntax is CREATE INDEX index_name ON table_name(column);",
            "Pseudocode: CREATE INDEX idx_thinkers_region ON thinkers(region_zh);"
          ]
        }
      },
      {
        kind: "demo",
        lead: {
          zh: "而家再對返同一條 WHERE region_zh = '法國' 嘅查詢跑多次 EXPLAIN QUERY PLAN，睇下資料庫嘅「思路」有冇變。",
          en: "Now run EXPLAIN QUERY PLAN once more on the exact same WHERE region_zh = '法國' lookup, and see whether the database's train of thought has changed."
        },
        sql: "EXPLAIN QUERY PLAN\nSELECT * FROM thinkers WHERE region_zh = '法國';",
        payoff: {
          zh: "由 SCAN 變咗 SEARCH USING INDEX——資料庫而家識得直接搵去 region_zh = '法國' 嗰行，唔使成間房逐個check。喺十六行嘅細庫入面，你未必計得出時間差，但呢條「搵法」已經徹底變咗——呢個就係查案要快嘅底層原理。",
          en: "SCAN has become SEARCH USING INDEX — the database now goes straight to the rows where region_zh = 'France', instead of checking the whole room one by one. At sixteen rows you would not clock a difference in speed, but the method itself has changed completely — and that is exactly what makes a case fast to crack."
        }
      }
    ]
  }
];
