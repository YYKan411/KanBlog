/**
 * 興趣主題：專屬虛擬資料庫 schema + seed
 * 每個主題有乾淨版（Stage 0–10）同髒數據版（Stage 10–50）
 */
export const THEMES = {
  football: {
    id: 'football',
    name: '英超足球',
    blurb: '球會、球員、比賽、轉會費——用你識嘅聯賽學 SQL。',
    tables: ['clubs', 'players', 'matches', 'transfers'],
    cleanSQL: `
PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS clubs;

CREATE TABLE clubs (
  club_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  founded_year INTEGER,
  stadium TEXT
);

CREATE TABLE players (
  player_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  club_id INTEGER REFERENCES clubs(club_id),
  position TEXT CHECK(position IN ('GK','DF','MF','FW')),
  nationality TEXT,
  age INTEGER,
  market_value_m REAL,
  joined_year INTEGER
);

CREATE TABLE matches (
  match_id INTEGER PRIMARY KEY,
  match_date TEXT NOT NULL,
  home_club_id INTEGER REFERENCES clubs(club_id),
  away_club_id INTEGER REFERENCES clubs(club_id),
  home_goals INTEGER,
  away_goals INTEGER,
  attendance INTEGER
);

CREATE TABLE transfers (
  transfer_id INTEGER PRIMARY KEY,
  player_id INTEGER REFERENCES players(player_id),
  from_club_id INTEGER REFERENCES clubs(club_id),
  to_club_id INTEGER REFERENCES clubs(club_id),
  fee_m REAL,
  transfer_date TEXT
);

INSERT INTO clubs VALUES
(1,'Arsenal','London',1886,'Emirates Stadium'),
(2,'Liverpool','Liverpool',1892,'Anfield'),
(3,'Man City','Manchester',1880,'Etihad Stadium'),
(4,'Chelsea','London',1905,'Stamford Bridge'),
(5,'Tottenham','London',1882,'Tottenham Hotspur Stadium'),
(6,'Man United','Manchester',1878,'Old Trafford');

INSERT INTO players VALUES
(1,'Bukayo Saka',1,'FW','England',22,120,2018),
(2,'Martin Ødegaard',1,'MF','Norway',25,90,2021),
(3,'William Saliba',1,'DF','France',23,70,2019),
(4,'Mohamed Salah',2,'FW','Egypt',32,65,2017),
(5,'Virgil van Dijk',2,'DF','Netherlands',33,40,2018),
(6,'Erling Haaland',3,'FW','Norway',24,180,2022),
(7,'Kevin De Bruyne',3,'MF','Belgium',33,50,2015),
(8,'Cole Palmer',4,'FW','England',22,80,2023),
(9,'Son Heung-min',5,'FW','South Korea',32,55,2015),
(10,'Bruno Fernandes',6,'MF','Portugal',29,70,2020),
(11,'Declan Rice',1,'MF','England',25,100,2023),
(12,'Alexis Mac Allister',2,'MF','Argentina',25,65,2023),
(13,'Phil Foden',3,'MF','England',24,110,2017),
(14,'Reece James',4,'DF','England',24,50,2018),
(15,'Harry Kane',NULL,'FW','England',31,90,NULL);

INSERT INTO matches VALUES
(1,'2024-08-17',1,6,2,1,60383),
(2,'2024-08-18',2,3,0,2,54000),
(3,'2024-08-24',3,4,1,1,52000),
(4,'2024-08-25',5,2,1,2,61000),
(5,'2024-09-01',4,1,0,3,40000),
(6,'2024-09-14',6,5,2,2,73000),
(7,'2024-09-21',2,1,2,2,57000),
(8,'2024-09-28',3,5,3,0,53000),
(9,'2024-10-05',1,3,1,2,60200),
(10,'2024-10-19',4,2,1,3,39500),
(11,'2024-10-26',5,4,2,1,61000),
(12,'2024-11-02',6,2,0,1,74000);

INSERT INTO transfers VALUES
(1,11,NULL,1,105,'2023-07-15'),
(2,8,3,4,42.5,'2023-09-01'),
(3,12,NULL,2,55,'2023-06-08'),
(4,6,NULL,3,60,'2022-07-01'),
(5,15,5,NULL,0,'2023-07-01');
`,
    dirtySQL: `
UPDATE players SET nationality = NULL WHERE player_id IN (3, 9);
UPDATE players SET age = NULL WHERE player_id = 8;
UPDATE players SET market_value_m = -5 WHERE player_id = 14;
INSERT INTO players VALUES (16,'Bukayo Saka',1,'FW','England',22,120,2018);
INSERT INTO players VALUES (17,'Unknown Player',2,'XX','',-1,NULL,'twenty');
UPDATE matches SET match_date = '17/08/2024' WHERE match_id = 1;
UPDATE matches SET match_date = 'Aug 18, 2024' WHERE match_id = 2;
UPDATE matches SET home_goals = NULL WHERE match_id = 6;
UPDATE matches SET attendance = -100 WHERE match_id = 10;
UPDATE transfers SET fee_m = NULL WHERE transfer_id = 2;
UPDATE transfers SET transfer_date = '2023/07/15' WHERE transfer_id = 1;
UPDATE clubs SET city = '  London  ' WHERE club_id = 1;
UPDATE clubs SET name = 'arsenal' WHERE club_id = 1;
`
  },

  anime: {
    id: 'anime',
    name: '動漫角色',
    blurb: '作品、角色、戰鬥力、聲優——用最鍾意嘅世界學查詢。',
    tables: ['series', 'characters', 'episodes', 'voice_actors', 'appearances'],
    cleanSQL: `
PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS appearances;
DROP TABLE IF EXISTS episodes;
DROP TABLE IF EXISTS characters;
DROP TABLE IF EXISTS voice_actors;
DROP TABLE IF EXISTS series;

CREATE TABLE series (
  series_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  studio TEXT,
  year_start INTEGER,
  genre TEXT,
  rating REAL
);

CREATE TABLE characters (
  char_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  series_id INTEGER REFERENCES series(series_id),
  role TEXT CHECK(role IN ('protagonist','antagonist','support')),
  power_level INTEGER,
  debut_ep INTEGER
);

CREATE TABLE voice_actors (
  va_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  agency TEXT,
  birth_year INTEGER
);

CREATE TABLE appearances (
  appearance_id INTEGER PRIMARY KEY,
  char_id INTEGER REFERENCES characters(char_id),
  va_id INTEGER REFERENCES voice_actors(va_id),
  language TEXT DEFAULT 'JP'
);

CREATE TABLE episodes (
  ep_id INTEGER PRIMARY KEY,
  series_id INTEGER REFERENCES series(series_id),
  ep_number INTEGER,
  title TEXT,
  air_date TEXT,
  viewers_m REAL
);

INSERT INTO series VALUES
(1,'Attack on Titan','Wit / MAPPA',2013,'Action',9.0),
(2,'Demon Slayer','ufotable',2019,'Action',8.7),
(3,'Jujutsu Kaisen','MAPPA',2020,'Action',8.6),
(4,'Spy x Family','Wit / CloverWorks',2022,'Comedy',8.5),
(5,'Frieren','Madhouse',2023,'Fantasy',9.1);

INSERT INTO characters VALUES
(1,'Eren Yeager',1,'protagonist',85,1),
(2,'Mikasa Ackerman',1,'protagonist',90,1),
(3,'Levi Ackerman',1,'support',98,9),
(4,'Tanjiro Kamado',2,'protagonist',80,1),
(5,'Nezuko Kamado',2,'support',75,1),
(6,'Gojo Satoru',3,'support',100,1),
(7,'Yuji Itadori',3,'protagonist',82,1),
(8,'Anya Forger',4,'protagonist',40,1),
(9,'Loid Forger',4,'protagonist',70,1),
(10,'Frieren',5,'protagonist',95,1),
(11,'Himmel',5,'support',88,1),
(12,'Sukuna',3,'antagonist',99,1);

INSERT INTO voice_actors VALUES
(1,'Yuki Kaji','VIMS',1985),
(2,'Yui Ishikawa','Aoni',1989),
(3,'Hiroshi Kamiya','Aoni',1975),
(4,'Natsuki Hanae','Across',1991),
(5,'Akari Kito','Pro-Fit',1994),
(6,'Yuichi Nakamura','Intention',1980),
(7,'Atsumi Tanezaki','Career',1990),
(8,'Atsushi Tamaru','Mausu',1986);

INSERT INTO appearances VALUES
(1,1,1,'JP'),(2,2,2,'JP'),(3,3,3,'JP'),
(4,4,4,'JP'),(5,5,5,'JP'),(6,6,6,'JP'),
(7,8,7,'JP'),(8,9,8,'JP'),(9,10,7,'JP');

INSERT INTO episodes VALUES
(1,1,1,'To You, in 2000 Years','2013-04-07',3.2),
(2,1,2,'That Day','2013-04-14',2.8),
(3,2,1,'Cruelty','2019-04-06',2.5),
(4,3,1,'Ryomen Sukuna','2020-10-03',2.1),
(5,4,1,'Operation Strix','2022-04-09',1.9),
(6,5,1,'The Journey''s End','2023-09-29',2.4),
(7,5,2,'It Was Like This','2023-10-06',2.2),
(8,3,5,'Curse Womb','2020-10-31',1.8),
(9,2,19,'A Bond That Can Never Be Severed','2020-09-26',4.1),
(10,4,7,'The Ulterior Motive of a Soft-Shelled Turtle','2022-05-21',1.7);
`,
    dirtySQL: `
UPDATE characters SET power_level = NULL WHERE char_id IN (5, 11);
UPDATE characters SET role = 'hero' WHERE char_id = 1;
INSERT INTO characters VALUES (13,'Eren Yeager',1,'protagonist',85,1);
UPDATE series SET rating = 15.0 WHERE series_id = 2;
UPDATE series SET title = '  Demon Slayer  ' WHERE series_id = 2;
UPDATE episodes SET air_date = '07/04/2013' WHERE ep_id = 1;
UPDATE episodes SET air_date = 'April 6, 2019' WHERE ep_id = 3;
UPDATE episodes SET viewers_m = -0.5 WHERE ep_id = 8;
UPDATE voice_actors SET birth_year = NULL WHERE va_id = 5;
UPDATE appearances SET language = '' WHERE appearance_id = 4;
`
  },

  stocks: {
    id: 'stocks',
    name: '股票市場',
    blurb: '公司、股價、交易、分析師評級——貼近日常分析工作。',
    tables: ['companies', 'prices', 'trades', 'analysts', 'ratings'],
    cleanSQL: `
PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS trades;
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS analysts;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  ticker TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT,
  country TEXT,
  employees INTEGER,
  founded_year INTEGER
);

CREATE TABLE prices (
  price_id INTEGER PRIMARY KEY,
  ticker TEXT REFERENCES companies(ticker),
  trade_date TEXT NOT NULL,
  open REAL,
  high REAL,
  low REAL,
  close REAL,
  volume INTEGER
);

CREATE TABLE trades (
  trade_id INTEGER PRIMARY KEY,
  ticker TEXT REFERENCES companies(ticker),
  trade_ts TEXT,
  side TEXT CHECK(side IN ('BUY','SELL')),
  qty INTEGER,
  price REAL,
  account TEXT
);

CREATE TABLE analysts (
  analyst_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  firm TEXT,
  coverage_sector TEXT
);

CREATE TABLE ratings (
  rating_id INTEGER PRIMARY KEY,
  analyst_id INTEGER REFERENCES analysts(analyst_id),
  ticker TEXT REFERENCES companies(ticker),
  rating TEXT CHECK(rating IN ('BUY','HOLD','SELL')),
  target_price REAL,
  as_of TEXT
);

INSERT INTO companies VALUES
('AAPL','Apple Inc.','Tech','US',164000,1976),
('TSLA','Tesla Inc.','Auto','US',140000,2003),
('0700.HK','Tencent','Tech','HK',100000,1998),
('9988.HK','Alibaba','Tech','HK',220000,1999),
('005930.KS','Samsung Electronics','Tech','KR',270000,1969),
('JPM','JPMorgan Chase','Finance','US',300000,2000);

INSERT INTO prices VALUES
(1,'AAPL','2024-10-01',225.0,228.5,224.1,227.8,52000000),
(2,'AAPL','2024-10-02',227.5,229.0,226.0,228.2,48000000),
(3,'AAPL','2024-10-03',228.0,230.2,227.1,229.5,51000000),
(4,'TSLA','2024-10-01',250.0,255.0,248.0,252.3,90000000),
(5,'TSLA','2024-10-02',252.0,260.0,251.0,258.1,95000000),
(6,'0700.HK','2024-10-01',380.0,385.5,378.0,382.2,18000000),
(7,'0700.HK','2024-10-02',382.0,390.0,381.0,388.5,20000000),
(8,'9988.HK','2024-10-01',95.0,97.2,94.5,96.8,25000000),
(9,'JPM','2024-10-01',210.0,212.5,209.0,211.4,12000000),
(10,'005930.KS','2024-10-01',72000,73500,71500,73000,8000000),
(11,'AAPL','2024-10-04',229.0,232.0,228.5,231.0,55000000),
(12,'TSLA','2024-10-03',258.0,262.0,255.0,245.0,110000000);

INSERT INTO trades VALUES
(1,'AAPL','2024-10-01 09:35:00','BUY',100,225.5,'ACC-001'),
(2,'AAPL','2024-10-01 10:12:00','SELL',50,227.0,'ACC-001'),
(3,'TSLA','2024-10-02 11:00:00','BUY',200,253.0,'ACC-002'),
(4,'0700.HK','2024-10-02 14:20:00','BUY',500,383.0,'ACC-003'),
(5,'JPM','2024-10-01 15:45:00','SELL',80,211.0,'ACC-002'),
(6,'9988.HK','2024-10-01 10:05:00','BUY',1000,95.2,'ACC-003'),
(7,'AAPL','2024-10-03 09:31:00','BUY',150,228.5,'ACC-001'),
(8,'TSLA','2024-10-03 16:00:00','SELL',100,246.0,'ACC-002');

INSERT INTO analysts VALUES
(1,'Grace Lam','Harbor Research','Tech'),
(2,'Ken Wong','Pacific Equity','Tech'),
(3,'Maya Chen','East Bay Capital','Finance'),
(4,'Tom Rivera','Auto Desk','Auto');

INSERT INTO ratings VALUES
(1,1,'AAPL','BUY',250,'2024-09-15'),
(2,2,'AAPL','HOLD',230,'2024-09-20'),
(3,1,'0700.HK','BUY',420,'2024-09-10'),
(4,2,'9988.HK','SELL',80,'2024-09-28'),
(5,4,'TSLA','HOLD',260,'2024-10-01'),
(6,3,'JPM','BUY',230,'2024-09-05'),
(7,1,'AAPL','BUY',255,'2024-10-05');
`,
    dirtySQL: `
UPDATE companies SET sector = NULL WHERE ticker = 'JPM';
UPDATE companies SET name = 'apple inc.' WHERE ticker = 'AAPL';
UPDATE companies SET employees = -1 WHERE ticker = 'TSLA';
INSERT INTO companies VALUES ('AAPL.DUP','Apple Inc.','Tech','US',1,1976);
UPDATE prices SET trade_date = '01/10/2024' WHERE price_id = 1;
UPDATE prices SET trade_date = 'Oct 2, 2024' WHERE price_id = 2;
UPDATE prices SET close = NULL WHERE price_id = 5;
UPDATE prices SET volume = -5000 WHERE price_id = 8;
UPDATE trades SET side = 'buy' WHERE trade_id = 1;
UPDATE trades SET qty = NULL WHERE trade_id = 4;
UPDATE ratings SET rating = 'Strong Buy' WHERE rating_id = 1;
UPDATE ratings SET target_price = NULL WHERE rating_id = 4;
`
  }
};

export function getTheme(id) {
  return THEMES[id] || THEMES.football;
}
