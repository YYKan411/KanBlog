/**
 * 思想偵探室 · The Thought Detective's Office
 * Single real dataset — no theme switching. Sourced verbatim from the site's
 * own already-vetted 16-thinker persona quiz
 * (minigames/philquiz/source/src/data/philosophers.ts), plus a `works` table
 * of real major works (three thinkers — Confucius, the Buddha, Socrates —
 * genuinely left no personally-authored text; that gap is real history, not
 * a manufactured data quality problem).
 */
export const PHILOSOPHERS_SEED = `
PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS works;
DROP TABLE IF EXISTS resonances;
DROP TABLE IF EXISTS essays;
DROP TABLE IF EXISTS thinkers;

CREATE TABLE thinkers (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  epithet_zh TEXT,
  epithet_en TEXT,
  born_year INTEGER,
  died_year INTEGER,
  region_zh TEXT,
  region_en TEXT,
  quote_zh TEXT,
  quote_en TEXT
);

CREATE TABLE resonances (
  thinker_id TEXT REFERENCES thinkers(id),
  related_id TEXT REFERENCES thinkers(id)
);

CREATE TABLE essays (
  thinker_id TEXT REFERENCES thinkers(id),
  slug TEXT,
  title_zh TEXT,
  title_en TEXT
);

CREATE TABLE works (
  thinker_id TEXT REFERENCES thinkers(id),
  title_zh TEXT,
  title_en TEXT,
  year INTEGER
);

INSERT INTO thinkers VALUES
('camus','阿爾貝·卡繆','Albert Camus','荒謬中的反抗者','The rebel in the absurd',1913,1960,'阿爾及利亞／法國','Algeria / France','必須想像薛西弗斯是快樂的。','One must imagine Sisyphus happy.'),
('confucius','孔子','Confucius','在關係中成為君子','Becoming exemplary in relation',-551,-479,'春秋時代魯國','Lu, Spring and Autumn China','己所不欲，勿施於人。','Do not impose on others what you yourself do not desire.'),
('kant','伊曼努爾·康德','Immanuel Kant','義務的守夜人','Guardian of duty',1724,1804,'Königsberg／普魯士','Königsberg / Prussia','我頭上的星空與我心中的道德律。','The starry heavens above me and the moral law within me.'),
('zhuangzi','莊子','Zhuangzi','蝶夢與逍遙','Butterfly dreams & easy wandering',-369,-286,'戰國時代宋國','Song, Warring States China','不知周之夢為胡蝶與？胡蝶之夢為周與？','Did Zhou dream the butterfly, or the butterfly dream Zhou?'),
('beauvoir','西蒙·德·波娃','Simone de Beauvoir','處境中的自由','Freedom in situation',1908,1986,'法國','France','人並非生而為女，而是變成女人。','One is not born, but rather becomes, woman.'),
('buddha','釋迦牟尼','The Buddha','中道與止苦','Middle way & the end of suffering',-563,-483,'古印度','Ancient India','諸行無常，諸法無我。','All conditioned things are impermanent; all phenomena are not-self.'),
('fanon','弗朗茨·法農','Frantz Fanon','被殖民的身體與解放','Colonised bodies & liberation',1925,1961,'馬提尼克／阿爾及利亞／法國','Martinique / Algeria / France','每個世代都該發現其使命，完成它或背叛它。','Each generation must discover its mission, fulfil it, or betray it.'),
('gandhi','聖雄甘地','Mahatma Gandhi','真理與非暴力','Truth-force & nonviolence',1869,1948,'印度／南非','India / South Africa','以眼還眼，只會令全世界失明。','An eye for an eye will make the whole world blind.'),
('ibn-rushd','伊本·魯什德','Ibn Rushd (Averroes)','理性與啟示的橋','Bridge of reason & revelation',1126,1198,'安達盧斯（伊斯蘭西班牙）','Al-Andalus (Islamic Spain)','真理與真理不會衝突。','Truth does not contradict truth.'),
('mill','約翰·史都華·彌爾','John Stuart Mill','自由與最大幸福','Liberty & the greatest happiness',1806,1873,'英國','United Kingdom','做一個不滿足的人，好過做一頭滿足的豬。','Better to be a human being dissatisfied than a pig satisfied.'),
('laozi','老子','Laozi','無為而治','Wu wei — acting without forcing',NULL,NULL,'周朝中國','Zhou China','道可道，非常道。','The Way that can be spoken is not the eternal Way.'),
('socrates','蘇格拉底','Socrates','未經省察的人生不值得過','The unexamined life is not worth living',-470,-399,'古雅典','Ancient Athens','我唯一知道的，是我一無所知。','I know that I know nothing.'),
('arendt','漢娜·阿倫特','Hannah Arendt','在公共中思考','Thinking in public',1906,1975,'德國／美國','Germany / United States','邪惡的平庸。','The banality of evil.'),
('du-bois','W·E·B·杜波依斯','W. E. B. Du Bois','雙重意識','Double consciousness',1868,1963,'美國','United States','二十世紀的問題，是膚色界線的問題。','The problem of the twentieth century is the problem of the color-line.'),
('nietzsche','弗里德里希·尼采','Friedrich Nietzsche','成為你自己','Become who you are',1844,1900,'德國／瑞士／意大利','Germany / Switzerland / Italy','殺死上帝之後，什麼仍值得相信？','After the death of God, what remains worth believing?'),
('wang-yangming','王陽明','Wang Yangming','知行合一','Unity of knowledge and action',1472,1529,'明朝中國','Ming China','知是行之始，行是知之成。','To know without acting is not yet to know.');

INSERT INTO resonances VALUES
('camus','beauvoir'),('camus','zhuangzi'),('camus','nietzsche'),
('confucius','wang-yangming'),('confucius','gandhi'),('confucius','ibn-rushd'),
('kant','mill'),('kant','arendt'),('kant','wang-yangming'),
('zhuangzi','laozi'),('zhuangzi','socrates'),('zhuangzi','camus'),
('beauvoir','fanon'),('beauvoir','du-bois'),('beauvoir','camus'),
('buddha','laozi'),('buddha','gandhi'),('buddha','zhuangzi'),
('fanon','du-bois'),('fanon','beauvoir'),('fanon','gandhi'),
('gandhi','buddha'),('gandhi','wang-yangming'),('gandhi','confucius'),
('ibn-rushd','confucius'),('ibn-rushd','socrates'),('ibn-rushd','kant'),
('mill','kant'),('mill','beauvoir'),('mill','camus'),
('laozi','zhuangzi'),('laozi','buddha'),('laozi','confucius'),
('socrates','kant'),('socrates','zhuangzi'),('socrates','mill'),
('arendt','kant'),('arendt','du-bois'),('arendt','fanon'),
('du-bois','fanon'),('du-bois','beauvoir'),('du-bois','arendt'),
('nietzsche','camus'),('nietzsche','beauvoir'),('nietzsche','zhuangzi'),
('wang-yangming','confucius'),('wang-yangming','gandhi'),('wang-yangming','kant');

INSERT INTO essays VALUES
('camus','sisyphus','推石頭之人','He Who Pushes the Stone'),
('nietzsche','sisyphus','推石頭之人','He Who Pushes the Stone'),
('confucius','bao-faan','飽飯','A Profound Satiety'),
('wang-yangming','bao-faan','飽飯','A Profound Satiety'),
('kant','footbridge-paradox','橋上悖論','Paradox over the Footbridge'),
('beauvoir','footbridge-paradox','橋上悖論','Paradox over the Footbridge'),
('fanon','footbridge-paradox','橋上悖論','Paradox over the Footbridge'),
('mill','footbridge-paradox','橋上悖論','Paradox over the Footbridge'),
('du-bois','footbridge-paradox','橋上悖論','Paradox over the Footbridge'),
('zhuangzi','the-cat-teachers','貓老師','The Cat Teachers'),
('buddha','the-cat-teachers','貓老師','The Cat Teachers'),
('ibn-rushd','why-overthink-on-an-empty-stomach','做乜諗嘢唔食飯？','Why Overthink on an Empty Stomach?'),
('socrates','why-overthink-on-an-empty-stomach','做乜諗嘢唔食飯？','Why Overthink on an Empty Stomach?'),
('gandhi','candleblossoms','蠟燭花','Candle Blossoms'),
('laozi','lands-end','地之盡頭大風吹','Land''s End'),
('arendt','all-quiet-at-hastings','喜士定無戰事','All Quiet at Hastings');

INSERT INTO works VALUES
('camus','異鄉人','The Stranger',1942),
('camus','薛西弗斯神話','The Myth of Sisyphus',1942),
('kant','純粹理性批判','Critique of Pure Reason',1781),
('kant','實踐理性批判','Critique of Practical Reason',1788),
('zhuangzi','莊子（內篇）','Zhuangzi (Inner Chapters)',NULL),
('beauvoir','第二性','The Second Sex',1949),
('fanon','黑皮膚，白面具','Black Skin, White Masks',1952),
('fanon','全世界受苦的人','The Wretched of the Earth',1961),
('gandhi','印度自治','Hind Swaraj',1909),
('ibn-rushd','不一致的不一致','The Incoherence of the Incoherence',1180),
('mill','論自由','On Liberty',1859),
('laozi','道德經','Daodejing',NULL),
('arendt','極權主義的起源','The Origins of Totalitarianism',1951),
('arendt','人的境況','The Human Condition',1958),
('du-bois','黑人的靈魂','The Souls of Black Folk',1903),
('nietzsche','查拉圖斯特拉如是說','Thus Spoke Zarathustra',1883),
('wang-yangming','傳習錄','Instructions for Practical Living',1518);
`;
