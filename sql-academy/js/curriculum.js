/**
 * 四階段課程 —— 每題有：說明、starter、驗證方式、蘇格拉底提示階梯
 * validate: { type: 'rows'|'columns'|'sql'|'custom', ... }
 */

function themeAdapt(themeId, variants) {
  return variants[themeId] || variants.football;
}

export const CURRICULUM = [
  // ——— Stage 0→1：新手 ———
  {
    id: 's0-select',
    stage: '0→1',
    stageKey: 'beginner',
    title: '第一次 SELECT',
    concepts: ['SELECT', 'FROM', '*'],
    briefing: (t) => themeAdapt(t, {
      football: '睇吓 clubs 表入面有邊啲球會。用 SELECT 拎晒所有欄同所有列。',
      anime: '睇吓 series 表入面有邊啲作品。用 SELECT 拎晒所有欄同所有列。',
      stocks: '睇吓 companies 表入面有邊啲公司。用 SELECT 拎晒所有欄同所有列。'
    }),
    starter: (t) => themeAdapt(t, {
      football: '-- 試吓由 clubs 拎所有資料\nSELECT ',
      anime: '-- 試吓由 series 拎所有資料\nSELECT ',
      stocks: '-- 試吓由 companies 拎所有資料\nSELECT '
    }),
    schemaHint: (t) => themeAdapt(t, {
      football: ['clubs'],
      anime: ['series'],
      stocks: ['companies']
    }),
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM clubs' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM series' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM companies' }
    }),
    hints: [
      'SELECT 後面要寫你想拎邊啲欄。想拎晒全部，有個萬用符號。',
      '萬用符號係星號 *，跟住要用 FROM 講明邊張表。',
      '偽代碼：SELECT（所有欄）FROM（表名）。仲差表名同星號。'
    ]
  },
  {
    id: 's0-where',
    stage: '0→1',
    stageKey: 'beginner',
    title: '用 WHERE 過濾',
    concepts: ['WHERE', '比較運算'],
    briefing: (t) => themeAdapt(t, {
      football: '只拎出 nationality = \'England\' 嘅球員（players）。',
      anime: '只拎出 genre = \'Action\' 嘅作品（series）。',
      stocks: '只拎出 country = \'HK\' 嘅公司（companies）。'
    }),
    starter: '-- 記得字串要用單引號\nSELECT * FROM ',
    schemaHint: (t) => themeAdapt(t, {
      football: ['players'],
      anime: ['series'],
      stocks: ['companies']
    }),
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: "SELECT * FROM players WHERE nationality = 'England'" },
      anime: { type: 'sql', expectedSQL: "SELECT * FROM series WHERE genre = 'Action'" },
      stocks: { type: 'sql', expectedSQL: "SELECT * FROM companies WHERE country = 'HK'" }
    }),
    hints: [
      'WHERE 放喺 FROM 後面，用來過濾列。',
      '字串比較要用單引號，例如 WHERE city = \'London\'。',
      '偽代碼：SELECT * FROM 表 WHERE 欄 = \'值\'。'
    ]
  },
  {
    id: 's0-order-limit',
    stage: '0→1',
    stageKey: 'beginner',
    title: '排序同 Top N',
    concepts: ['ORDER BY', 'DESC', 'LIMIT'],
    briefing: (t) => themeAdapt(t, {
      football: '按 market_value_m 由高至低排 players，只顯示最高 5 個。',
      anime: '按 power_level 由高至低排 characters，只顯示最高 5 個。',
      stocks: '按 employees 由高至低排 companies，只顯示最高 3 個。'
    }),
    starter: 'SELECT * FROM ',
    schemaHint: (t) => themeAdapt(t, {
      football: ['players(market_value_m)'],
      anime: ['characters(power_level)'],
      stocks: ['companies(employees)']
    }),
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM players ORDER BY market_value_m DESC LIMIT 5' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM characters ORDER BY power_level DESC LIMIT 5' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM companies ORDER BY employees DESC LIMIT 3' }
    }),
    hints: [
      'ORDER BY 欄名 可以 ASC（細到大）或 DESC（大到細）。',
      '想只要前幾名，用 LIMIT n。',
      '順序係：SELECT → FROM → WHERE（可選）→ ORDER BY → LIMIT。'
    ]
  },
  {
    id: 's0-aggregate',
    stage: '0→1',
    stageKey: 'beginner',
    title: '聚合：COUNT / AVG',
    concepts: ['COUNT', 'AVG', 'GROUP BY'],
    briefing: (t) => themeAdapt(t, {
      football: '每個 position 有幾多球員？順便計埋平均 age。輸出欄：position, cnt, avg_age。',
      anime: '每個 role 有幾多角色？順便計埋平均 power_level。輸出欄：role, cnt, avg_power。',
      stocks: '每個 sector 有幾多間公司？順便計埋平均 employees。輸出欄：sector, cnt, avg_emp。'
    }),
    starter: 'SELECT ',
    schemaHint: (t) => themeAdapt(t, {
      football: ['players'],
      anime: ['characters'],
      stocks: ['companies']
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT position, COUNT(*) AS cnt, AVG(age) AS avg_age FROM players GROUP BY position`,
        columns: ['position', 'cnt', 'avg_age']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT role, COUNT(*) AS cnt, AVG(power_level) AS avg_power FROM characters GROUP BY role`,
        columns: ['role', 'cnt', 'avg_power']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT sector, COUNT(*) AS cnt, AVG(employees) AS avg_emp FROM companies GROUP BY sector`,
        columns: ['sector', 'cnt', 'avg_emp']
      }
    }),
    hints: [
      '聚合函數（COUNT、AVG）同「逐組睇」要配 GROUP BY。',
      'SELECT 入面嘅非聚合欄，必須出現喺 GROUP BY。',
      '可以用 AS 改欄名，例如 COUNT(*) AS cnt。'
    ]
  },

  // ——— Stage 1→10：中階 ———
  {
    id: 's1-inner-join',
    stage: '1→10',
    stageKey: 'intermediate',
    title: 'INNER JOIN：兩表交集會',
    concepts: ['INNER JOIN', 'ON'],
    briefing: (t) => themeAdapt(t, {
      football: '列出每個球員嘅名同所屬球會名。只有「有球會」嘅球員要出現（INNER JOIN）。輸出：player_name, club_name。',
      anime: '列出每個角色名同所屬作品名。只有「有作品」嘅角色。輸出：char_name, series_title。',
      stocks: '列出每筆 trade 嘅 ticker 同公司名。輸出：ticker, company_name, side, qty。'
    }),
    starter: 'SELECT\n  \nFROM ',
    schemaHint: (t) => themeAdapt(t, {
      football: ['players.club_id', 'clubs.club_id'],
      anime: ['characters.series_id', 'series.series_id'],
      stocks: ['trades.ticker', 'companies.ticker']
    }),
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
    hints: [
      'INNER JOIN 只保留兩表「對得上」嘅列。對唔上就消失。',
      'ON 後面寫連接條件：左邊外鍵 = 右邊主鍵。',
      '如果有球員 club_id 係 NULL，INNER JOIN 之後佢會唔見——呢個係預期行為。'
    ]
  },
  {
    id: 's1-left-join',
    stage: '1→10',
    stageKey: 'intermediate',
    title: 'LEFT JOIN：留住左邊',
    concepts: ['LEFT JOIN', 'NULL'],
    briefing: (t) => themeAdapt(t, {
      football: '列出所有球員，包括未有球會嘅（例如自由身）。冇球會就 club_name 顯示 NULL。輸出：player_name, club_name。',
      anime: '列出所有角色同作品名；理論上全部都有作品，但請用 LEFT JOIN 練習。輸出：char_name, series_title。',
      stocks: '列出所有公司，同佢哋最新一筆 rating（如果有）。提示：可以先簡單 LEFT JOIN ratings。輸出：ticker, company_name, rating。'
    }),
    starter: 'SELECT\n  \nFROM ',
    schemaHint: (t) => themeAdapt(t, {
      football: ['players', 'clubs — 留意 Harry Kane 嘅 club_id'],
      anime: ['characters', 'series'],
      stocks: ['companies', 'ratings']
    }),
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
    hints: [
      'LEFT JOIN：左邊表全部保留；右邊對唔上就填 NULL。',
      '問自己：我想唔想見到「冇配對」嗰啲列？想就要 LEFT，唔想就要 INNER。',
      '跑完結果後，搵吓有冇 club_name / series_title / rating 係空嘅列——嗰啲就係 LEFT 留低嘅。'
    ]
  },
  {
    id: 's1-window-rank',
    stage: '1→10',
    stageKey: 'intermediate',
    title: 'Window：RANK()',
    concepts: ['WINDOW', 'RANK', 'OVER', 'PARTITION BY'],
    briefing: (t) => themeAdapt(t, {
      football: '喺每個 position 入面，按 market_value_m 由高到低排行。輸出：name, position, market_value_m, rnk。',
      anime: '喺每個 role 入面，按 power_level 由高到低排行。輸出：name, role, power_level, rnk。',
      stocks: '喺每個 sector 入面，按 employees 由高到低排行。輸出：ticker, sector, employees, rnk。'
    }),
    starter: 'SELECT\n  name,\n  \nFROM ',
    schemaHint: (t) => themeAdapt(t, {
      football: ['RANK() OVER (PARTITION BY ... ORDER BY ...)'],
      anime: ['RANK() OVER (PARTITION BY ... ORDER BY ...)'],
      stocks: ['RANK() OVER (PARTITION BY ... ORDER BY ...)']
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT name, position, market_value_m,
RANK() OVER (PARTITION BY position ORDER BY market_value_m DESC) AS rnk
FROM players`,
        columns: ['name', 'position', 'market_value_m', 'rnk']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT name, role, power_level,
RANK() OVER (PARTITION BY role ORDER BY power_level DESC) AS rnk
FROM characters`,
        columns: ['name', 'role', 'power_level', 'rnk']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT ticker, sector, employees,
RANK() OVER (PARTITION BY sector ORDER BY employees DESC) AS rnk
FROM companies`,
        columns: ['ticker', 'sector', 'employees', 'rnk']
      }
    }),
    hints: [
      'Window function 唔會合併列（同 GROUP BY 唔同），只係喺每列旁加一個計算值。',
      'OVER() 入面：PARTITION BY 定義「組」，ORDER BY 定義「組內點排」。',
      '偽代碼：RANK() OVER (PARTITION BY 組欄 ORDER BY 數值 DESC) AS rnk'
    ]
  },
  {
    id: 's1-running-total',
    stage: '1→10',
    stageKey: 'intermediate',
    title: '累計：SUM() OVER',
    concepts: ['SUM OVER', 'ROWS UNBOUNDED PRECEDING'],
    briefing: (t) => themeAdapt(t, {
      football: '按 match_date 排序，計 Arsenal（club_id=1）作主場時嘅累計主場入球。輸出：match_date, home_goals, running_goals。',
      anime: '按 air_date 排序，計 series_id=5（Frieren）集數嘅累計 viewers_m。輸出：air_date, viewers_m, running_viewers。',
      stocks: '按 trade_date 排序，計 AAPL 嘅累計成交量 volume。輸出：trade_date, volume, running_vol。'
    }),
    starter: 'SELECT\n  \nFROM ',
    schemaHint: (t) => themeAdapt(t, {
      football: ['matches — 先 WHERE home_club_id = 1'],
      anime: ['episodes — 先 WHERE series_id = 5'],
      stocks: ['prices — 先 WHERE ticker = \'AAPL\'']
    }),
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT match_date, home_goals,
SUM(home_goals) OVER (ORDER BY match_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_goals
FROM matches WHERE home_club_id = 1`,
        columns: ['match_date', 'home_goals', 'running_goals']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT air_date, viewers_m,
SUM(viewers_m) OVER (ORDER BY air_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_viewers
FROM episodes WHERE series_id = 5`,
        columns: ['air_date', 'viewers_m', 'running_viewers']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT trade_date, volume,
SUM(volume) OVER (ORDER BY trade_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_vol
FROM prices WHERE ticker = 'AAPL'`,
        columns: ['trade_date', 'volume', 'running_vol']
      }
    }),
    hints: [
      '累計加總常用 SUM(欄) OVER (ORDER BY 時間 ...)。',
      'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW 意思係「由開頭加到依家呢行」。',
      '記得先用 WHERE 收窄到你關心嘅實體（某個球會／作品／ticker）。'
    ]
  },

  // ——— Stage 10→50：實戰髒數據 ———
  {
    id: 's2-find-nulls',
    stage: '10→50',
    stageKey: 'chaos',
    title: '偵察：找出 NULL',
    concepts: ['IS NULL', '資料品質'],
    chaos: true,
    briefing: (t) => themeAdapt(t, {
      football: '資料庫已被「混亂製造機」污染。找出 nationality 係 NULL 嘅球員。輸出所有欄。',
      anime: '資料已變髒。找出 power_level 係 NULL 嘅角色。',
      stocks: '資料已變髒。找出 close 價係 NULL 嘅 prices 列。'
    }),
    starter: 'SELECT * FROM ',
    schemaHint: ['IS NULL —— 唔好寫 = NULL'],
    validate: (t) => themeAdapt(t, {
      football: { type: 'sql', expectedSQL: 'SELECT * FROM players WHERE nationality IS NULL' },
      anime: { type: 'sql', expectedSQL: 'SELECT * FROM characters WHERE power_level IS NULL' },
      stocks: { type: 'sql', expectedSQL: 'SELECT * FROM prices WHERE close IS NULL' }
    }),
    hints: [
      'NULL 唔係值，係「未知」。所以 = NULL 永遠唔會中。',
      '正確寫法：WHERE 欄 IS NULL（或者 IS NOT NULL）。',
      'Analyst 日常：先數 NULL 再決定填補定刪除——呢題只要求你搵出嚟。'
    ]
  },
  {
    id: 's2-dedupe',
    stage: '10→50',
    stageKey: 'chaos',
    title: '去重：發現重複',
    concepts: ['GROUP BY', 'HAVING', 'COUNT'],
    chaos: true,
    briefing: (t) => themeAdapt(t, {
      football: '有球員名被重複插入。搵出出現多過一次嘅 name，同埋出現次數 cnt。',
      anime: '有角色名重複。搵出出現多過一次嘅 name 同 cnt。',
      stocks: 'companies 出現重複 ticker。搵出出現多過一次嘅 ticker 同 cnt。（注意：主鍵衝突可能令 dirty seed 用其他方式——改為搵 name 大小寫混亂：用 LOWER(name) 分組找出問題。）'
    }),
    starter: 'SELECT ',
    schemaHint: ['HAVING COUNT(*) > 1'],
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT name, COUNT(*) AS cnt FROM players GROUP BY name HAVING COUNT(*) > 1`,
        columns: ['name', 'cnt']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT name, COUNT(*) AS cnt FROM characters GROUP BY name HAVING COUNT(*) > 1`,
        columns: ['name', 'cnt']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT LOWER(name) AS name_norm, COUNT(*) AS cnt FROM companies GROUP BY LOWER(name) HAVING COUNT(*) > 1`,
        columns: ['name_norm', 'cnt']
      }
    }),
    hints: [
      'GROUP BY 名之後，用 HAVING 過濾「組」——WHERE 過濾唔到聚合結果。',
      'COUNT(*) > 1 即係重複。',
      '股票題：大小寫唔統一時，用 LOWER() 正規化再分組。'
    ]
  },
  {
    id: 's2-date-normalize',
    stage: '10→50',
    stageKey: 'chaos',
    title: '日期格式混亂',
    concepts: ['LIKE', '資料清洗思維'],
    chaos: true,
    briefing: (t) => themeAdapt(t, {
      football: 'matches.match_date 混咗唔同格式。列出所有「唔似 YYYY-MM-DD」嘅列（用 NOT LIKE \'____-__-__\'）。',
      anime: 'episodes.air_date 格式混亂。列出唔似 YYYY-MM-DD 嘅集數。',
      stocks: 'prices.trade_date 格式混亂。列出唔似 YYYY-MM-DD 嘅報價。'
    }),
    starter: 'SELECT * FROM ',
    schemaHint: ["NOT LIKE '____-__-__'"],
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'sql',
        expectedSQL: "SELECT * FROM matches WHERE match_date NOT LIKE '____-__-__'"
      },
      anime: {
        type: 'sql',
        expectedSQL: "SELECT * FROM episodes WHERE air_date NOT LIKE '____-__-__'"
      },
      stocks: {
        type: 'sql',
        expectedSQL: "SELECT * FROM prices WHERE trade_date NOT LIKE '____-__-__'"
      }
    }),
    hints: [
      '現實世界日期好常寫成 17/08/2024 或者 Oct 2, 2024。',
      'SQLite 可用 LIKE 同底線 _ 配對固定長度模式。',
      '偽代碼：WHERE 日期欄 NOT LIKE \'____-__-__\''
    ]
  },
  {
    id: 's2-robust-avg',
    stage: '10→50',
    stageKey: 'chaos',
    title: '魯棒平均：排除垃圾值',
    concepts: ['WHERE', '防禦性查詢'],
    chaos: true,
    briefing: (t) => themeAdapt(t, {
      football: '計平均 market_value_m，但要排除 NULL 同負數。只輸出一個欄：clean_avg。',
      anime: '計平均 rating（series），排除 NULL 同 >10 嘅異常值。輸出：clean_avg。',
      stocks: '計平均 volume（prices），排除 NULL 同負數。輸出：clean_avg。'
    }),
    starter: 'SELECT AVG( ',
    schemaHint: ['防禦性 WHERE'],
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT AVG(market_value_m) AS clean_avg FROM players WHERE market_value_m IS NOT NULL AND market_value_m >= 0`,
        columns: ['clean_avg']
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT AVG(rating) AS clean_avg FROM series WHERE rating IS NOT NULL AND rating <= 10`,
        columns: ['clean_avg']
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT AVG(volume) AS clean_avg FROM prices WHERE volume IS NOT NULL AND volume >= 0`,
        columns: ['clean_avg']
      }
    }),
    hints: [
      'AVG 本身會忽略 NULL，但負數同離譜上限要你自己擋。',
      '先問：呢個欄合理範圍係咩？市值可唔可以負？評分可唔可以超過 10？',
      'WHERE 欄 IS NOT NULL AND 欄 >= 0（或適合嘅上限）。'
    ]
  },

  // ——— Stage 50→100：效能與架構 ———
  {
    id: 's3-explain-basic',
    stage: '50→100',
    stageKey: 'advanced',
    title: '讀 EXPLAIN',
    concepts: ['EXPLAIN', 'QUERY PLAN'],
    briefing: (t) => themeAdapt(t, {
      football: '對呢句跑 EXPLAIN QUERY PLAN：查出 England 球員。然後用導師解讀掃描方式。你嘅任務：提交帶 EXPLAIN QUERY PLAN 嘅語句。',
      anime: '對「Action 作品」查詢跑 EXPLAIN QUERY PLAN。',
      stocks: '對「HK 公司」查詢跑 EXPLAIN QUERY PLAN。'
    }),
    starter: (t) => themeAdapt(t, {
      football: 'EXPLAIN QUERY PLAN\nSELECT * FROM players WHERE nationality = \'England\';',
      anime: 'EXPLAIN QUERY PLAN\nSELECT * FROM series WHERE genre = \'Action\';',
      stocks: 'EXPLAIN QUERY PLAN\nSELECT * FROM companies WHERE country = \'HK\';'
    }),
    schemaHint: ['EXPLAIN QUERY PLAN ...'],
    validate: { type: 'explain' },
    hints: [
      'EXPLAIN QUERY PLAN 唔會跑出業務結果，而係告訴你資料庫點樣搵資料。',
      '見到 SCAN 即係全表掃描；SEARCH ... USING INDEX 即係用咗索引。',
      '呢題只要你成功跑出 query plan，導師會幫你解讀。'
    ]
  },
  {
    id: 's3-create-index',
    stage: '50→100',
    stageKey: 'advanced',
    title: '建立 Index',
    concepts: ['CREATE INDEX', '過濾欄'],
    briefing: (t) => themeAdapt(t, {
      football: '你成日用 nationality 過濾 players。建立一個叫 idx_players_nat 嘅索引。',
      anime: '你成日用 genre 過濾 series。建立 idx_series_genre。',
      stocks: '你成日用 country 過濾 companies。建立 idx_companies_country。'
    }),
    starter: 'CREATE INDEX ',
    schemaHint: ['CREATE INDEX 名 ON 表(欄)'],
    validate: (t) => themeAdapt(t, {
      football: { type: 'index', name: 'idx_players_nat', table: 'players' },
      anime: { type: 'index', name: 'idx_series_genre', table: 'series' },
      stocks: { type: 'index', name: 'idx_companies_country', table: 'companies' }
    }),
    hints: [
      '索引加快 WHERE / JOIN 關鍵欄嘅查找，但會拖慢寫入。',
      '語法：CREATE INDEX 索引名 ON 表名(欄名);',
      '建完之後用 EXPLAIN QUERY PLAN 再跑過濾查詢，睇下有冇變成 SEARCH。'
    ]
  },
  {
    id: 's3-rewrite-select-star',
    stage: '50→100',
    stageKey: 'advanced',
    title: '改寫：唔好 SELECT *',
    concepts: ['投影', '效能意識'],
    briefing: (t) => themeAdapt(t, {
      football: '業務只需要球員名同市值。寫一條只揀 name, market_value_m 嘅查詢（唔准 *），按市值 DESC。',
      anime: '只需要角色名同 power_level。唔准 *，按 power DESC。',
      stocks: '只需要 ticker 同 close。由 prices 拎，唔准 *，按 close DESC。'
    }),
    starter: 'SELECT ',
    schemaHint: ['只投影需要嘅欄'],
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: 'SELECT name, market_value_m FROM players ORDER BY market_value_m DESC',
        columns: ['name', 'market_value_m'],
        forbidStar: true
      },
      anime: {
        type: 'columns',
        expectedSQL: 'SELECT name, power_level FROM characters ORDER BY power_level DESC',
        columns: ['name', 'power_level'],
        forbidStar: true
      },
      stocks: {
        type: 'columns',
        expectedSQL: 'SELECT ticker, close FROM prices ORDER BY close DESC',
        columns: ['ticker', 'close'],
        forbidStar: true
      }
    }),
    hints: [
      'SELECT * 喺大表會拖慢網絡同記憶體——生產環境好大罪。',
      '只寫你真正要展示／計算嘅欄。',
      '提交前用 Ctrl+F 確認你嘅 SQL 冇星號 *。'
    ]
  },
  {
    id: 's3-architect-review',
    stage: '50→100',
    stageKey: 'advanced',
    title: '架構評判：慢查詢會診',
    concepts: ['效能', '業務邏輯審查'],
    briefing: (t) => themeAdapt(t, {
      football: '有人寫咗呢句（假設數據係 1 億場比賽）：\nSELECT * FROM matches m, players p, clubs c WHERE m.home_club_id = c.club_id;\n請你改寫成「有明確 JOIN、有過濾、冇笛卡爾積風險」嘅版本：列出 2024-09 之後嘅比賽日期、主隊名、主場入球。',
      anime: '有人寫：SELECT * FROM episodes e, characters c WHERE e.series_id = c.series_id;\n改寫：列出 viewers_m > 2 嘅集標題、作品名、收視。用明確 JOIN。',
      stocks: '有人寫：SELECT * FROM prices p, trades t;\n改寫：列出 AAPL 嘅交易日、收市價、當日 BUY 成交量總和。用明確 JOIN / 子查詢均可。'
    }),
    starter: '-- 改寫慢查詢\nSELECT\n  \nFROM ',
    schemaHint: ['禁止隱式逗號 JOIN'],
    validate: (t) => themeAdapt(t, {
      football: {
        type: 'columns',
        expectedSQL: `SELECT m.match_date, c.name AS home_club, m.home_goals
FROM matches m
INNER JOIN clubs c ON m.home_club_id = c.club_id
WHERE m.match_date >= '2024-09-01'`,
        columns: ['match_date', 'home_club', 'home_goals'],
        forbidCommaJoin: true
      },
      anime: {
        type: 'columns',
        expectedSQL: `SELECT e.title, s.title AS series_title, e.viewers_m
FROM episodes e
INNER JOIN series s ON e.series_id = s.series_id
WHERE e.viewers_m > 2`,
        columns: ['title', 'series_title', 'viewers_m'],
        forbidCommaJoin: true
      },
      stocks: {
        type: 'columns',
        expectedSQL: `SELECT p.trade_date, p.close, COALESCE(SUM(CASE WHEN t.side = 'BUY' THEN t.qty ELSE 0 END), 0) AS buy_qty
FROM prices p
LEFT JOIN trades t ON p.ticker = t.ticker AND date(t.trade_ts) = p.trade_date
WHERE p.ticker = 'AAPL'
GROUP BY p.trade_date, p.close
ORDER BY p.trade_date`,
        columns: ['trade_date', 'close', 'buy_qty'],
        forbidCommaJoin: true
      }
    }),
    hints: [
      '逗號寫 FROM a, b, c 好易變成笛卡爾積——列數爆炸，資料庫會哭。',
      '改用 INNER JOIN ... ON ...，同埋一定要有 WHERE 收窄時間／實體。',
      '只 SELECT 需要嘅欄；想像呢個結果要交俾 CEO dashboard。'
    ]
  }
];

export function getLesson(id) {
  return CURRICULUM.find((l) => l.id === id);
}
