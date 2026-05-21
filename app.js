// ============================================
// Kaga Chung — Personal Site
// Simple client-side rendering. No framework.
// ============================================

const POSTS_URL = 'posts/index.json';

// ----- bootstrap -----
document.getElementById('year').textContent = new Date().getFullYear();

let allPosts = [];
let activeTag = 'all';

// Read tag from URL hash on load (e.g. #散文)
function getTagFromHash() {
  const hash = decodeURIComponent(window.location.hash.replace('#', ''));
  return hash || 'all';
}

async function init() {
  try {
    const res = await fetch(POSTS_URL);
    if (!res.ok) throw new Error('Failed to load posts index');
    allPosts = await res.json();
  } catch (err) {
    // graceful fallback — show sample posts for prototype/preview
    console.warn('Using sample posts:', err.message);
    allPosts = SAMPLE_POSTS;
  }

  // sort newest first
  allPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  buildTagBar();
  activeTag = getTagFromHash();
  setActiveTagButton(activeTag);
  renderPosts();
}

window.addEventListener('hashchange', () => {
  activeTag = getTagFromHash();
  setActiveTagButton(activeTag);
  renderPosts();
});

// ----- tag bar -----
function buildTagBar() {
  const bar = document.getElementById('tagBar');
  const tags = new Set();
  allPosts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));

  [...tags].sort().forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tag';
    btn.dataset.tag = t;
    btn.textContent = t;
    btn.addEventListener('click', () => {
      window.location.hash = encodeURIComponent(t);
    });
    bar.appendChild(btn);
  });

  // "all" button click handler
  bar.querySelector('[data-tag="all"]').addEventListener('click', () => {
    history.pushState('', document.title, window.location.pathname);
    activeTag = 'all';
    setActiveTagButton('all');
    renderPosts();
  });
}

function setActiveTagButton(tag) {
  document.querySelectorAll('.tag').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === tag);
  });
}

// ----- masonry render -----
function renderPosts() {
  const grid = document.getElementById('masonry');
  grid.innerHTML = '';

  const filtered = activeTag === 'all'
    ? allPosts
    : allPosts.filter(p => (p.tags || []).includes(activeTag));

  filtered.forEach(post => grid.appendChild(makeCard(post)));
}

function makeCard(post) {
  const a = document.createElement('a');
  a.className = 'card' + (post.cover ? '' : ' text-only') + (post.featured ? ' featured' : '');
  a.href = post.url || `posts/${post.slug}.html`;

  if (post.cover) {
    const img = document.createElement('img');
    img.className = 'card-cover';
    img.src = post.cover;
    img.alt = post.title;
    img.loading = 'lazy';
    a.appendChild(img);
  }

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h2');
  title.className = 'card-title';
  title.textContent = post.title;
  body.appendChild(title);

  if (post.excerpt) {
    const ex = document.createElement('p');
    ex.className = 'card-excerpt';
    ex.textContent = post.excerpt;
    body.appendChild(ex);
  }

  const meta = document.createElement('div');
  meta.className = 'card-meta';
  meta.innerHTML = `<span>${formatDate(post.date)}</span>`;
  body.appendChild(meta);

  if (post.tags && post.tags.length) {
    const tagsEl = document.createElement('div');
    tagsEl.className = 'card-tags';
    post.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'card-tag';
      span.textContent = t;
      tagsEl.appendChild(span);
    });
    body.appendChild(tagsEl);
  }

  a.appendChild(body);
  return a;
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y} · ${m} · ${day}`;
}

// ----- sample posts (used if posts/index.json is missing) -----
const SAMPLE_POSTS = [
  {
    slug: "theballadoftheurgentbowels",
    title: "鳩佬極急便｜The Ballad of the Urgent Bowels — 言又勤",
    date: "2026-05-21",
    excerpt: "一首四節短歌，記一場最庸俗、最英雄式嘅私人危機。",
    tags: ["散文"],
    cover: "images/TheBalladoftheUrgentBowels.jpg",
    url: "posts/theballadoftheurgentbowels.html"
  },
  {
    slug: "footbridge-paradox",
    title: "橋上悖論｜Paradox over the Footbridge — 言又勤",
    date: "2026-05-19",
    excerpt: "熟悉畫面，陌生場景。我無法離開這裏，我只是回不來了。",
    tags: ["散文","移英","物","香港"],
    cover: "images/bridge-paradox.jpg",
    featured: true,
    url: "posts/footbridge-paradox.html"
  },
  {
    slug: "sisyphus",
    title: "推石頭之人｜He Who Pushes the Stone — 言又勤",
    date: "2026-05-19",
    excerpt: "又返到寫字樓。打開螢幕，五十八封電郵。最頂個討論串，嚟到第二十三個回覆，仍未斷尾。",
    tags: ["散文","哲思","移英"],
    featured: true,
    url: "posts/sisyphus.html"
  },
  {
    slug: "bao-faan",
    title: "飽飯 — 言又勤",
    date: "2025-09-28",
    excerpt: "細個嗰陣屋企忽然好窮。16歲生日返第一份兼職，月尾將幾百蚊放喺飯枱上。第二朝五點，我同老竇喊咗好耐好耐好耐。",
    tags: ["散文","香港","人"],
    featured: true,
    url: "posts/bao-faan.html"
  },
  {
    slug: "lands-end",
    title: "地之盡頭大風吹 — 言又勤",
    date: "2023-04-03",
    excerpt: "由雷丁到康和，二百五十八英里，六粒鐘車程。蘭茲角望向遠方係一條筆直水平線。離開香港兩年，忽然海水味撲面。",
    tags: ["散文","遊記","移英"],
    cover: "images/landsend.jpg",
    url: "posts/lands-end.html"
  }
];

init();
