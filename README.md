# Kaga Chung — Personal Site

A static personal blog hosted on Cloudflare Pages, source on GitHub.
No build step. No framework. No monthly fee. Forever yours.

URL: https://kanblog.pages.dev

---

## 寫一篇新文章（完整 walkthrough）

預計：每篇 5-10 分鐘。

### Step 1 — 喺 GitHub 開新檔

1. 入 [github.com/YYKan411/KanBlog](https://github.com/YYKan411/KanBlog)
2. 撳入 `posts/` folder
3. 撳 **Add file → Create new file**
4. 檔名格式：用英文 / 拼音 / 簡單字，例如：
   - `reading-spring.html`
   - `coffee-2026-may.html`
   - `letter-to-mum.html`
   - **唔好用空格、唔好用中文做檔名**（URL 會有問題）

### Step 2 — 抄 template

1. 開新 tab，去 `posts/_TEMPLATE.html`
2. 撳右上角嘅 **Raw** 按鈕（睇到純文字版本）
3. Cmd+A / Ctrl+A 全選，Cmd+C / Ctrl+C 複製
4. 返去你新開嘅檔，paste 入去

### Step 3 — 改 placeholder

用瀏覽器嘅 find & replace（Cmd+F / Ctrl+F），逐個 `[...]` 換成真內容：

| Placeholder | 換成 |
|---|---|
| `[標題]` | 你嘅文章標題 |
| `[摘要 — 文章前 150 字左右]` | 通常用第一段 |
| `[檔名沒有.html].html` | 你嘅檔名加 `.html`（例如 `reading-spring.html`） |
| `[YYYY-MM-DD]` | 今日，例如 `2026-05-20` |
| `[YYYY · MM · DD]` | 同上但用 dot，`2026 · 05 · 20` |
| `[tag1]`, `[tag2]` | 你嘅 tag（散文／遊記／哲思／移英／物／人／社會） |

### Step 4 — 寫內文

打開 template 入面個 `<div class="article-body">` 嗰部分。Template 已經有兩種寫法俾你揀：

**寫法 A — 純中文段落：**
```html
<p>呢度寫第一段。</p>
<p>呢度寫第二段。</p>
```

**寫法 B — 中英 pair：**
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
3. 拖張圖入去
4. Commit
5. 返你篇文，喺要插圖嘅位置寫：
   ```html
   <img src="../images/your-photo.jpg" alt="">
   ```
6. 如果想做封面圖（出現喺主頁卡片），喺檔案頂位 head 嗰部分嘅 og:image meta tag 度 uncomment 嗰行

### Step 6 — Commit

拉到頁面最底，commit message 寫：`Add: [文章標題]`
撳綠色 **Commit changes**

### Step 7 — 加入主頁 masonry

呢一步令你篇文出現喺主頁。

1. 返 repo 主頁，撳 `app.js`
2. 撳鉛筆 ✏️ icon (Edit this file)
3. 搵到 `const SAMPLE_POSTS = [` 嗰行
4. **喺最頂**（緊接住 `[` 之後）加多一筆：

```javascript
{
  slug: 'reading-spring',
  title: 'Reading 嘅春天',
  date: '2026-05-20',
  excerpt: '頭幾句嘢，畀主頁卡片用，大約一兩句。',
  tags: ['散文', '移英'],
  cover: 'images/your-cover.jpg',  // 純文字卡刪呢行
  featured: true,                  // 想做深色 featured 卡保留，否則刪
  url: 'posts/reading-spring.html'
},
```

5. Commit message：`Update: 新文章上架`
6. 撳 **Commit changes**

### Step 8 — 加入 sitemap（SEO）

1. 撳 `sitemap.xml`
2. 編輯，喺檔案中間嗰個註釋下面，按照 template 加多一筆：

```xml
<url>
  <loc>https://kanblog.pages.dev/posts/reading-spring.html</loc>
  <lastmod>2026-05-20</lastmod>
  <priority>0.9</priority>
</url>
```

3. Commit

### Step 9 — 等

Cloudflare 自動 detect 到你 commit 咗，會自動重新 deploy。1-2 分鐘後 refresh `kanblog.pages.dev`——你篇文出現喺最頂。

---

## 修改舊文章

1. 入 `posts/` folder
2. 撳要改嗰個 `.html` 檔
3. 撳鉛筆 ✏️ icon
4. 改完撳 Commit changes
5. 1-2 分鐘後上線

---

## 想改成個 site 嘅外觀

| 改邊度？ | 改邊個檔 |
|---|---|
| 顏色 / 字體 / 字大細 | `style.css` 頂部嘅 `:root` 區段 |
| 主頁標題 / tagline | `index.html` |
| About 內容 | `about.html` |
| Tag bar 邏輯 / masonry 排版 | `app.js` |

主要 CSS 變數（喺 `style.css` 最頂）：
```css
--ink: #3d2f1f;       /* 主色 */
--paper: #ebe5d4;     /* 底色 */
--accent: #3a5a3a;    /* accent，墨綠 */
```

改一個 hex code，commit，1 分鐘後全 site 統一變色。

---

## SEO Checklist（每篇文章自動有）

✓ Page title（每篇獨立）
✓ Meta description
✓ Author
✓ Keywords
✓ Open Graph tags（Facebook / Threads / WhatsApp 分享靚 card）
✓ Twitter Card
✓ JSON-LD structured data（Google rich result）
✓ Sitemap（手動 update 一行）
✓ robots.txt

**唔在 checklist 但建議做嘅嘢：**

1. **submit sitemap 去 Google Search Console**
   - 去 [search.google.com/search-console](https://search.google.com/search-console)
   - Add property → `https://kanblog.pages.dev`
   - 入 sitemap：填 `https://kanblog.pages.dev/sitemap.xml`
   - 加快 Google 收錄你篇文

2. **每月 review 一次 Google Search Console**
   - 睇邊啲文章 ranking 緊咩 keyword
   - 慢慢 build 認識

---

## 檔案結構

```
KanBlog/
├── index.html         主頁（masonry）
├── about.html         關於頁
├── style.css          全部 styling
├── app.js             主頁邏輯
├── robots.txt         SEO 基礎
├── sitemap.xml        每篇新文要 update 呢個
├── README.md          呢份文件
├── images/            所有圖
└── posts/
    ├── _TEMPLATE.html       範本（每次新文 copy 呢個）
    ├── sisyphus.html        示範文章
    └── edinburgh-rain.html  示範文章
```

---

## 設計筆記

- **字體**：Cormorant Garamond（標題）+ Noto Serif HK（中文）+ JetBrains Mono（meta）
- **色調**：濃啡 `#3d2f1f` + 亞麻 `#ebe5d4` + 墨綠 `#3a5a3a`（極少用）
- **Masonry**：純 CSS columns，唔使任何 JS library
- **動畫**：cards 載入時 stagger fade-in，0.6s

---

寫嘢愉快。
