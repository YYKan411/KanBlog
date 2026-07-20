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
        zh: '按 market_value_m 由高至低排 players，只顯示最高 5 個。',
        en: 'Sort players by market_value_m descending; keep the top 5.'
      },
      anime: {
        zh: '按 power_level 由高至低排 characters，只顯示最高 5 個。',
        en: 'Sort characters by power_level descending; keep the top 5.'
      },
      stocks: {
        zh: '按 employees 由高至低排 companies，只顯示最高 3 個。',
        en: 'Sort companies by employees descending; keep the top 3.'
      }
    },
    intro: {
      zh: 'ORDER BY 決定順序；LIMIT 截斷結果。報表成日用。',
      en: 'ORDER BY sets the order; LIMIT truncates. Everyday report grammar.'
    },
    starter: 'SELECT * FROM ',
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM players ORDER BY market_value_m DESC LIMIT 5' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM characters ORDER BY power_level DESC LIMIT 5' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM companies ORDER BY employees DESC LIMIT 3' }
    }),
    hints: {
      zh: ['DESC 係由大到細。', 'LIMIT n 只要前 n 行。', '順序：SELECT → FROM → WHERE → ORDER BY → LIMIT'],
      en: ['DESC means high to low.', 'LIMIT n keeps the first n rows.', 'Order: SELECT → FROM → WHERE → ORDER BY → LIMIT']
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
      zh: 'INNER JOIN 只保留兩表對得上嘅列。對唔上就消失——可能造成樣本偏差。',
      en: 'INNER JOIN keeps only matching rows. Non-matches vanish — a common source of sample bias.'
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
      zh: ['ON 寫連接條件：外鍵 = 主鍵。', 'club_id 係 NULL 嘅列，INNER 之後會唔見。', '用表別名（p / c）令欄名清楚。'],
      en: ['ON states the match: foreign key = primary key.', 'Rows with NULL keys disappear under INNER.', 'Aliases (p / c) keep column names clear.']
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
      zh: ['想見到「冇配對」就要 LEFT，唔想就要 INNER。', '跑完搵吓有冇空嘅 club_name／rating。', '自由身球員係練習 LEFT 嘅好例子。'],
      en: ['Want unmatched left rows? Use LEFT. Otherwise INNER.', 'After running, look for empty club_name / rating.', 'Free agents are a good LEFT JOIN test.']
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
      zh: ['正確：WHERE 欄 IS NULL。', '先偵察，再決定填補定刪除。', 'Analyst 日常第一步往往係數 NULL。'],
      en: ['Correct form: WHERE col IS NULL.', 'Scout first; then decide fill or drop.', 'Counting NULLs is often an analyst’s first move.']
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
      zh: ['HAVING COUNT(*) > 1 即係重複。', '股票題先用 LOWER() 正規化。', '重複鍵會令 JOIN 之後行數暴升。'],
      en: ['HAVING COUNT(*) > 1 means duplicates.', 'For stocks, normalise with LOWER() first.', 'Duplicate keys explode row counts after JOINs.']
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
        columns: ['clean_avg']
      },
      anime: {
        type: 'columns',
        expectedSQL: 'SELECT AVG(rating) AS clean_avg FROM series WHERE rating IS NOT NULL AND rating <= 10',
        columns: ['clean_avg']
      },
      stocks: {
        type: 'columns',
        expectedSQL: 'SELECT AVG(volume) AS clean_avg FROM prices WHERE volume IS NOT NULL AND volume >= 0',
        columns: ['clean_avg']
      }
    }),
    hints: {
      zh: ['AVG 會忽略 NULL，但負數要你擋。', '先問：呢個欄合理範圍係咩？', 'WHERE 欄 IS NOT NULL AND 欄 >= 0'],
      en: ['AVG skips NULL, but you must block negatives.', 'Ask: what range is sensible for this field?', 'WHERE col IS NOT NULL AND col >= 0']
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
      zh: 'EXPLAIN 唔回業務列，而係講資料庫點搵資料。SCAN＝全表掃；SEARCH USING INDEX＝用咗索引。',
      en: 'EXPLAIN returns a plan, not business rows. SCAN = full table; SEARCH USING INDEX = indexed lookup.'
    },
    starter: (t) => themeAdapt(t, {
      football: "EXPLAIN QUERY PLAN\nSELECT * FROM players WHERE nationality = 'England';",
      anime: "EXPLAIN QUERY PLAN\nSELECT * FROM series WHERE genre = 'Action';",
      stocks: "EXPLAIN QUERY PLAN\nSELECT * FROM companies WHERE country = 'HK';"
    }),
    validate: { type: 'explain' },
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
      football: { type: 'index', name: 'idx_players_nat' },
      anime: { type: 'index', name: 'idx_series_genre' },
      stocks: { type: 'index', name: 'idx_companies_country' }
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
