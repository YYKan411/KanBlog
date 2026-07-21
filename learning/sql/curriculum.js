/**
 * Bilingual SQL curriculum — zh / en balanced briefings.
 * validate specs reused across themes (same as before).
 */

function themeAdapt(themeId, variants) {
  return variants[themeId] || variants.football;
}

export const CURRICULUM = [
  {
    id: 's0-select',
    stage: '0→1',
    title: { zh: '第一次 SELECT', en: 'Your first SELECT' },
    concepts: ['SELECT', 'FROM'],
    briefing: {
      football: {
        zh: '睇吓 clubs 表入面有邊啲球會。用 SELECT 拎晒所有欄同所有列。',
        en: 'List every club in the clubs table. Select all columns and all rows.'
      },
      anime: {
        zh: '睇吓 series 表入面有邊啲作品。用 SELECT 拎晒所有欄同所有列。',
        en: 'List every series. Select all columns and all rows.'
      },
      stocks: {
        zh: '睇吓 companies 表入面有邊啲公司。用 SELECT 拎晒所有欄同所有列。',
        en: 'List every company. Select all columns and all rows.'
      }
    },
    intro: {
      zh: 'SELECT 決定你想睇邊啲欄；FROM 講明資料喺邊張表。星號 * 代表全部欄。',
      en: 'SELECT chooses columns; FROM names the table. The star * means every column.'
    },
    starter: (t) => themeAdapt(t, {
      football: 'SELECT * FROM clubs',
      anime: 'SELECT * FROM series',
      stocks: 'SELECT * FROM companies'
    }),
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM clubs' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM series' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM companies' }
    }),
    hints: {
      zh: [
        'SELECT 後面寫欄名；想全部就用 *。',
        '跟住要用 FROM 講明表名。',
        '偽代碼：SELECT * FROM 表名'
      ],
      en: [
        'After SELECT, name the columns — or use * for all.',
        'Then FROM must name the table.',
        'Pseudocode: SELECT * FROM table_name'
      ]
    }
  },
  {
    id: 's0-where',
    stage: '0→1',
    title: { zh: '用 WHERE 過濾', en: 'Filter with WHERE' },
    concepts: ['WHERE'],
    briefing: {
      football: {
        zh: '只拎出 nationality = \'England\' 嘅球員。',
        en: 'Return only players whose nationality is England.'
      },
      anime: {
        zh: '只拎出 genre = \'Action\' 嘅作品。',
        en: 'Return only series whose genre is Action.'
      },
      stocks: {
        zh: '只拎出 country = \'HK\' 嘅公司。',
        en: 'Return only companies whose country is HK.'
      }
    },
    intro: {
      zh: 'WHERE 過濾「列」，唔係欄。字串要用單引號。',
      en: 'WHERE filters rows, not columns. Strings need single quotes.'
    },
    starter: '-- WHERE ...\nSELECT * FROM ',
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: "SELECT * FROM players WHERE nationality = 'England'" },
      anime: { type: 'sql', expectedSQL: "SELECT * FROM series WHERE genre = 'Action'" },
      stocks: { type: 'sql', expectedSQL: "SELECT * FROM companies WHERE country = 'HK'" }
    }),
    hints: {
      zh: ['WHERE 放喺 FROM 後面。', '字串比較：WHERE 欄 = \'值\'', '偽代碼：SELECT * FROM 表 WHERE 欄 = \'值\''],
      en: ['WHERE comes after FROM.', "Compare strings like: WHERE col = 'value'", 'Pseudocode: SELECT * FROM t WHERE col = \'value\'']
    }
  },
  {
    id: 's0-order-limit',
    stage: '0→1',
    title: { zh: '排序同 Top N', en: 'Sort and Top N' },
    concepts: ['ORDER BY', 'LIMIT'],
    briefing: {
      football: {
        zh: '按 market_value_m 由高至低排 players，只顯示最高 5 個；打和嘅話，player_id 細嘅排先。',
        en: 'Sort players by market_value_m descending; keep the top 5. Ties are broken by the lower player_id.'
      },
      anime: {
        zh: '按 power_level 由高至低排 characters，只顯示最高 5 個；打和嘅話，char_id 細嘅排先。',
        en: 'Sort characters by power_level descending; keep the top 5. Ties are broken by the lower char_id.'
      },
      stocks: {
        zh: '按 employees 由高至低排 companies，只顯示最高 3 個；打和嘅話，ticker 字母序排先。',
        en: 'Sort companies by employees descending; keep the top 3. Ties are broken alphabetically by ticker.'
      }
    },
    intro: {
      zh: 'ORDER BY 決定順序；LIMIT 截斷結果。報表成日用。同分點算？穩陣做法係加多一個欄嚟斷龍（tiebreak），咪畀個結果日日唔同——呢堂就明講咗用邊個欄嚟斷。',
      en: 'ORDER BY sets the order; LIMIT truncates. Everyday report grammar. What about ties? The sound habit is to add a second sort key as a tiebreaker, so the answer does not quietly change from one run to the next — this exercise tells you exactly which column to use.'
    },
    starter: 'SELECT * FROM ',
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM players ORDER BY market_value_m DESC, player_id ASC LIMIT 5' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM characters ORDER BY power_level DESC, char_id ASC LIMIT 5' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM companies ORDER BY employees DESC, ticker ASC LIMIT 3' }
    }),
    hints: {
      zh: ['DESC 係由大到細。', 'LIMIT n 只要前 n 行。', '順序：SELECT → FROM → WHERE → ORDER BY, tiebreak_欄 → LIMIT'],
      en: ['DESC means high to low.', 'LIMIT n keeps the first n rows.', 'Order: SELECT → FROM → WHERE → ORDER BY, tiebreak_column → LIMIT']
    }
  },
  {
    id: 's0-aggregate',
    stage: '0→1',
    title: { zh: '聚合：COUNT / AVG', en: 'Aggregates: COUNT / AVG' },
    concepts: ['GROUP BY', 'COUNT', 'AVG'],
    briefing: {
      football: {
        zh: '每個 position 有幾多球員？順便計平均 age。輸出：position, cnt, avg_age。',
        en: 'Per position: how many players, and average age. Columns: position, cnt, avg_age.'
      },
      anime: {
        zh: '每個 role 有幾多角色？順便計平均 power_level。輸出：role, cnt, avg_power。',
        en: 'Per role: count and average power_level. Columns: role, cnt, avg_power.'
      },
      stocks: {
        zh: '每個 sector 有幾多間公司？順便計平均 employees。輸出：sector, cnt, avg_emp。',
        en: 'Per sector: count and average employees. Columns: sector, cnt, avg_emp.'
      }
    },
    intro: {
      zh: 'GROUP BY 定義「組」；聚合函數喺組內計算。非聚合欄必須出現喺 GROUP BY。',
      en: 'GROUP BY defines the buckets; aggregates compute inside each. Non-aggregated columns must appear in GROUP BY.'
    },
    starter: 'SELECT ',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: 'SELECT position, COUNT(*) AS cnt, AVG(age) AS avg_age FROM players GROUP BY position',
        columns: ['position', 'cnt', 'avg_age']
      },
      anime: {
        type: 'columns',
        expectedSQL: 'SELECT role, COUNT(*) AS cnt, AVG(power_level) AS avg_power FROM characters GROUP BY role',
        columns: ['role', 'cnt', 'avg_power']
      },
      stocks: {
        type: 'columns',
        expectedSQL: 'SELECT sector, COUNT(*) AS cnt, AVG(employees) AS avg_emp FROM companies GROUP BY sector',
        columns: ['sector', 'cnt', 'avg_emp']
      }
    }),
    hints: {
      zh: ['COUNT(*) 數行數。', '用 AS 改欄名。', 'SELECT 入面嘅普通欄要寫入 GROUP BY。'],
      en: ['COUNT(*) counts rows.', 'Use AS to rename columns.', 'Plain columns in SELECT must be in GROUP BY.']
    }
  },
  {
    id: 's0b-distinct',
    stage: '0→1',
    title: { zh: '去除重複：DISTINCT', en: 'Unique values with DISTINCT' },
    concepts: ['DISTINCT'],
    briefing: {
      football: {
        zh: '睇吓 players 表入面有幾多個唔同嘅 nationality。',
        en: 'List the distinct nationalities that appear in the players table.'
      },
      anime: {
        zh: '睇吓 series 表入面有幾多個唔同嘅 genre。',
        en: 'List the distinct genres that appear in the series table.'
      },
      stocks: {
        zh: '睇吓 companies 表入面有幾多個唔同嘅 sector。',
        en: 'List the distinct sectors that appear in the companies table.'
      }
    },
    intro: {
      zh: 'DISTINCT 擺喺 SELECT 後面，會將重複嘅值收埋，剩返獨一無二嘅結果。同 GROUP BY 唔同，佢淨係為咗去重複，唔會計埋聚合函數。',
      en: 'DISTINCT sits right after SELECT and collapses duplicate values, leaving only the unique ones behind. Unlike GROUP BY, it exists purely to deduplicate — there is no aggregate function riding alongside it.'
    },
    starter: 'SELECT DISTINCT ',
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT DISTINCT nationality FROM players' },
      anime: { type: 'sql', expectedSQL: 'SELECT DISTINCT genre FROM series' },
      stocks: { type: 'sql', expectedSQL: 'SELECT DISTINCT sector FROM companies' }
    }),
    hints: {
      zh: ['淨係想要唔重複嘅值，唔使理邊一列屬邊個，亦唔使理有幾多重複。', '用 DISTINCT 去除重複，寫喺 SELECT 後面、欄名之前。', '偽代碼：SELECT DISTINCT 欄名 FROM 表名'],
      en: ['You only want the unique values — never mind which row they came from, or how many share one.', 'Use DISTINCT to drop duplicates; it goes right after SELECT, before the column name.', 'Pseudocode: SELECT DISTINCT column_name FROM table_name']
    }
  },
  {
    id: 's1-inner-join',
    stage: '1→10',
    title: { zh: 'INNER JOIN', en: 'INNER JOIN' },
    concepts: ['INNER JOIN', 'ON'],
    briefing: {
      football: {
        zh: '列出球員名同球會名。只有「有球會」嘅球員。輸出：player_name, club_name。',
        en: 'List player name and club name. Only players who have a club. Columns: player_name, club_name.'
      },
      anime: {
        zh: '列出角色名同作品名。輸出：char_name, series_title。',
        en: 'List character name and series title. Columns: char_name, series_title.'
      },
      stocks: {
        zh: '列出每筆 trade 嘅 ticker、公司名、side、qty。',
        en: 'List each trade’s ticker, company name, side, and qty.'
      }
    },
    intro: {
      zh: 'INNER JOIN 靠 ON 嗰個條件揾兩表對得上嘅列——通常係一邊嘅外鍵（foreign key）對應另一邊嘅主鍵（primary key）。對唔上就消失——可能造成樣本偏差。',
      en: 'INNER JOIN matches rows via the ON condition — typically one table\'s foreign key against the other\'s primary key. Non-matches vanish — a common source of sample bias.'
    },
    starter: 'SELECT\n  \nFROM ',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT p.name AS player_name, c.name AS club_name
FROM players p INNER JOIN clubs c ON p.club_id = c.club_id`,
        columns: ['player_name', 'club_name']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT ch.name AS char_name, s.title AS series_title
FROM characters ch INNER JOIN series s ON ch.series_id = s.series_id`,
        columns: ['char_name', 'series_title']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT t.ticker, c.name AS company_name, t.side, t.qty
FROM trades t INNER JOIN companies c ON t.ticker = c.ticker`,
        columns: ['ticker', 'company_name', 'side', 'qty']
      }
    }),
    hints: {
      zh: ['ON 寫連接條件：外鍵 = 主鍵。', 'club_id 係 NULL 嘅列，INNER 之後會唔見。', '偽代碼：SELECT ... FROM a JOIN b ON a.外鍵 = b.主鍵'],
      en: ['ON states the match: foreign key = primary key.', 'Rows with NULL keys disappear under INNER.', 'Pseudocode: SELECT ... FROM a JOIN b ON a.foreign_key = b.primary_key']
    }
  },
  {
    id: 's1-left-join',
    stage: '1→10',
    title: { zh: 'LEFT JOIN', en: 'LEFT JOIN' },
    concepts: ['LEFT JOIN', 'NULL'],
    briefing: {
      football: {
        zh: '列出所有球員，包括未有球會嘅。輸出：player_name, club_name。',
        en: 'List all players, including those without a club. Columns: player_name, club_name.'
      },
      anime: {
        zh: '用 LEFT JOIN 列出所有角色同作品名。輸出：char_name, series_title。',
        en: 'Use LEFT JOIN to list every character with series title. Columns: char_name, series_title.'
      },
      stocks: {
        zh: '列出所有公司同佢哋嘅 rating（可 NULL）。輸出：ticker, company_name, rating。',
        en: 'List every company and its rating (may be NULL). Columns: ticker, company_name, rating.'
      }
    },
    intro: {
      zh: 'LEFT JOIN 保留左邊全部列；右邊對唔上就填 NULL。NULL 係訊號，唔一定係錯誤。',
      en: 'LEFT JOIN keeps every left-side row; unmatched right fields become NULL. NULL is a signal, not always a bug.'
    },
    starter: 'SELECT\n  \nFROM ',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT p.name AS player_name, c.name AS club_name
FROM players p LEFT JOIN clubs c ON p.club_id = c.club_id`,
        columns: ['player_name', 'club_name'],
        mustIncludeNullClub: true
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT ch.name AS char_name, s.title AS series_title
FROM characters ch LEFT JOIN series s ON ch.series_id = s.series_id`,
        columns: ['char_name', 'series_title']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT c.ticker, c.name AS company_name, r.rating
FROM companies c LEFT JOIN ratings r ON c.ticker = r.ticker`,
        columns: ['ticker', 'company_name', 'rating']
      }
    }),
    hints: {
      zh: ['想見到「冇配對」嘅列就要 LEFT，唔想就要 INNER。', '跑完睇吓有冇出現空嘅 club_name／rating。', '偽代碼：SELECT ... FROM a LEFT JOIN b ON a.外鍵 = b.主鍵'],
      en: ['Want unmatched left rows to show up? Use LEFT — otherwise INNER.', 'After running, check for an empty club_name / rating.', 'Pseudocode: SELECT ... FROM a LEFT JOIN b ON a.foreign_key = b.primary_key']
    }
  },
  {
    id: 's1b-subquery-in-exists',
    stage: '1→10',
    title: { zh: 'Subquery：IN / EXISTS', en: 'Subquery: IN / EXISTS' },
    concepts: ['Subquery', 'IN', 'EXISTS'],
    briefing: {
      football: {
        zh: '搵出至少喺主場贏過一場波嘅球會（呢個 schema 入面每間球會其實都做過主隊，所以純粹「有冇主場出過場」會篩極都係全部球會——改用「主場贏過波」先睇得出 subquery 真係揀緊嘢）。',
        en: 'Find clubs that have won at least one match as the home side. (In this seed data every club hosts at least one fixture, so a plain "has hosted a home match" filter would return the whole table unchanged — filtering on "won at home" instead shows the subquery genuinely narrowing the result.)'
      },
      anime: {
        zh: '搵出至少有一個角色 power_level 超過 90 嘅作品。',
        en: 'Find series that include at least one character with a power_level above 90.'
      },
      stocks: {
        zh: '搵出至少攞過一個 BUY rating 嘅公司。',
        en: 'Find companies that have received at least one BUY rating.'
      }
    },
    intro: {
      zh: 'Subquery 即係喺 WHERE 入面再嵌多一個 SELECT——入面嗰個先行，攞到嘅結果當一張清單，畀外層用 IN 揀選。EXISTS 諗嘅係「存唔存在」，好多時同 IN 殊途同歸。',
      en: 'A subquery is a SELECT nested inside another query\'s WHERE clause — the inner query runs first, and its result becomes a list the outer query filters against with IN. EXISTS asks a plain yes-or-no question instead, and it often reaches the same answer by a different route.'
    },
    starter: (t) => themeAdapt(t, {
      football: '-- subquery: WHERE ... IN (SELECT ...)\nSELECT * FROM clubs WHERE ',
      anime: '-- subquery: WHERE ... IN (SELECT ...)\nSELECT * FROM series WHERE ',
      stocks: '-- subquery: WHERE ... IN (SELECT ...)\nSELECT * FROM companies WHERE '
    }),
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM clubs WHERE club_id IN (SELECT home_club_id FROM matches WHERE home_goals > away_goals)' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM series WHERE series_id IN (SELECT series_id FROM characters WHERE power_level > 90)' },
      stocks: { type: 'sql', expectedSQL: "SELECT * FROM companies WHERE ticker IN (SELECT ticker FROM ratings WHERE rating = 'BUY')" }
    }),
    hints: {
      football: {
        zh: ['諗吓：想搵「喺另一個表入面有出現過」嘅列，可以喺 WHERE 入面再放多個 SELECT，先攞晒啲主場贏波嘅 club_id。', '用 WHERE club_id IN (SELECT home_club_id FROM matches WHERE ...)——入面嗰個 SELECT 會行先，變成一張 id 清單。', '偽代碼：SELECT * FROM clubs WHERE club_id IN (SELECT home_club_id FROM matches WHERE home_goals > away_goals)'],
        en: ['Think about clubs that "show up" as a home winner in another table — you can nest a second SELECT inside the WHERE clause to check that.', 'Use WHERE club_id IN (SELECT home_club_id FROM matches WHERE ...) — the inner SELECT runs first and produces a list of club_id values.', 'Pseudocode: SELECT * FROM clubs WHERE club_id IN (SELECT home_club_id FROM matches WHERE home_goals > away_goals)']
      },
      anime: {
        zh: ['諗吓：想搵「喺另一個表入面有出現過」嘅列，可以喺 WHERE 入面再放多個 SELECT，先攞晒 power_level 夠高嘅角色屬於邊套作品。', '用 WHERE series_id IN (SELECT series_id FROM characters WHERE power_level > 90)——入面嗰個 SELECT 會行先，變成一張 series_id 清單。', '偽代碼：SELECT * FROM series WHERE series_id IN (SELECT series_id FROM characters WHERE power_level > 90)'],
        en: ['Think about series that "show up" via a strong character in another table — you can nest a second SELECT inside the WHERE clause to check that.', 'Use WHERE series_id IN (SELECT series_id FROM characters WHERE power_level > 90) — the inner SELECT runs first and produces a list of series_id values.', 'Pseudocode: SELECT * FROM series WHERE series_id IN (SELECT series_id FROM characters WHERE power_level > 90)']
      },
      stocks: {
        zh: ['諗吓：想搵「喺另一個表入面有出現過」嘅列，可以喺 WHERE 入面再放多個 SELECT，先攞晒邊啲 ticker 收過 BUY。', '用 WHERE ticker IN (SELECT ticker FROM ratings WHERE rating = \'BUY\')——入面嗰個 SELECT 會行先，變成一張 ticker 清單。', '偽代碼：SELECT * FROM companies WHERE ticker IN (SELECT ticker FROM ratings WHERE rating = \'BUY\')'],
        en: ['Think about companies that "show up" with a certain rating in another table — you can nest a second SELECT inside the WHERE clause to check that.', 'Use WHERE ticker IN (SELECT ticker FROM ratings WHERE rating = \'BUY\') — the inner SELECT runs first and produces a list of ticker values.', 'Pseudocode: SELECT * FROM companies WHERE ticker IN (SELECT ticker FROM ratings WHERE rating = \'BUY\')']
      }
    }
  },
  {
    id: 's1b-not-in-null-trap',
    stage: '1→10',
    title: { zh: 'NOT IN 嘅 NULL 陷阱', en: 'NOT IN and the NULL trap' },
    concepts: ['NOT IN', 'NULL', 'NOT EXISTS'],
    chaos: true,
    briefing: {
      football: {
        zh: '揾出邊啲球會從未做過轉會嘅「買方」——即係喺 transfers.to_club_id 入面從未出現過嘅球會。輸出：club_id, name。留意 transfers 入面有一筆冇話明去邊嘅轉會：Harry Kane 離開熱刺，但 to_club_id 係 NULL（自由球員，未有記錄新東家）。如果你淨係寫 NOT IN (SELECT to_club_id FROM transfers)，呢粒 NULL 會累到成條查詢乜結果都攞唔返。',
        en: 'Find clubs that have never been the destination of a transfer — that is, clubs that never appear in transfers.to_club_id. Columns: club_id, name. Notice one transfer records no destination at all: Harry Kane left Tottenham, but to_club_id is NULL (a free agent with no new club on record). Write this as a plain NOT IN (SELECT to_club_id FROM transfers) and that single NULL silently wipes out every row of your result.'
      },
      anime: {
        zh: '揾出邊啲角色嘅 power_level 係獨一無二，即係冇一個 support 角色嘅 power_level 同佢一樣。輸出：name, role, power_level。呢課會用髒數據：兩位 support 角色 Nezuko 同 Himmel 嘅 power_level 已經整壞咗變咗 NULL。如果你淨係寫 power_level NOT IN (SELECT power_level FROM characters WHERE role = \'support\')，子查詢入面嗰兩粒 NULL 會累到全部人都畀篩走，得返 0 行。',
        en: 'Find characters whose power_level is distinctive, matching no support character\'s power_level. Columns: name, role, power_level. This lesson loads the dirty dataset, where two support characters, Nezuko and Himmel, have had their power_level corrupted to NULL. Write power_level NOT IN (SELECT power_level FROM characters WHERE role = \'support\') and those two NULLs in the subquery silently zero out your entire result.'
      },
      stocks: {
        zh: '揾出邊啲評級，佢哋嘅 target_price 冇同任何一個「SELL」評級嘅 target_price 撞。輸出：rating_id, ticker, rating, target_price。呢課會用髒數據：目前得一個 SELL 評級（9988.HK），佢嘅 target_price 已經整壞咗變咗 NULL。如果你淨係寫 target_price NOT IN (SELECT target_price FROM ratings WHERE rating = \'SELL\')，呢粒 NULL 會令成個查詢由應該有嘅 7 行跌到 0 行。',
        en: "Find ratings whose target_price matches no SELL rating's target_price. Columns: rating_id, ticker, rating, target_price. This lesson loads the dirty dataset, where the sole SELL rating (9988.HK) has had its target_price corrupted to NULL. Write target_price NOT IN (SELECT target_price FROM ratings WHERE rating = 'SELL') and that one NULL drags the whole query down from 7 rows to 0."
      }
    },
    intro: {
      zh: 'NOT IN (子查詢) 同 NULL 埋齊超危險：子查詢嗰欄如果混咗一粒 NULL，成個 NOT IN 就會靜雞雞乜結果都冇——唔會報錯，淨係得返 0 行，好易呃到你。因為同 NULL 比較嘅答案係「唔知」，唔係 false。想穩陣啲，搵 NOT EXISTS，或者喺子查詢入面加 IS NOT NULL 擋一擋。',
      en: 'NOT IN (subquery) turns dangerous the moment its column holds a single NULL: comparing anything to NULL yields unknown, not false, so the entire filter silently returns nothing — no error, no warning, just zero rows. NOT EXISTS, or an IS NOT NULL guard inside the subquery, sidesteps the trap entirely.'
    },
    starter: (t) => themeAdapt(t, {
      football: 'SELECT c.club_id, c.name\nFROM clubs c\nWHERE c.club_id NOT IN (SELECT to_club_id FROM transfers);',
      anime: "SELECT ch.name, ch.role, ch.power_level\nFROM characters ch\nWHERE ch.power_level NOT IN (SELECT power_level FROM characters WHERE role = 'support');",
      stocks: "SELECT r.rating_id, r.ticker, r.rating, r.target_price\nFROM ratings r\nWHERE r.target_price NOT IN (SELECT target_price FROM ratings WHERE rating = 'SELL');"
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT c.club_id, c.name
FROM clubs c
WHERE NOT EXISTS (
  SELECT 1 FROM transfers t WHERE t.to_club_id = c.club_id
)`,
        columns: ['club_id', 'name']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT ch.name, ch.role, ch.power_level
FROM characters ch
WHERE ch.power_level IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM characters s
    WHERE s.role = 'support' AND s.power_level = ch.power_level
  )`,
        columns: ['name', 'role', 'power_level']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT r.rating_id, r.ticker, r.rating, r.target_price
FROM ratings r
WHERE NOT EXISTS (
  SELECT 1 FROM ratings s
  WHERE s.rating = 'SELL' AND s.target_price = r.target_price
)`,
        columns: ['rating_id', 'ticker', 'rating', 'target_price']
      }
    }),
    hints: {
      football: {
        zh: ['照個起始查詢咁跑一次先——6 間球會入面理應有兩間從未買入過球員，但你會攞到 0 行。', 'NOT IN 一旦子查詢入面有粒 NULL，成個 WHERE 就會篩到乜都冇。換用 NOT EXISTS，或者喺子查詢加返 WHERE to_club_id IS NOT NULL 都得。', '偽代碼：SELECT c.club_id, c.name FROM clubs c WHERE NOT EXISTS (SELECT 1 FROM transfers t WHERE t.to_club_id = c.club_id)'],
        en: ['Run the starter query exactly as given first — of the six clubs, two should genuinely never have bought a player, yet you will get zero rows.', 'The moment a NOT IN subquery contains a NULL, the whole WHERE clause filters out everything. Switch to NOT EXISTS, or add WHERE to_club_id IS NOT NULL inside the subquery.', 'Pseudocode: SELECT c.club_id, c.name FROM clubs c WHERE NOT EXISTS (SELECT 1 FROM transfers t WHERE t.to_club_id = c.club_id)']
      },
      anime: {
        zh: ['照個起始查詢咁跑一次先——留意而家有幾位 support 角色嘅 power_level 已經爛咗變咗 NULL。', 'NOT IN 遇到子查詢有 NULL 就會靜雞雞失效。想避開就用 NOT EXISTS，或者喺子查詢加 AND power_level IS NOT NULL。', '偽代碼：SELECT ch.name, ch.role, ch.power_level FROM characters ch WHERE ch.power_level IS NOT NULL AND NOT EXISTS (SELECT 1 FROM characters s WHERE s.role = \'support\' AND s.power_level = ch.power_level)'],
        en: ['Run the starter query exactly as given first — notice a couple of support characters currently have a corrupted, NULL power_level.', 'NOT IN silently fails the moment its subquery contains a NULL. Sidestep it with NOT EXISTS, or add AND power_level IS NOT NULL inside the subquery.', 'Pseudocode: SELECT ch.name, ch.role, ch.power_level FROM characters ch WHERE ch.power_level IS NOT NULL AND NOT EXISTS (SELECT 1 FROM characters s WHERE s.role = \'support\' AND s.power_level = ch.power_level)']
      },
      stocks: {
        zh: ['照個起始查詢咁跑一次先——呢個 dataset 得返一個 SELL 評級，而佢個 target_price 啱啱好整壞咗變咗 NULL，睇吓對 NOT IN 有咩影響。', 'NOT IN 嘅子查詢一旦有 NULL，成個 WHERE 就會篩到乜都冇。用 NOT EXISTS 相關子查詢就冇呢個問題。', '偽代碼：SELECT r.rating_id, r.ticker, r.rating, r.target_price FROM ratings r WHERE NOT EXISTS (SELECT 1 FROM ratings s WHERE s.rating = \'SELL\' AND s.target_price = r.target_price)'],
        en: ['Run the starter query exactly as given first — this dataset has exactly one SELL rating, and its target_price has just been corrupted to NULL; see what that does to a NOT IN filter.', 'The moment a NOT IN subquery contains a NULL, the whole WHERE clause filters out everything. A correlated NOT EXISTS does not have this problem.', 'Pseudocode: SELECT r.rating_id, r.ticker, r.rating, r.target_price FROM ratings r WHERE NOT EXISTS (SELECT 1 FROM ratings s WHERE s.rating = \'SELL\' AND s.target_price = r.target_price)']
      }
    }
  },
  {
    id: 's1b-self-join',
    stage: '1→10',
    title: { zh: 'Self-JOIN：一張表接兩次', en: 'Self-join: one table, twice' },
    concepts: ['Self-join', 'Table alias', 'ON'],
    briefing: {
      football: {
        zh: 'matches 表有 home_club_id 同 away_club_id 兩條外鍵，全部指返同一張 clubs 表——正正就係 self-join 嘅教科書例子。將 clubs 接自己兩次，起兩個別名 h（主場）同 a（客場）。輸出：match_date, home_club, away_club。',
        en: 'The matches table has two foreign keys, home_club_id and away_club_id, both pointing into the same clubs table — the textbook case for a self-join. Join clubs to itself twice, aliased h (home) and a (away). Columns: match_date, home_club, away_club.'
      },
      anime: {
        zh: '留意：呢個 schema 入面 characters 表冇一條「自己指自己」嘅外鍵（例如冇 rival_id），所以呢度冇真係好似足球咁嘅 self-join 外鍵可以用——呢題係改良版：將 characters 表接自己兩次，喺同一套 series 入面搵出邊個角色嘅 power_level 高過邊個。輸出：stronger_char, weaker_char, series_title。',
        en: "Note: this schema's characters table has no self-referencing foreign key (no rival_id column), so there is no genuine self-join FK here as in the football theme — this is an adapted variant instead. Join characters to itself within the same series to find every pair where one character's power_level beats another's. Columns: stronger_char, weaker_char, series_title."
      },
      stocks: {
        zh: '留意：呢個 schema 入面 companies 表都冇「母公司」呢類自己指自己嘅欄，所以一樣冇真係嘅 self-join 外鍵——呢題同樣用改良玩法：將 companies 表接自己兩次，喺同一個 sector 入面比較邊間公司 employees 多過邊間。輸出：bigger_company, smaller_company, sector。',
        en: 'Note: this schema\'s companies table likewise has no self-referencing column (no parent-company key), so there is no genuine self-join FK here either — the same adapted pattern applies. Join companies to itself within the same sector to compare which company has more employees than which. Columns: bigger_company, smaller_company, sector.'
      }
    },
    intro: {
      zh: 'Self-join 即係將同一張表當兩張嚟用——幫佢改兩個唔同嘅別名，再用 ON 接返自己。有兩條唔同外鍵指返同一張表時（好似一場波嘅主隊同客隊都嚟自同一張 clubs 表）呢招最典型；就算冇呢種外鍵，一樣可以將表接自己，用嚟互相比較同一張表入面唔同嘅列。',
      en: 'A self-join treats one table as two: give it two different aliases and join it back to itself with ON. It is the classic move when two different foreign keys point into the same table (a match\'s home club and away club both point into the same clubs table) — but the same trick still works with no such key, joining a table to itself to compare its own rows against each other.'
    },
    starter: 'SELECT\n  \nFROM ',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT m.match_date, h.name AS home_club, a.name AS away_club
FROM matches m
JOIN clubs h ON m.home_club_id = h.club_id
JOIN clubs a ON m.away_club_id = a.club_id`,
        columns: ['match_date', 'home_club', 'away_club']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT c1.name AS stronger_char, c2.name AS weaker_char, s.title AS series_title
FROM characters c1
JOIN characters c2 ON c1.series_id = c2.series_id AND c1.power_level > c2.power_level
JOIN series s ON c1.series_id = s.series_id`,
        columns: ['stronger_char', 'weaker_char', 'series_title']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT c1.name AS bigger_company, c2.name AS smaller_company, c1.sector AS sector
FROM companies c1
JOIN companies c2 ON c1.sector = c2.sector AND c1.employees > c2.employees`,
        columns: ['bigger_company', 'smaller_company', 'sector']
      }
    }),
    hints: {
      football: {
        zh: ['諗吓：一場波有主隊有客隊，但兩隊都嚟自同一張 clubs 表——可唔可以將 clubs 接自己兩次？', '用兩個別名，例如 h 同 a，分別 join clubs 兩次：一次夾 home_club_id，一次夾 away_club_id。', '偽代碼：SELECT m.match_date, h.name, a.name FROM matches m JOIN clubs AS h ON m.home_club_id = h.club_id JOIN clubs AS a ON m.away_club_id = a.club_id'],
        en: ['Think about it: a match has a home side and an away side, but both come from the same clubs table — can you join clubs to itself twice?', 'Use two aliases, say h and a, and join clubs twice: once matching home_club_id, once matching away_club_id.', 'Pseudocode: SELECT m.match_date, h.name, a.name FROM matches m JOIN clubs AS h ON m.home_club_id = h.club_id JOIN clubs AS a ON m.away_club_id = a.club_id']
      },
      anime: {
        zh: ['characters 表冇邊個角色直接指住第個角色嘅欄，但你仍然可以將呢張表接自己嚟做比較。', '用兩個別名 c1 同 c2 代表「同一張角色表」嘅兩行，ON 入面要求佢哋 series_id 一樣，但 power_level 要用 > 嚟揀邊個叻啲。', '偽代碼：SELECT c1.name, c2.name, s.title FROM characters AS c1 JOIN characters AS c2 ON c1.series_id = c2.series_id AND c1.power_level > c2.power_level JOIN series s ON c1.series_id = s.series_id'],
        en: ['The characters table has no column pointing straight at another character, but you can still join the table to itself to compare rows.', 'Use two aliases, c1 and c2, standing for two rows of the same table — the ON clause needs matching series_id but a power_level comparison (>) to pick the stronger one.', 'Pseudocode: SELECT c1.name, c2.name, s.title FROM characters AS c1 JOIN characters AS c2 ON c1.series_id = c2.series_id AND c1.power_level > c2.power_level JOIN series s ON c1.series_id = s.series_id']
      },
      stocks: {
        zh: ['companies 表冇「母公司」呢類自己指自己嘅欄，但一樣可以將佢接自己嚟做同組比較。', '用兩個別名 c1 同 c2，ON 入面要求 sector 一樣，employees 就用 > 揀邊間規模大啲。', '偽代碼：SELECT c1.name, c2.name, c1.sector FROM companies AS c1 JOIN companies AS c2 ON c1.sector = c2.sector AND c1.employees > c2.employees'],
        en: ['companies has no "parent company" style self-referencing column either, but the same trick works — join it to itself for within-group comparisons.', 'Use two aliases, c1 and c2; the ON clause needs matching sector plus an employees comparison (>) to pick the bigger one.', 'Pseudocode: SELECT c1.name, c2.name, c1.sector FROM companies AS c1 JOIN companies AS c2 ON c1.sector = c2.sector AND c1.employees > c2.employees']
      }
    }
  },
  {
    id: 's1b-three-way-join',
    stage: '1→10',
    title: { zh: '連鎖 JOIN：三表以上', en: 'Chaining JOINs across 3+ tables' },
    concepts: ['JOIN', 'chained JOIN', 'multi-table ON'],
    briefing: {
      football: {
        zh: '列出球員名、佢而家所屬球會名，同轉會費。要連 players、clubs、transfers 三張表；只計有轉會紀錄嘅球員。輸出：player_name, club_name, transfer_fee。',
        en: 'List player name, their current club name, and the transfer fee. Chain players, clubs, and transfers; include only players with a transfer record. Columns: player_name, club_name, transfer_fee.'
      },
      anime: {
        zh: '列出角色名、幫佢配音嘅聲優名，同所屬作品名。要連 characters、appearances、voice_actors，仲有 series 四張表——3 表係呢個練習嘅最低要求，但呢度嘅資料乾淨到可以順手加多一級。輸出：char_name, va_name, series_title。',
        en: 'List character name, the voice actor behind them, and the series they belong to. Chain characters, appearances, voice_actors, and series — four tables in all, since the data here stays clean enough to add one more link beyond the 3-table minimum. Columns: char_name, va_name, series_title.'
      },
      stocks: {
        zh: '列出公司名、分析師名，同佢畀嘅 rating。要連 ratings、companies、analysts 三張表。輸出：company_name, analyst_name, rating。',
        en: 'List company name, analyst name, and the rating they gave. Chain ratings, companies, and analysts. Columns: company_name, analyst_name, rating.'
      }
    },
    intro: {
      zh: 'JOIN 唔止得兩表——你可以一路砌落去，砌幾多次都得，每級都要有自己嘅 ON。留意如果中間嗰級用 INNER 對唔上，成條鏈之後嘅表都會跟住斷。',
      en: 'A JOIN chain is not capped at two tables — keep stacking as many as you need, each with its own ON. If one link in the chain fails to match under INNER, every table after it drops out too.'
    },
    starter: 'SELECT\n  \nFROM ',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT p.name AS player_name, c.name AS club_name, t.fee_m AS transfer_fee
FROM players p
JOIN clubs c ON p.club_id = c.club_id
JOIN transfers t ON p.player_id = t.player_id`,
        columns: ['player_name', 'club_name', 'transfer_fee']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT ch.name AS char_name, va.name AS va_name, s.title AS series_title
FROM characters ch
JOIN appearances ap ON ch.char_id = ap.char_id
JOIN voice_actors va ON ap.va_id = va.va_id
JOIN series s ON ch.series_id = s.series_id`,
        columns: ['char_name', 'va_name', 'series_title']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT c.name AS company_name, a.name AS analyst_name, r.rating
FROM ratings r
JOIN companies c ON r.ticker = c.ticker
JOIN analysts a ON r.analyst_id = a.analyst_id`,
        columns: ['company_name', 'analyst_name', 'rating']
      }
    }),
    hints: {
      football: {
        zh: ['呢次要連足三張表：players、clubs、transfers。一步步諗清楚邊個外鍵接邊個主鍵。', '可以連續寫兩個 JOIN：先 players JOIN clubs，跟住再 JOIN transfers，兩個都要有自己嘅 ON。', '偽代碼：SELECT p.name AS player_name, c.name AS club_name, t.fee_m AS transfer_fee FROM players p JOIN clubs c ON p.club_id = c.club_id JOIN transfers t ON p.player_id = t.player_id'],
        en: ['This one chains three tables: players, clubs, transfers. Work out which foreign key meets which primary key at each step.', 'You can stack two JOINs: first players JOIN clubs, then JOIN transfers — each needs its own ON.', 'Pseudocode: SELECT p.name AS player_name, c.name AS club_name, t.fee_m AS transfer_fee FROM players p JOIN clubs c ON p.club_id = c.club_id JOIN transfers t ON p.player_id = t.player_id']
      },
      anime: {
        zh: ['呢次要連四張表：characters、appearances、voice_actors，仲有 series。一個一個 JOIN 落去。', '橋樑表 appearances 揸住 char_id 同 va_id；連埋 series 就直接用 characters.series_id，唔使再經 appearances。', '偽代碼：SELECT ch.name AS char_name, va.name AS va_name, s.title AS series_title FROM characters ch JOIN appearances ap ON ch.char_id = ap.char_id JOIN voice_actors va ON ap.va_id = va.va_id JOIN series s ON ch.series_id = s.series_id'],
        en: ['This one chains four tables: characters, appearances, voice_actors, and series. Add one JOIN at a time.', 'The bridge table appearances holds char_id and va_id; series joins straight off characters.series_id, no need to route it through appearances.', 'Pseudocode: SELECT ch.name AS char_name, va.name AS va_name, s.title AS series_title FROM characters ch JOIN appearances ap ON ch.char_id = ap.char_id JOIN voice_actors va ON ap.va_id = va.va_id JOIN series s ON ch.series_id = s.series_id']
      },
      stocks: {
        zh: ['呢次要連足三張表：ratings、companies、analysts。ratings 表入面兩個外鍵，一個指去 companies，一個指去 analysts。', '由 ratings 出發：一個 JOIN 去 companies（用 ticker 接），一個 JOIN 去 analysts（用 analyst_id 接）。', '偽代碼：SELECT c.name AS company_name, a.name AS analyst_name, r.rating FROM ratings r JOIN companies c ON r.ticker = c.ticker JOIN analysts a ON r.analyst_id = a.analyst_id'],
        en: ['This one chains three tables: ratings, companies, analysts. The ratings table carries two foreign keys — one pointing to companies, one to analysts.', 'Starting from ratings, JOIN to companies on ticker, and JOIN to analysts on analyst_id.', 'Pseudocode: SELECT c.name AS company_name, a.name AS analyst_name, r.rating FROM ratings r JOIN companies c ON r.ticker = c.ticker JOIN analysts a ON r.analyst_id = a.analyst_id']
      }
    }
  },
  {
    id: 's1b-case-when',
    stage: '1→10',
    title: { zh: 'CASE WHEN 分級', en: 'Bucketing with CASE WHEN' },
    concepts: ['CASE WHEN', 'THEN', 'ELSE'],
    briefing: {
      football: {
        zh: '用 CASE WHEN 將每個球員嘅 market_value_m 分做三級：>=100 叫 \'top\'，50 到 99 叫 \'mid\'，其餘叫 \'developing\'。輸出：name, market_tier。',
        en: "Bucket each player by market_value_m using CASE WHEN: 'top' for 100 or above, 'mid' for 50–99, and 'developing' below that. Columns: name, market_tier."
      },
      anime: {
        zh: '用 CASE WHEN 將每個角色嘅 power_level 分做三級：>=90 叫 \'top\'，70 到 89 叫 \'mid\'，其餘叫 \'developing\'。輸出：name, power_tier。',
        en: "Bucket each character by power_level using CASE WHEN: 'top' for 90 or above, 'mid' for 70–89, and 'developing' below that. Columns: name, power_tier."
      },
      stocks: {
        zh: '用 CASE WHEN 將每間公司嘅 employees 分做三級：>=250000 叫 \'large\'，150000 到 249999 叫 \'mid\'，其餘叫 \'small\'。輸出：name, size_tier。',
        en: "Bucket each company by employees using CASE WHEN: 'large' for 250,000 or above, 'mid' for 150,000–249,999, and 'small' below that. Columns: name, size_tier."
      }
    },
    intro: {
      zh: 'CASE WHEN 係 SQL 入面嘅 if/else：條件由上至下逐個試，中咗就用嗰個結果，唔會再睇後面嘅；成句用 END 收尾，執唔到就用 ELSE 兜底。',
      en: "CASE WHEN is SQL's if/else: conditions are tried in order from top to bottom, the first match wins, and END closes the expression. ELSE catches whatever is left over."
    },
    starter: (t) => themeAdapt(t, {
      football: 'SELECT\n  \nFROM players',
      anime: 'SELECT\n  \nFROM characters',
      stocks: 'SELECT\n  \nFROM companies'
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: "SELECT name, CASE WHEN market_value_m >= 100 THEN 'top' WHEN market_value_m >= 50 THEN 'mid' ELSE 'developing' END AS market_tier FROM players",
        columns: ['name', 'market_tier']
      },
      anime: {
        type: 'columns',
        expectedSQL: "SELECT name, CASE WHEN power_level >= 90 THEN 'top' WHEN power_level >= 70 THEN 'mid' ELSE 'developing' END AS power_tier FROM characters",
        columns: ['name', 'power_tier']
      },
      stocks: {
        type: 'columns',
        expectedSQL: "SELECT name, CASE WHEN employees >= 250000 THEN 'large' WHEN employees >= 150000 THEN 'mid' ELSE 'small' END AS size_tier FROM companies",
        columns: ['name', 'size_tier']
      }
    }),
    hints: {
      football: {
        zh: ['諗吓 market_value_m 呢個數字要分做幾多個組，由高到低諗清楚門檻先。', '用 CASE WHEN market_value_m >= 門檻 THEN \'標籤\' ... ELSE \'標籤\' END，由高門檻寫到低門檻，中咗就唔會再睇後面嘅條件。', '偽代碼：\nSELECT name,\n  CASE WHEN market_value_m >= 100 THEN \'top\'\n       WHEN market_value_m >= 50 THEN \'mid\'\n       ELSE \'developing\'\n  END AS market_tier\nFROM players'],
        en: ['Work out how many buckets market_value_m needs, and fix the cutoffs from high to low before you write anything.', "Use CASE WHEN market_value_m >= threshold THEN 'label' ... ELSE 'label' END, writing the highest threshold first — once a row matches, later conditions are skipped.", "Pseudocode:\nSELECT name,\n  CASE WHEN market_value_m >= 100 THEN 'top'\n       WHEN market_value_m >= 50 THEN 'mid'\n       ELSE 'developing'\n  END AS market_tier\nFROM players"]
      },
      anime: {
        zh: ['諗吓 power_level 要分做幾多級，由高到低諗清楚門檻先。', '用 CASE WHEN power_level >= 門檻 THEN \'標籤\' ... ELSE \'標籤\' END，由高門檻寫到低門檻。', '偽代碼：\nSELECT name,\n  CASE WHEN power_level >= 90 THEN \'top\'\n       WHEN power_level >= 70 THEN \'mid\'\n       ELSE \'developing\'\n  END AS power_tier\nFROM characters'],
        en: ['Work out how many tiers power_level needs, and fix the cutoffs from high to low before you write anything.', "Use CASE WHEN power_level >= threshold THEN 'label' ... ELSE 'label' END, writing the highest threshold first.", "Pseudocode:\nSELECT name,\n  CASE WHEN power_level >= 90 THEN 'top'\n       WHEN power_level >= 70 THEN 'mid'\n       ELSE 'developing'\n  END AS power_tier\nFROM characters"]
      },
      stocks: {
        zh: ['諗吓 employees 要分做幾多級，由高到低諗清楚門檻先。', '用 CASE WHEN employees >= 門檻 THEN \'標籤\' ... ELSE \'標籤\' END，由高門檻寫到低門檻。', '偽代碼：\nSELECT name,\n  CASE WHEN employees >= 250000 THEN \'large\'\n       WHEN employees >= 150000 THEN \'mid\'\n       ELSE \'small\'\n  END AS size_tier\nFROM companies'],
        en: ['Work out how many size tiers employees needs, and fix the cutoffs from high to low before you write anything.', "Use CASE WHEN employees >= threshold THEN 'label' ... ELSE 'label' END, writing the highest threshold first.", "Pseudocode:\nSELECT name,\n  CASE WHEN employees >= 250000 THEN 'large'\n       WHEN employees >= 150000 THEN 'mid'\n       ELSE 'small'\n  END AS size_tier\nFROM companies"]
      }
    }
  },
  {
    id: 's1-window-rank',
    stage: '1→10',
    title: { zh: 'Window：RANK()', en: 'Window: RANK()' },
    concepts: ['RANK', 'OVER', 'PARTITION BY'],
    briefing: {
      football: {
        zh: '喺每個 position 入面按市值排行。輸出：name, position, market_value_m, rnk。',
        en: 'Rank market value within each position. Columns: name, position, market_value_m, rnk.'
      },
      anime: {
        zh: '喺每個 role 入面按 power_level 排行。輸出：name, role, power_level, rnk。',
        en: 'Rank power_level within each role. Columns: name, role, power_level, rnk.'
      },
      stocks: {
        zh: '喺每個 sector 入面按 employees 排行。輸出：ticker, sector, employees, rnk。',
        en: 'Rank employees within each sector. Columns: ticker, sector, employees, rnk.'
      }
    },
    intro: {
      zh: 'Window 唔會合併列（同 GROUP BY 唔同），只係喺每列旁加計算值。',
      en: 'Windows do not collapse rows (unlike GROUP BY); they add a value beside each row.'
    },
    starter: 'SELECT\n  \nFROM ',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT name, position, market_value_m,
RANK() OVER (PARTITION BY position ORDER BY market_value_m DESC) AS rnk FROM players`,
        columns: ['name', 'position', 'market_value_m', 'rnk']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT name, role, power_level,
RANK() OVER (PARTITION BY role ORDER BY power_level DESC) AS rnk FROM characters`,
        columns: ['name', 'role', 'power_level', 'rnk']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT ticker, sector, employees,
RANK() OVER (PARTITION BY sector ORDER BY employees DESC) AS rnk FROM companies`,
        columns: ['ticker', 'sector', 'employees', 'rnk']
      }
    }),
    hints: {
      zh: ['PARTITION BY 定義組；ORDER BY 定義組內排序。', '寫法：RANK() OVER (...)。', '結果行數通常同原表一樣。'],
      en: ['PARTITION BY sets the group; ORDER BY ranks inside it.', 'Form: RANK() OVER (...).', 'Row count usually stays the same as the base table.']
    }
  },
  {
    id: 's2-find-nulls',
    stage: '10→50',
    title: { zh: '偵察 NULL', en: 'Hunt for NULLs' },
    concepts: ['IS NULL'],
    chaos: true,
    briefing: {
      football: {
        zh: '資料已變髒。找出 nationality 係 NULL 嘅球員。',
        en: 'The data is dirty. Find players whose nationality is NULL.'
      },
      anime: {
        zh: '資料已變髒。找出 power_level 係 NULL 嘅角色。',
        en: 'The data is dirty. Find characters whose power_level is NULL.'
      },
      stocks: {
        zh: '資料已變髒。找出 close 係 NULL 嘅報價。',
        en: 'The data is dirty. Find prices whose close is NULL.'
      }
    },
    intro: {
      zh: 'NULL 係「未知」。唔好寫 = NULL，要用 IS NULL。',
      en: 'NULL means unknown. Never write = NULL; use IS NULL.'
    },
    starter: 'SELECT * FROM ',
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM players WHERE nationality IS NULL' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM characters WHERE power_level IS NULL' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM prices WHERE close IS NULL' }
    }),
    hints: {
      zh: ['NULL 即係「未知」，唔可以當普通值咁比較。', 'Analyst 日常第一步，往往係先數吓有幾多 NULL，先至決定填補定係剔走。', '偽代碼：WHERE 欄 IS NULL'],
      en: ['NULL means "unknown" — you cannot compare it like an ordinary value.', 'An analyst\'s first move is usually to count how many NULLs there are, before deciding whether to fill or drop them.', 'Pseudocode: WHERE col IS NULL']
    }
  },
  {
    id: 's2-dedupe',
    stage: '10→50',
    title: { zh: '發現重複', en: 'Find duplicates' },
    concepts: ['HAVING', 'COUNT'],
    chaos: true,
    briefing: {
      football: {
        zh: '搵出出現多過一次嘅球員 name，同出現次數 cnt。',
        en: 'Find player names that appear more than once, with count cnt.'
      },
      anime: {
        zh: '搵出出現多過一次嘅角色 name，同 cnt。',
        en: 'Find character names that appear more than once, with cnt.'
      },
      stocks: {
        zh: '用 LOWER(name) 搵出名重複（大小寫混亂）嘅公司。輸出：name_norm, cnt。',
        en: 'Using LOWER(name), find companies with duplicate-ish names. Columns: name_norm, cnt.'
      }
    },
    intro: {
      zh: 'GROUP BY 之後用 HAVING 過濾「組」。WHERE 過濾唔到聚合結果。',
      en: 'After GROUP BY, filter groups with HAVING. WHERE cannot filter aggregates.'
    },
    starter: 'SELECT ',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: 'SELECT name, COUNT(*) AS cnt FROM players GROUP BY name HAVING COUNT(*) > 1',
        columns: ['name', 'cnt']
      },
      anime: {
        type: 'columns',
        expectedSQL: 'SELECT name, COUNT(*) AS cnt FROM characters GROUP BY name HAVING COUNT(*) > 1',
        columns: ['name', 'cnt']
      },
      stocks: {
        type: 'columns',
        expectedSQL: 'SELECT LOWER(name) AS name_norm, COUNT(*) AS cnt FROM companies GROUP BY LOWER(name) HAVING COUNT(*) > 1',
        columns: ['name_norm', 'cnt']
      }
    }),
    hints: {
      football: {
        zh: ['「重複」即係同一個名出現多過一次。', '諗吓 GROUP BY 之後，點樣先可以淨係揀返出現次數多過一嘅組。', '偽代碼：GROUP BY 欄 HAVING COUNT(*) > 1'],
        en: ['"Duplicate" means the same name shows up more than once.', 'Think about how, after GROUP BY, to keep only the groups that occur more than once.', 'Pseudocode: GROUP BY col HAVING COUNT(*) > 1']
      },
      anime: {
        zh: ['「重複」即係同一個名出現多過一次。', '諗吓 GROUP BY 之後，點樣先可以淨係揀返出現次數多過一嘅組。', '偽代碼：GROUP BY 欄 HAVING COUNT(*) > 1'],
        en: ['"Duplicate" means the same name shows up more than once.', 'Think about how, after GROUP BY, to keep only the groups that occur more than once.', 'Pseudocode: GROUP BY col HAVING COUNT(*) > 1']
      },
      stocks: {
        zh: ['呢度嘅「重複」仲包埋大小寫唔同嘅同一個名。', '試吓用 LOWER() 將個名先正規化，再嚟 GROUP BY。', '偽代碼：GROUP BY LOWER(欄) HAVING COUNT(*) > 1'],
        en: ['Here "duplicate" also covers the same name in different letter-casing.', 'Try normalising the name with LOWER() first, then GROUP BY.', 'Pseudocode: GROUP BY LOWER(col) HAVING COUNT(*) > 1']
      }
    }
  },
  {
    id: 's2b-coalesce-nullif',
    stage: '10→50',
    title: { zh: '填補 NULL：COALESCE', en: 'Fill NULLs: COALESCE' },
    concepts: ['COALESCE', 'NULLIF'],
    chaos: true,
    briefing: {
      football: {
        zh: '資料仲係髒。用 COALESCE 將 nationality 嘅 NULL 填做 \'Unknown\'，其他球員嘅資料照舊。輸出：name, filled_value。',
        en: "The data is still dirty. Use COALESCE to replace NULL nationality with 'Unknown', leaving every other player's value untouched. Columns: name, filled_value."
      },
      anime: {
        zh: '資料仲係髒。用 COALESCE 將 power_level 嘅 NULL 填做 0，當呢個係「未有戰鬥力紀錄」嘅底線值。輸出：name, filled_value。',
        en: "The data is still dirty. Use COALESCE to replace NULL power_level with 0, treated here as the floor value for 'no power level on record'. Columns: name, filled_value."
      },
      stocks: {
        zh: '資料仲係髒。有一筆報價嘅 close 係 NULL。用 COALESCE 揸返嗰日嘅 open 價頂替——好過亂咁填 0，因為股價實際上唔會係 0。輸出：ticker, trade_date, filled_value。',
        en: "The data is still dirty. One quote is missing its close price. Use COALESCE to fall back to that day's open price — far more realistic than zero, since a share price is never actually nil. Columns: ticker, trade_date, filled_value."
      }
    },
    intro: {
      zh: 'COALESCE(a, b, ...) 會揀返第一個唔係 NULL 嘅值，即刻幫你填返個預設值，唔使逐格判斷。同佢啱啱相反嘅係 NULLIF(a, b)——如果 a 同 b 相等就變返 NULL，等你可以主動整走一個值。',
      en: 'COALESCE(a, b, ...) returns the first value that is not NULL — the standard way to plug a gap with a sensible default, without checking each row by hand. NULLIF(a, b) does the reverse: it turns a value into NULL when it equals b, letting you manufacture a missing value on purpose.'
    },
    starter: (t) => themeAdapt(t, {
      football: 'SELECT name, COALESCE(',
      anime: 'SELECT name, COALESCE(',
      stocks: 'SELECT ticker, trade_date, COALESCE('
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: "SELECT name, COALESCE(nationality, 'Unknown') AS filled_value FROM players",
        columns: ['name', 'filled_value'],
        mustContainSQL: ['coalesce']
      },
      anime: {
        type: 'columns',
        expectedSQL: 'SELECT name, COALESCE(power_level, 0) AS filled_value FROM characters',
        columns: ['name', 'filled_value'],
        mustContainSQL: ['coalesce']
      },
      stocks: {
        type: 'columns',
        expectedSQL: 'SELECT ticker, trade_date, COALESCE(close, open) AS filled_value FROM prices',
        columns: ['ticker', 'trade_date', 'filled_value'],
        mustContainSQL: ['coalesce']
      }
    }),
    hints: {
      football: {
        zh: ['諗吓：想幫個 NULL 補一個預設值，唔通要逐格自己判斷？SQL 有個函數專門做呢件事。', '用 COALESCE(nationality, 預設值)——如果嗰格係 NULL 就用預設值，唔係就照用原本值。', '偽代碼：SELECT name, COALESCE(nationality, \'Unknown\') AS filled_value FROM players'],
        en: ['Think about it: filling a NULL with a sensible default should not need a manual check on every row. SQL has a function built exactly for this.', 'Use COALESCE(nationality, default_value) — it returns the default only where the column is NULL, otherwise the original value passes through.', "Pseudocode: SELECT name, COALESCE(nationality, 'Unknown') AS filled_value FROM players"]
      },
      anime: {
        zh: ['諗吓：想幫個 NULL 補一個預設值，唔通要逐格自己判斷？SQL 有個函數專門做呢件事。', '用 COALESCE(power_level, 預設值)——0 係一個唔會同真實戰鬥力數值撞埋一齊嘅底線值（表入面最細嘅真實值都有 40）。', '偽代碼：SELECT name, COALESCE(power_level, 0) AS filled_value FROM characters'],
        en: ['Think about it: filling a NULL with a sensible default should not need a manual check on every row. SQL has a function built exactly for this.', 'Use COALESCE(power_level, default_value) — 0 works as a floor that never collides with a real power level in this table (the lowest genuine value is 40).', 'Pseudocode: SELECT name, COALESCE(power_level, 0) AS filled_value FROM characters']
      },
      stocks: {
        zh: ['諗吓：想幫個 NULL 補一個預設值，唔通要逐格自己判斷？SQL 有個函數專門做呢件事。', '用 COALESCE(close, 預設值)——填 0 冇意思，因為股價唔會係 0；不如揸返同一行嘅 open 價當個合理近似值。', '偽代碼：SELECT ticker, trade_date, COALESCE(close, open) AS filled_value FROM prices'],
        en: ['Think about it: filling a NULL with a sensible default should not need a manual check on every row. SQL has a function built exactly for this.', "Use COALESCE(close, default_value) — filling with 0 makes no sense for a share price; the same row's own open price is a far more realistic stand-in.", 'Pseudocode: SELECT ticker, trade_date, COALESCE(close, open) AS filled_value FROM prices']
      }
    }
  },
  {
    id: 's2-robust-avg',
    stage: '10→50',
    title: { zh: '魯棒平均', en: 'A robust average' },
    concepts: ['防禦性查詢', 'defensive SQL'],
    chaos: true,
    briefing: {
      football: {
        zh: '計平均 market_value_m，排除 NULL 同負數。輸出：clean_avg。',
        en: 'Average market_value_m, excluding NULL and negatives. Column: clean_avg.'
      },
      anime: {
        zh: '計平均 rating，排除 NULL 同 >10。輸出：clean_avg。',
        en: 'Average rating, excluding NULL and values over 10. Column: clean_avg.'
      },
      stocks: {
        zh: '計平均 volume，排除 NULL 同負數。輸出：clean_avg。',
        en: 'Average volume, excluding NULL and negatives. Column: clean_avg.'
      }
    },
    intro: {
      zh: '現實數據好髒。合理範圍要你自己擋——唔好盲目 AVG(*)。',
      en: 'Real data is messy. You must gate sensible ranges — do not blindly AVG everything.'
    },
    starter: 'SELECT AVG(',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: 'SELECT AVG(market_value_m) AS clean_avg FROM players WHERE market_value_m IS NOT NULL AND market_value_m >= 0',
        columns: ['clean_avg'],
        mustContainSQL: ['is not null']
      },
      anime: {
        type: 'columns',
        expectedSQL: 'SELECT AVG(rating) AS clean_avg FROM series WHERE rating IS NOT NULL AND rating <= 10',
        columns: ['clean_avg'],
        mustContainSQL: ['is not null']
      },
      stocks: {
        type: 'columns',
        expectedSQL: 'SELECT AVG(volume) AS clean_avg FROM prices WHERE volume IS NOT NULL AND volume >= 0',
        columns: ['clean_avg'],
        mustContainSQL: ['is not null']
      }
    }),
    hints: {
      football: {
        zh: ['AVG 會自動忽略 NULL，但負數要你自己擋。', '問吓自己：呢個欄嘅合理範圍係咩？', '偽代碼：WHERE 欄 IS NOT NULL AND 欄 >= 0'],
        en: ['AVG skips NULL automatically, but negative values are yours to catch.', 'Ask yourself: what is a sensible range for this column?', 'Pseudocode: WHERE col IS NOT NULL AND col >= 0']
      },
      anime: {
        zh: ['AVG 會自動忽略 NULL，但離晒譜嘅高分（好似 rating 15 分）要你自己擋。', '問吓自己：rating 呢類分數，合理上限係幾多？', '偽代碼：WHERE 欄 IS NOT NULL AND 欄 <= 10'],
        en: ['AVG skips NULL automatically, but an implausible high outlier (a rating of 15, say) is yours to catch.', 'Ask yourself: what is a sensible ceiling for a rating like this?', 'Pseudocode: WHERE col IS NOT NULL AND col <= 10']
      },
      stocks: {
        zh: ['AVG 會自動忽略 NULL，但負數要你自己擋。', '問吓自己：成交量（volume）嘅合理範圍係咩？', '偽代碼：WHERE 欄 IS NOT NULL AND 欄 >= 0'],
        en: ['AVG skips NULL automatically, but negative volume is yours to catch.', 'Ask yourself: what is a sensible range for trading volume?', 'Pseudocode: WHERE col IS NOT NULL AND col >= 0']
      }
    }
  },
  {
    id: 's2-cte',
    stage: '10→50',
    title: { zh: 'CTE：WITH 子句', en: 'CTE: the WITH clause' },
    concepts: ['WITH', 'CTE'],
    chaos: true,
    briefing: {
      football: {
        zh: '呢次唔淨係計 clean_avg，仲要用 CTE 攞埋有幾多行 market_value_m 係乾淨嘅：先用 WITH 揀走 NULL 同負數，跟住喺嗰個 CTE 度一次過計 AVG 同 COUNT。輸出：clean_avg, clean_count。',
        en: 'This time also return how many rows are clean, via a CTE: use WITH to strip out NULL and negative market_value_m first, then compute both AVG and COUNT from that named result. Columns: clean_avg, clean_count.'
      },
      anime: {
        zh: '呢次唔淨係計 clean_avg，仲要用 CTE 攞埋有幾多套戲嘅 rating 係乾淨嘅：先用 WITH 揀走 NULL 同 >10 嘅 rating，跟住一次過計 AVG 同 COUNT。輸出：clean_avg, clean_count。',
        en: 'This time also return how many series have a clean rating, via a CTE: use WITH to strip out NULL and ratings over 10 first, then compute both AVG and COUNT. Columns: clean_avg, clean_count.'
      },
      stocks: {
        zh: '呢次唔淨係計 clean_avg，仲要用 CTE 攞埋有幾多日嘅 volume 係乾淨嘅：先用 WITH 揀走 NULL 同負數嘅 volume，跟住一次過計 AVG 同 COUNT。輸出：clean_avg, clean_count。',
        en: 'This time also return how many days have a clean volume, via a CTE: use WITH to strip out NULL and negative volume first, then compute both AVG and COUNT. Columns: clean_avg, clean_count.'
      }
    },
    intro: {
      zh: 'WITH 幫你將一個已經篩選過嘅結果改個名，好似 clean_rows 噉，跟住主 query 就可以直接 SELECT 落去，唔使成條 WHERE 抄多次。想喺同一批乾淨資料度計多過一個聚合（例如又要 AVG 又要 COUNT），CTE 就特別好使。',
      en: 'WITH names a filtered result — say, clean_rows — so the outer query can simply select from it, without repeating the same WHERE condition. It earns its keep once you want more than one aggregate, such as AVG and COUNT, computed over exactly the same clean rows.'
    },
    starter: 'WITH clean_rows AS (\n  SELECT \n)\n\nSELECT AVG(',
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `WITH clean_rows AS (
  SELECT market_value_m FROM players
  WHERE market_value_m IS NOT NULL AND market_value_m >= 0
)
SELECT AVG(market_value_m) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows`,
        columns: ['clean_avg', 'clean_count'],
        mustContainSQL: ['with', 'is not null']
      },
      anime: {
        type: 'columns',
        expectedSQL: `WITH clean_rows AS (
  SELECT rating FROM series
  WHERE rating IS NOT NULL AND rating <= 10
)
SELECT AVG(rating) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows`,
        columns: ['clean_avg', 'clean_count'],
        mustContainSQL: ['with', 'is not null']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `WITH clean_rows AS (
  SELECT volume FROM prices
  WHERE volume IS NOT NULL AND volume >= 0
)
SELECT AVG(volume) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows`,
        columns: ['clean_avg', 'clean_count'],
        mustContainSQL: ['with', 'is not null']
      }
    }),
    hints: {
      football: {
        zh: ['諗吓：呢次要喺同一批「乾淨」market_value_m 度，一次過計 AVG 又計 COUNT，個篩選條件駛唔駛寫兩次先得？', 'WITH 可以幫你將個已經篩走 NULL 同負數嘅 subquery 改名，例如 clean_rows，主 query 就淨係 SELECT ... FROM clean_rows，唔使再抄多次 WHERE。', '偽代碼：WITH clean_rows AS (SELECT market_value_m FROM players WHERE market_value_m IS NOT NULL AND market_value_m >= 0) SELECT AVG(market_value_m) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows'],
        en: ['Think about it: you need both an AVG and a COUNT from the same clean market_value_m rows — must the filter be written out twice?', 'WITH lets you name a subquery that has already dropped NULL and negative values, e.g. clean_rows, so the outer query can just SELECT ... FROM clean_rows without repeating the WHERE.', 'Pseudocode: WITH clean_rows AS (SELECT market_value_m FROM players WHERE market_value_m IS NOT NULL AND market_value_m >= 0) SELECT AVG(market_value_m) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows']
      },
      anime: {
        zh: ['諗吓：呢次要喺同一批「乾淨」rating 度，一次過計 AVG 又計 COUNT，個篩選條件駛唔駛寫兩次先得？', 'WITH 可以幫你將個已經篩走 NULL 同離晒譜高分（>10）嘅 subquery 改名，例如 clean_rows，主 query 就淨係 SELECT ... FROM clean_rows。', '偽代碼：WITH clean_rows AS (SELECT rating FROM series WHERE rating IS NOT NULL AND rating <= 10) SELECT AVG(rating) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows'],
        en: ['Think about it: you need both an AVG and a COUNT from the same clean ratings — must the filter be written out twice?', 'WITH lets you name a subquery that has already dropped NULL and an implausible high rating (over 10), e.g. clean_rows, so the outer query can just SELECT ... FROM clean_rows.', 'Pseudocode: WITH clean_rows AS (SELECT rating FROM series WHERE rating IS NOT NULL AND rating <= 10) SELECT AVG(rating) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows']
      },
      stocks: {
        zh: ['諗吓：呢次要喺同一批「乾淨」volume 度，一次過計 AVG 又計 COUNT，個篩選條件駛唔駛寫兩次先得？', 'WITH 可以幫你將個已經篩走 NULL 同負數 volume 嘅 subquery 改名，例如 clean_rows，主 query 就淨係 SELECT ... FROM clean_rows。', '偽代碼：WITH clean_rows AS (SELECT volume FROM prices WHERE volume IS NOT NULL AND volume >= 0) SELECT AVG(volume) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows'],
        en: ['Think about it: you need both an AVG and a COUNT from the same clean volume figures — must the filter be written out twice?', 'WITH lets you name a subquery that has already dropped NULL and negative volume, e.g. clean_rows, so the outer query can just SELECT ... FROM clean_rows.', 'Pseudocode: WITH clean_rows AS (SELECT volume FROM prices WHERE volume IS NOT NULL AND volume >= 0) SELECT AVG(volume) AS clean_avg, COUNT(*) AS clean_count FROM clean_rows']
      }
    }
  },
  {
    id: 's2b-normalise-and-fix',
    stage: '10→50',
    title: { zh: '唔止過濾：用 TRIM 同 UPDATE 真正修正', en: "Fix it, don't just filter it: TRIM and UPDATE" },
    concepts: ['TRIM', 'UPPER/LOWER', 'UPDATE', 'WHERE (targeting exact rows)', 'BEGIN/COMMIT (brief mention)'],
    chaos: true,
    briefing: {
      football: {
        zh: 'clubs 表入面 club_id = 1 嗰行壞咗兩處：city 前後多咗空格（\'  London  \'），name 又被人打成細楷 \'arsenal\'。先用 SELECT + TRIM()/UPPER() 睇吓個乾淨版本應該點樣，跟住真係寫一句 UPDATE 去修正個 row（唔係淨係遮住佢）——記住要有 WHERE，淨係改 club_id = 1 嗰一行。',
        en: "In the clubs table, the row for club_id = 1 is broken in two places: city is padded with whitespace ('  London  '), and name has been lower-cased to 'arsenal'. First SELECT with TRIM()/UPPER() to preview what the clean version should look like, then write an actual UPDATE that corrects the stored row (not merely hides the mess) — remember the WHERE, touching only club_id = 1."
      },
      anime: {
        zh: 'series 表入面 series_id = 2（Demon Slayer）嘅 title 前後多咗空格，變咗 \'  Demon Slayer  \'。先用 SELECT + TRIM() 睇吓個乾淨版本，跟住寫一句 UPDATE 去真正修正個 row——記住要有 WHERE，淨係改 series_id = 2 嗰一行。',
        en: "In the series table, the title for series_id = 2 (Demon Slayer) is padded with whitespace: '  Demon Slayer  '. First SELECT with TRIM() to preview the clean version, then write an UPDATE that actually corrects the row — remember the WHERE, touching only series_id = 2."
      },
      stocks: {
        zh: 'companies 表入面 AAPL 嗰行嘅 name 已經全部變咗細楷 \'apple inc.\'。SQLite 冇內建嘅 title-case／INITCAP function，所以第一步淨係用 SELECT + UPPER()/SUBSTR() 睇吓得出嚟嘅字（會發現淨係第一個字母大楷，\'Inc.\' 嗰個 I 都仲係細楷，證明呢個方法唔完美），跟住直接用 UPDATE 將個名 hard-code 返正確嘅 \'Apple Inc.\'——記住要有 WHERE，淨係改 ticker = \'AAPL\' 嗰一行。',
        en: "In the companies table, the name for AAPL has been lower-cased to 'apple inc.'. SQLite has no built-in title-case/INITCAP function, so first SELECT with UPPER()/SUBSTR() to see what a naive fix produces (you will notice it only capitalises the very first letter — 'Inc.' still reads 'inc.', proving the trick is imperfect). Then use UPDATE to hard-code the actual correct display name 'Apple Inc.' back into the row — remember the WHERE, touching only ticker = 'AAPL'."
      }
    },
    intro: {
      zh: '之前嗰啲髒數據課淨係教你用 WHERE 揦埋一邊——個 row 本身仲係錯㗎，你只不過眼唔見為乾淨。TRIM() 同 UPPER()/LOWER() 可以喺讀嗰陣預覽個乾淨版本，但真正令個 row 喺表入面改咗嘅係 UPDATE。喺真實系統度，你會用 BEGIN … COMMIT 包住呢啲修正，等錯誤嘅 UPDATE 隨時可以 rollback。',
      en: 'Earlier chaos lessons only ever taught you to filter bad data out of the way with WHERE — the row stayed broken, you just looked past it. TRIM() and UPPER()/LOWER() let you preview a clean value at read time, but UPDATE is what actually rewrites the row in the table. In a real system you would wrap the fix in BEGIN … COMMIT so a mistaken UPDATE can be rolled back before it is permanent.'
    },
    starter: (t) => themeAdapt(t, {
      football: '-- Step 1 (optional): preview the fix with SELECT + TRIM()/UPPER()\n-- Step 2: write the UPDATE that actually corrects the stored row\n\nUPDATE clubs SET city = , name = \nWHERE club_id = 1;\n',
      anime: '-- Step 1 (optional): preview the fix with SELECT + TRIM()\n-- Step 2: write the UPDATE that actually corrects the stored row\n\nUPDATE series SET title = \nWHERE series_id = 2;\n',
      stocks: '-- Step 1 (optional): preview a naive fix with SELECT + UPPER()/SUBSTR() — note SQLite has no built-in INITCAP\n-- Step 2: write the UPDATE that actually corrects the stored row\n\nUPDATE companies SET name = \nWHERE ticker = \'AAPL\';\n'
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'fix',
        mustContainSQL: ['update', 'where'],
        checkSQL: 'SELECT club_id, city, name FROM clubs WHERE club_id IN (1, 2) ORDER BY club_id',
        columns: ['club_id', 'city', 'name'],
        expectedValues: [[1, 'London', 'Arsenal'], [2, 'Liverpool', 'Liverpool']]
      },
      anime: {
        type: 'fix',
        mustContainSQL: ['update', 'where'],
        checkSQL: 'SELECT series_id, title FROM series WHERE series_id IN (1, 2) ORDER BY series_id',
        columns: ['series_id', 'title'],
        expectedValues: [[1, 'Attack on Titan'], [2, 'Demon Slayer']]
      },
      stocks: {
        type: 'fix',
        mustContainSQL: ['update', 'where'],
        checkSQL: "SELECT ticker, name FROM companies WHERE ticker IN ('AAPL', 'TSLA') ORDER BY ticker",
        columns: ['ticker', 'name'],
        expectedValues: [['AAPL', 'Apple Inc.'], ['TSLA', 'Tesla Inc.']]
      }
    }),
    hints: {
      football: {
        zh: ['淨係 SELECT 睇到「啱嘅版本」係唔夠嘅——嗰個 row 喺表入面實際上仲係錯，一定要用 UPDATE 先至真正改咗佢。', '記得要有 WHERE，針對 club_id = 1 嗰一行——冇 WHERE 嘅話，你會將全部球會嘅 name 都一併洗晒。', '偽代碼：UPDATE clubs SET city = TRIM(city), name = \'Arsenal\' WHERE club_id = 1;（真實系統仲會用 BEGIN...COMMIT 包住呢句 UPDATE，方便出錯可以 rollback）'],
        en: ['Seeing the "clean version" via SELECT is not enough — the row in the table is still wrong until an UPDATE actually changes it.', 'Remember the WHERE, targeting only club_id = 1 — without it, you would overwrite every club\'s name at once.', "Pseudocode: UPDATE clubs SET city = TRIM(city), name = 'Arsenal' WHERE club_id = 1; (in production you would also wrap that UPDATE in BEGIN … COMMIT so a mistake can be rolled back)"]
      },
      anime: {
        zh: ['SELECT + TRIM() 淨係俾你睇吓「應該點」，個 row 本身喺表入面仲係髒嘅。', '記得要有 WHERE，針對 series_id = 2 嗰一行——冇 WHERE 嘅話，你會將全部作品嘅 title 都一併改晒。', '偽代碼：UPDATE series SET title = TRIM(title) WHERE series_id = 2;（真實系統會用 BEGIN...COMMIT 包住，出錯就可以 rollback）'],
        en: ['SELECT + TRIM() only shows you what it should look like — the row itself is still dirty in the table.', 'Remember the WHERE, targeting only series_id = 2 — without it, you would rewrite every series\' title at once.', 'Pseudocode: UPDATE series SET title = TRIM(title) WHERE series_id = 2; (in production, wrap the UPDATE in BEGIN … COMMIT so it can be rolled back)']
      },
      stocks: {
        zh: ['UPPER(SUBSTR(name,1,1)) || SUBSTR(name,2) 淨係大楷返第一個字，跟住嗰啲字（包括 \'Inc.\'）都改唔到——SQLite 冇內建嘅 title-case function。', '與其硬砌字串函數，不如直接 UPDATE companies SET name = \'Apple Inc.\' WHERE ticker = \'AAPL\'，hard-code 返正確個名；記住 WHERE 唔可以少。', '偽代碼：UPDATE companies SET name = \'Apple Inc.\' WHERE ticker = \'AAPL\';（真實系統會用 BEGIN...COMMIT 包住，方便 rollback）'],
        en: ["UPPER(SUBSTR(name,1,1)) || SUBSTR(name,2) only capitalises the first letter — the rest of the string, including 'Inc.', stays as it was; SQLite has no built-in title-case function.", "Rather than fighting string functions, just UPDATE companies SET name = 'Apple Inc.' WHERE ticker = 'AAPL' and hard-code the correct name back — the WHERE is not optional.", "Pseudocode: UPDATE companies SET name = 'Apple Inc.' WHERE ticker = 'AAPL'; (in production, wrap the UPDATE in BEGIN … COMMIT so it can be rolled back)"]
      }
    }
  },
  {
    id: 's2b-date-functions',
    stage: '10→50',
    title: { zh: '日期陷阱：睇落似日期唔代表係日期', en: 'The date trap: looks like a date, is not a date' },
    concepts: ['date()', 'strftime()', 'ISO-8601', 'TEXT dates'],
    chaos: true,
    briefing: {
      football: {
        zh: '資料已變髒。matches.match_date 入面有兩筆用咗唔同格式寫嘅日期（唔係 YYYY-MM-DD）。用 date() 函數搵出嗰啲 SQLite 解析唔到嘅列。',
        en: "The data is dirty. Two rows in matches.match_date were written in other, non-ISO shapes. Use the date() function to find the rows SQLite cannot parse."
      },
      anime: {
        zh: '資料已變髒。episodes.air_date 入面有兩筆用咗唔同格式寫嘅日期（唔係 YYYY-MM-DD）。用 date() 函數搵出嗰啲 SQLite 解析唔到嘅列。',
        en: "The data is dirty. Two rows in episodes.air_date were written in other, non-ISO shapes. Use the date() function to find the rows SQLite cannot parse."
      },
      stocks: {
        zh: '資料已變髒。prices.trade_date 入面有兩筆用咗唔同格式寫嘅日期（唔係 YYYY-MM-DD）。用 date() 函數搵出嗰啲 SQLite 解析唔到嘅列。',
        en: "The data is dirty. Two rows in prices.trade_date were written in other, non-ISO shapes. Use the date() function to find the rows SQLite cannot parse."
      }
    },
    intro: {
      zh: 'SQLite 嘅 date()／strftime() 淨係識 ISO-8601 格式（YYYY-MM-DD）嘅 TEXT，唔會幫你認其他寫法。個欄「睇落似日期」唔代表 SQLite 解析得到——格式一唔啱，佢唔會報錯，淨係靜靜雞畀返 NULL，好易漏眼。',
      en: "SQLite's date()/strftime() only understand ISO-8601 TEXT (YYYY-MM-DD) — they will not recognise other formats for you. A column that looks like a date is not the same as one SQLite can parse: get the shape wrong and it does not raise an error, it quietly returns NULL, which is easy to miss."
    },
    starter: (t) => themeAdapt(t, {
      football: 'SELECT * FROM matches\nWHERE ',
      anime: 'SELECT * FROM episodes\nWHERE ',
      stocks: 'SELECT * FROM prices\nWHERE '
    }),
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM matches WHERE date(match_date) IS NULL' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM episodes WHERE date(air_date) IS NULL' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM prices WHERE date(trade_date) IS NULL' }
    }),
    hints: {
      football: {
        zh: ['SQLite 嘅 date() 淨係食到 YYYY-MM-DD 呢種格式，第二種寫法佢會唔識。', '用 date(欄) IS NULL 就搵到嗰啲解析唔到嘅列——留意呢個唔會報錯，淨係靜靜雞畀返 NULL。', '偽代碼：SELECT * FROM matches WHERE date(match_date) IS NULL'],
        en: ["SQLite's date() only accepts the YYYY-MM-DD shape; anything else it simply fails to read.", 'Wrap the column in date() and test IS NULL — that flags every row SQLite could not parse, silently, with no error.', 'Pseudocode: SELECT * FROM matches WHERE date(match_date) IS NULL']
      },
      anime: {
        zh: ['SQLite 嘅 date() 淨係食到 YYYY-MM-DD 呢種格式，第二種寫法佢會唔識。', '用 date(欄) IS NULL 就搵到嗰啲解析唔到嘅列——留意呢個唔會報錯，淨係靜靜雞畀返 NULL。', '偽代碼：SELECT * FROM episodes WHERE date(air_date) IS NULL'],
        en: ["SQLite's date() only accepts the YYYY-MM-DD shape; anything else it simply fails to read.", 'Wrap the column in date() and test IS NULL — that flags every row SQLite could not parse, silently, with no error.', 'Pseudocode: SELECT * FROM episodes WHERE date(air_date) IS NULL']
      },
      stocks: {
        zh: ['SQLite 嘅 date() 淨係食到 YYYY-MM-DD 呢種格式，第二種寫法佢會唔識。', '用 date(欄) IS NULL 就搵到嗰啲解析唔到嘅列——留意呢個唔會報錯，淨係靜靜雞畀返 NULL。', '偽代碼：SELECT * FROM prices WHERE date(trade_date) IS NULL'],
        en: ["SQLite's date() only accepts the YYYY-MM-DD shape; anything else it simply fails to read.", 'Wrap the column in date() and test IS NULL — that flags every row SQLite could not parse, silently, with no error.', 'Pseudocode: SELECT * FROM prices WHERE date(trade_date) IS NULL']
      }
    }
  },
  {
    id: 's2b-union',
    stage: '10→50',
    title: { zh: '用 UNION 疊結果', en: 'Combine result sets with UNION' },
    concepts: ['UNION', 'UNION ALL'],
    briefing: {
      football: {
        zh: '將 market_value_m >= 100 嘅「expensive」球員，同 market_value_m < 50 嘅「cheap」球員，用 UNION 疊做一個名單，加返個 tier 欄分開兩批。輸出：tier, name。（呢兩批球員本身冇重疊，所以呢鋪 UNION 同 UNION ALL 出嚟行數一樣——但寫法仍然要啱。）',
        en: 'Stack "expensive" players (market_value_m >= 100) with "cheap" players (market_value_m < 50) into one list using UNION, tagging each half with a tier column. Columns: tier, name. (The two groups never overlap, so UNION and UNION ALL happen to return the same row count here — but the syntax still matters.)'
      },
      anime: {
        zh: '將 protagonist 角色名同 antagonist 角色名用 UNION 疊做一個名單，帶埋 role 呢個欄分辨邊個係邊個。輸出：role, name。（呢個世界得返 Sukuna 一個 antagonist，名單會短啲；protagonist 同 antagonist 亦係互斥類別，所以呢鋪都見唔到 UNION 剔重複嘅效果——但學嘅係「點樣疊」。）',
        en: 'Stack protagonist names with antagonist names into one list using UNION, keeping the role column so you can tell which half a row came from. Columns: role, name. (This universe has only one antagonist, Sukuna, so the list is short; protagonist and antagonist are also mutually exclusive categories, so this particular query will not show UNION\'s deduplication in action — the point here is learning how to stack.)'
      },
      stocks: {
        zh: '用 companies JOIN ratings，揾出邊間公司評級係 BUY，邊間係 SELL，再用 UNION 疊做一個名單。輸出：company_name, rating。（呢度可以親眼見到 UNION 嘅效果：Apple 俾兩個唔同 analyst 都評咗 BUY，UNION 會淨係留低一行；試埋 UNION ALL 睇吓分別。）',
        en: 'Join companies to ratings, then use UNION to stack the companies rated BUY with those rated SELL into one list. Columns: company_name, rating. (Here you can watch the effect first-hand: two different analysts have both rated Apple BUY, so UNION keeps only one row for it — try UNION ALL to see the difference.)'
      }
    },
    intro: {
      zh: 'UNION 將兩個 SELECT 嘅結果由上疊落嚟，變成一個名單，仲會自動剔走完全一樣嘅重複列；淨係想乜都留低就用 UNION ALL。兩個 SELECT 嘅欄數同型態要對得上，SQLite 先畀你疊。',
      en: 'UNION stacks two SELECTs into a single list and quietly drops any row that exactly duplicates another; UNION ALL keeps every row, duplicates included. Both SELECTs must return the same number of columns, in compatible types, before SQLite will let you stack them.'
    },
    starter: (t) => themeAdapt(t, {
      football: 'SELECT \n  \nFROM players\nWHERE \n\nUNION\n\nSELECT \n  \nFROM players\nWHERE ',
      anime: 'SELECT \n  \nFROM characters\nWHERE \n\nUNION\n\nSELECT \n  \nFROM characters\nWHERE ',
      stocks: 'SELECT \n  \nFROM companies c JOIN ratings r ON c.ticker = r.ticker\nWHERE \n\nUNION\n\nSELECT \n  \nFROM companies c JOIN ratings r ON c.ticker = r.ticker\nWHERE '
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT 'expensive' AS tier, name FROM players WHERE market_value_m >= 100
UNION
SELECT 'cheap' AS tier, name FROM players WHERE market_value_m < 50`,
        columns: ['tier', 'name'],
        mustContainSQL: ['union']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT role, name FROM characters WHERE role = 'protagonist'
UNION
SELECT role, name FROM characters WHERE role = 'antagonist'`,
        columns: ['role', 'name'],
        mustContainSQL: ['union']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT c.name AS company_name, r.rating
FROM companies c JOIN ratings r ON c.ticker = r.ticker
WHERE r.rating = 'BUY'
UNION
SELECT c.name AS company_name, r.rating
FROM companies c JOIN ratings r ON c.ticker = r.ticker
WHERE r.rating = 'SELL'`,
        columns: ['company_name', 'rating'],
        mustContainSQL: ['union']
      }
    }),
    hints: {
      football: {
        zh: ['諗吓：你想將「兩個唔同條件揀出嚟嘅球員」變成一個名單，中間要用邊個 keyword 將佢哋疊埋？', '兩個 SELECT 之間寫 UNION；兩邊嘅欄數要一樣，仲要加返一個文字 literal 做 tier（例如 SELECT \'expensive\' AS tier, ...）。', '偽代碼：\nSELECT \'expensive\' AS tier, name FROM players WHERE market_value_m >= 100\nUNION\nSELECT \'cheap\' AS tier, name FROM players WHERE market_value_m < 50'],
        en: ['Think about it: you want two differently-filtered lists of players to become one list — which keyword stacks them?', "Write UNION between the two SELECTs; make sure both sides return the same number of columns, and add a literal string column (e.g. SELECT 'expensive' AS tier, ...) to tag each half.", "Pseudocode:\nSELECT 'expensive' AS tier, name FROM players WHERE market_value_m >= 100\nUNION\nSELECT 'cheap' AS tier, name FROM players WHERE market_value_m < 50"]
      },
      anime: {
        zh: ['你要將 protagonist 嗰組同 antagonist 嗰組變做一個名單，兩個 SELECT 之間要用邊個 keyword？', '兩邊都揀 role, name 呢兩個欄，中間寫 UNION；留意 antagonist 嗰邊得返 Sukuna 一個。', '偽代碼：\nSELECT role, name FROM characters WHERE role = \'protagonist\'\nUNION\nSELECT role, name FROM characters WHERE role = \'antagonist\''],
        en: ['You need to turn the protagonist group and the antagonist group into one list — which keyword stacks two SELECTs?', 'Select role, name on both sides, with UNION in between; note the antagonist side only has Sukuna.', "Pseudocode:\nSELECT role, name FROM characters WHERE role = 'protagonist'\nUNION\nSELECT role, name FROM characters WHERE role = 'antagonist'"]
      },
      stocks: {
        zh: ['先用 JOIN 攞返 company name 同 rating，再諗吓點樣將「BUY 嗰組」同「SELL 嗰組」變做一個名單。', '兩個 SELECT（各自 JOIN 埋 companies 同 ratings，再用 WHERE rating = \'BUY\' 或 \'SELL\'）中間寫 UNION。', '偽代碼：\nSELECT c.name AS company_name, r.rating FROM companies c JOIN ratings r ON c.ticker = r.ticker WHERE r.rating = \'BUY\'\nUNION\nSELECT c.name AS company_name, r.rating FROM companies c JOIN ratings r ON c.ticker = r.ticker WHERE r.rating = \'SELL\''],
        en: ['First JOIN to get the company name alongside its rating, then think about turning the "BUY" group and the "SELL" group into one list.', 'Write UNION between two SELECTs, each joining companies to ratings and filtering WHERE rating = \'BUY\' or \'SELL\'.', "Pseudocode:\nSELECT c.name AS company_name, r.rating FROM companies c JOIN ratings r ON c.ticker = r.ticker WHERE r.rating = 'BUY'\nUNION\nSELECT c.name AS company_name, r.rating FROM companies c JOIN ratings r ON c.ticker = r.ticker WHERE r.rating = 'SELL'"]
      }
    }
  },
  {
    id: 's3-explain',
    stage: '50→100',
    title: { zh: '讀 EXPLAIN', en: 'Read EXPLAIN' },
    concepts: ['EXPLAIN', 'QUERY PLAN'],
    briefing: {
      football: {
        zh: '對「England 球員」查詢跑 EXPLAIN QUERY PLAN。',
        en: 'Run EXPLAIN QUERY PLAN on the England-players query.'
      },
      anime: {
        zh: '對「Action 作品」查詢跑 EXPLAIN QUERY PLAN。',
        en: 'Run EXPLAIN QUERY PLAN on the Action-series query.'
      },
      stocks: {
        zh: '對「HK 公司」查詢跑 EXPLAIN QUERY PLAN。',
        en: 'Run EXPLAIN QUERY PLAN on the HK-companies query.'
      }
    },
    intro: {
      zh: '啱啱幾堂你都係度攞緊「啱嘅」數；而家轉個角度，睇下資料庫背後點樣去搵呢啲數。EXPLAIN 唔回業務列，而係講執行路徑。SCAN＝全表掃；SEARCH USING INDEX＝用咗索引。',
      en: 'Until now you have been shaping and cleaning the right data; now turn the lens around and see how the database actually finds it. EXPLAIN returns an execution path, not business rows. SCAN = full table; SEARCH USING INDEX = indexed lookup.'
    },
    starter: (t) => themeAdapt(t, {
      football: "EXPLAIN QUERY PLAN\nSELECT * FROM players WHERE nationality = 'England';",
      anime: "EXPLAIN QUERY PLAN\nSELECT * FROM series WHERE genre = 'Action';",
      stocks: "EXPLAIN QUERY PLAN\nSELECT * FROM companies WHERE country = 'HK';"
    }),
    validate: (t) => themeAdapt(t, {
      football: { type: 'explain', mustContainSQL: ['players', 'nationality'] },
      anime: { type: 'explain', mustContainSQL: ['series', 'genre'] },
      stocks: { type: 'explain', mustContainSQL: ['companies', 'country'] }
    }),
    hints: {
      zh: ['語句要以 EXPLAIN QUERY PLAN 開頭。', '細庫睇唔出快慢；大數據先見分別。', '下一步通常係為過濾欄建 INDEX。'],
      en: ['Start the statement with EXPLAIN QUERY PLAN.', 'Tiny demos hide cost; large data reveals it.', 'Next step is often an INDEX on the filter column.']
    }
  },
  {
    id: 's3-index',
    stage: '50→100',
    title: { zh: '建立 Index', en: 'Create an index' },
    concepts: ['CREATE INDEX'],
    briefing: {
      football: {
        zh: '為 players.nationality 建立索引 idx_players_nat。',
        en: 'Create index idx_players_nat on players(nationality).'
      },
      anime: {
        zh: '為 series.genre 建立索引 idx_series_genre。',
        en: 'Create index idx_series_genre on series(genre).'
      },
      stocks: {
        zh: '為 companies.country 建立索引 idx_companies_country。',
        en: 'Create index idx_companies_country on companies(country).'
      }
    },
    intro: {
      zh: '索引加快查找，但拖慢寫入。只建喺高頻過濾／JOIN 欄。',
      en: 'Indexes speed reads and slow writes. Build them on hot filter / JOIN columns only.'
    },
    starter: 'CREATE INDEX ',
    validate: (t) => themeAdapt(t, {
      football: { type: 'index', name: 'idx_players_nat', table: 'players', column: 'nationality' },
      anime: { type: 'index', name: 'idx_series_genre', table: 'series', column: 'genre' },
      stocks: { type: 'index', name: 'idx_companies_country', table: 'companies', column: 'country' }
    }),
    hints: {
      zh: ['語法：CREATE INDEX 名 ON 表(欄);', '建完再用 EXPLAIN 對比。', '唔好亂建——太多索引都係負擔。'],
      en: ['Syntax: CREATE INDEX name ON table(column);', 'Then re-run EXPLAIN to compare.', 'Do not spray indexes — each one has a cost.']
    }
  }
];

export function getLesson(id) {
  return CURRICULUM.find((l) => l.id === id);
}
