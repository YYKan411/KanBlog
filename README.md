# kaga.site — 個人網誌

一個靜態網站。冇 build step、冇 framework、冇月費。
Markdown + HTML + 一個 GitHub repo。

---

## 一、第一次上線（一次性，大約 20 分鐘）

### Step 1 — 開 GitHub repo
1. 登入 [github.com](https://github.com)
2. 撳右上角 `+ → New repository`
3. Repository name：`kaga-site`（或者你想嘅名）
4. Public（免費 host 嘅前提）
5. **Create repository**

### Step 2 — 上傳檔案
喺新 repo 嘅頁面：
1. 撳 `uploading an existing file`
2. 將呢個 folder 入面**全部嘢**（`index.html`、`style.css`、`app.js`、`about.html`、`images/`、`posts/`）拖入去
3. 撳 `Commit changes`

### Step 3 — 連去 Cloudflare Pages
1. 登入 [dash.cloudflare.com](https://dash.cloudflare.com)（冇 account 就免費開一個）
2. 左邊揀 **Workers & Pages → Create → Pages → Connect to Git**
3. 授權 GitHub，揀啱 `kaga-site` repo
4. Build settings：
   - Framework preset：**None**
   - Build command：**留空**
   - Build output directory：**/**
5. **Save and Deploy**

兩分鐘後你會有個 URL：`kaga-site-xxx.pages.dev`。完。

### Step 4（可選）— 用自己嘅 domain
- 之後想買 `kagachung.com` 之類嘅 domain（約 £8/年），喺 Cloudflare Registrar 買，連 DNS 都唔使設定。
- 暫時用 `.pages.dev` 嗰個 URL 完全 OK。

---

## 二、之後點寫新文章

### Option A：純文字短文（最快）
1. 上 github.com，入你個 repo
2. 撳 `app.js`
3. 撳鉛筆 icon 編輯
4. 喺 `SAMPLE_POSTS` array 最頂加一筆：
   ```js
   {
     slug: 'something',
     title: '標題',
     date: '2026-05-19',
     excerpt: '頭幾句撮要。',
     tags: ['散文'],
     url: 'posts/something.html'  // 暫時可以指返主頁 'index.html'
   },
   ```
5. Commit。一分鐘內上線。

> 暫時呢個 prototype 用緊 `SAMPLE_POSTS` 嚟示範。下一步我哋會搬去 `posts/index.json`，等你唔使再改 JavaScript。

### Option B：完整文章
1. 喺 `posts/` folder 新增一個 `.html` 檔，copy `posts/edinburgh-rain.html` 做 template
2. 改標題、改日期、改內文
3. 喺 `app.js` 加返一筆 metadata（同 Option A 一樣）
4. Commit

### Option C：之後升級（建議第二階段做）
等你習慣咗呢個 flow 之後，我可以幫你加：
- **Markdown rendering** — 直接寫 `.md`，瀏覽器自動 parse 做 HTML
- **posts/index.json** — 一個 file 管所有 metadata，唔使再改 JS
- **RSS feed** — 自動生成
- **Tag pages** — 每個 tag 有專屬 URL

---

## 三、加圖

1. 將圖 drag 入 `images/` folder（透過 GitHub web 介面就得）
2. 喺文章 / metadata 入面引用：`images/your-photo.jpg`
3. 建議：圖闊度 1200px，JPEG quality 80%，每張 < 200KB

---

## 四、Tag 哲學

Tag 由你寫嘢嗰陣自然生成。建議起手用呢幾個，之後想加幾多都得：

- `散文`
- `遊記`
- `哲思`
- `移英`
- `物` —— 以物寫人
- `人` —— 寫人
- `社會` —— 社會評論

URL 入面用 `#tagname` 就會 filter，呢個邏輯已經 built-in。

---

## 五、檔案結構

```
kaga-site/
├── index.html         主頁（masonry）
├── about.html         關於頁
├── style.css          全部 styling
├── app.js             主頁邏輯（tag filter、masonry render）
├── images/            所有圖
│   └── sample-*.svg   prototype 用嘅 placeholder
└── posts/
    └── edinburgh-rain.html  示範文章
```

---

## 六、設計筆記

- **字體**：Cormorant Garamond（標題）+ Noto Serif TC（中文）+ JetBrains Mono（meta）
- **色調**：墨色 `#1a1814` + 米白 `#f5f1e8` + 朱砂 `#8b3a2f`（極少用）
- **Masonry**：純 CSS columns，唔使任何 JS library
- **動畫**：cards 載入時 stagger fade-in，0.6s
- 全部設計變數喺 `style.css` 頂部嘅 `:root`，想換色換字一個地方搞掂

---

寫嘢愉快。
