# 言又勤 — Personal Site

A static personal blog hosted on Cloudflare Pages, source on GitHub.
No build step you have to touch. No framework. No monthly fee. Forever yours.

URL: https://yykan.uk

---

## 學習 · Learning

Footer → **learning** → [`/learning/`](./learning/)

雙語（中／英對照）練習頁。而家有 SQL 自學：[`/learning/sql/`](./learning/sql/)  
題目 + 簡介 + 真實 SQLite；唔花巧。

---

## 寫一篇新文章

預計：每篇 5-10 分鐘。**單一 commit，自動上線。**

### Step 1 — 喺 GitHub 開新檔

1. 入 [github.com/YYKan411/KanBlog](https://github.com/YYKan411/KanBlog)
2. 撳入 `posts/` folder
3. 撳 **Add file → Create new file**
4. 檔名格式：英文 / 拼音 / 簡單字，例如：
   - `reading-spring.html`
   - `coffee-2026-may.html`
   - **唔好用空格、唔好用中文做檔名**（URL 會有問題）

### Step 2 — 抄 template

1. 開新 tab，去 `posts/_TEMPLATE.html`
2. 撳右上角嘅 **Raw** 按鈕（純文字版本）
3. Cmd+A / Ctrl+A 全選複製
4. 返去你新開嘅檔，paste 入去

### Step 3 — 填 placeholder

用瀏覽器嘅 Cmd+F / Ctrl+F，逐個 `[...]` 換成真內容：

| Placeholder | 換成 |
|---|---|
| `[標題]` | 你嘅文章標題 |
| `[文章前 150 字...]` | description — 畀 Google 同社交媒體 preview |
| `[主頁卡片嘅一兩句]` | excerpt — 畀主頁卡片用嘅一兩句 |
| `[檔名沒有.html].html` | 你嘅檔名加 `.html`（例如 `reading-spring.html`） |
| `[YYYY-MM-DD]` | 今日，例如 `2026-05-20` |
| `[YYYY · MM · DD]` | 同上但用 dot，`2026 · 05 · 20` |
| `[tag1]`, `[tag2]` | 你嘅 tag（散文／遊記／哲思／移英／物／人／社會） |

**想做 featured 卡（深色 stand out 卡）？**
喺 head 嗰部分 uncomment：
```html
<meta name="featured" content="true">
```

### Step 4 — 寫內文

Template 入面個 `<div class="article-body">` 嗰部分。揀寫法：

**寫法 A — 純中文段落：**
```html
<p>呢度寫第一段。</p>
<p>呢度寫第二段。</p>
```

**寫法 B — 中英 pair（桌面左右並排、手機 toggle）：**
```html
<div class="pair">
  <p class="zh">中文嗰段。</p>
  <p class="en">English here.</p>
</div>
```

**引用 blockquote：**
```html
<blockquote>引用嘅嘢。</blockquote>
```

**斜體：** `<em>呢啲字會 italic</em>`
**粗體：** `<strong>呢啲字會粗體</strong>`

### Step 5 — 加圖（如果有）

1. 入 repo 主頁 → `images/` folder
2. 撳 **Add file → Upload files**
3. 拖張圖入去 → Commit
4. 喺文章 head 嗰部分加返 og:image meta（建議 — 主頁卡片同社交分享都會用呢張）：
   ```html
   <meta property="og:image" content="https://yykan.uk/images/your-photo.jpg">
   ```
5. 喺文章內文用其中一種 layout（template 有四個選項，uncomment 你想嗰個）

### Step 6 — Commit

撳綠色 **Commit changes**。**完。**

---

## 然後會發生咩

1. 你 commit 之後，**GitHub Actions 自動觸發**
2. Action 跑 `scripts/build.js`：掃 `posts/` folder、抽 metadata、重寫 `app.js` 同 `sitemap.xml`
3. Action 自動 commit 嗰兩個檔案
4. Cloudflare detect 到 commit，重新 deploy
5. 大約 **1-2 分鐘**後，refresh `yykan.uk` —— 你篇文喺主頁最頂出現

**你完全唔需要碰 `app.js` 或者 `sitemap.xml`。** 永遠唔需要。

---

## 修改舊文章

1. 入 `posts/` folder
2. 撳要改嗰個 `.html` 檔
3. 撳鉛筆 ✏️ icon
4. 改完撳 Commit changes
5. 1-2 分鐘後上線

---

## 刪一篇文

撳入個檔案 → 撳垃圾桶 🗑️ → Commit。完。Build script 自動將佢從 `app.js` 同 `sitemap.xml` 移走。

---

## 想改成個 site 嘅外觀

| 改邊度？ | 改邊個檔 |
|---|---|
| 顏色 / 字體 / 字大細 | `style.css` 頂部嘅 `:root` 區段 |
| 主頁標題 / tagline | `index.html` |
| About 內容 | `about.html` |
| Bilingual toggle 邏輯 | `post.js` |

主要 CSS 變數（喺 `style.css` 最頂）：
```css
--ink: #3d2f1f;       /* 主色 */
--paper: #ebe5d4;     /* 底色 */
--accent: #3a5a3a;    /* accent，墨綠 */
```

---

## SEO Checklist（每篇文章自動有）

✓ Page title（每篇獨立）
✓ Meta description
✓ Author
✓ Keywords
✓ Open Graph tags
✓ Twitter Card
✓ JSON-LD structured data
✓ Sitemap（自動 regenerate）
✓ robots.txt

**外加：每月 review 一次 [Google Search Console](https://search.google.com/search-console)** —— 睇邊啲文章 ranking 緊咩 keyword。

---

## 檔案結構

```
KanBlog/
├── index.html         主頁（masonry）
├── about.html         關於頁
├── style.css          全部 styling
├── app.js             主頁邏輯 + 文章列表（自動生成）
├── post.js            bilingual toggle
├── robots.txt
├── sitemap.xml        SEO sitemap（自動生成）
├── README.md
├── images/            所有圖
├── posts/
│   ├── _TEMPLATE.html       範本（每次新文 copy 呢個）
│   └── *.html               你嘅文章
├── scripts/
│   └── build.js             auto-build script
└── .github/
    └── workflows/
        └── build.yml        GitHub Action
```

---

## Design 筆記

- **字體**：Cormorant Garamond（標題）+ Noto Serif HK（中文）+ JetBrains Mono（meta）
- **色調**：濃啡 `#3d2f1f` + 亞麻 `#ebe5d4` + 墨綠 `#3a5a3a`
- **Masonry**：純 CSS columns，唔使任何 JS library
- **Bilingual**：桌面 50/50 grid、手機三段 toggle（中 / 中+EN / EN）
- **動畫**：cards 載入時 stagger fade-in，0.6s

---

寫嘢愉快。
