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
    slug: 'bao-faan',
    title: '飽飯',
    date: '2024-11-12',
    excerpt: '一頓飯之後，先至發現嗰個人原來係咁。碗碟未收，茶都涼咗，房間入面剩低嘅，係一種未必講得出口嘅明白。',
    tags: ['散文'],
    featured: true,
    url: 'posts/bao-faan.html'
  },
  {
    slug: 'edinburgh-rain',
    title: '愛丁堡的雨',
    date: '2025-03-08',
    excerpt: '北方嘅雨唔急，落得似有似冇。撐傘嘅人比唔撐嘅多一倍。',
    tags: ['遊記', '移英'],
    cover: 'images/sample-1.svg',
    url: 'posts/edinburgh-rain.html'
  },
  {
    slug: 'old-shirt',
    title: '舊衫',
    date: '2025-06-22',
    excerpt: '一件衫著到第八年。袖口磨白嗰處，先記得當年喺旺角買嗰日落緊雨。',
    tags: ['物', '散文'],
    cover: 'images/sample-2.svg',
    url: 'posts/old-shirt.html'
  },
  {
    slug: 'reading-march',
    title: 'Reading 三月',
    date: '2026-03-15',
    excerpt: '搬過嚟一年。橋邊嗰排櫻花開咗一半，地產經紀仲喺度寄信。',
    tags: ['移英', '散文'],
    url: 'posts/reading-march.html'
  },
  {
    slug: 'schopenhauer-tube',
    title: 'Schopenhauer 在地鐵',
    date: '2025-09-03',
    excerpt: '佢話人生喺痛苦同無聊之間擺盪。Central line 上等緊號誌嗰陣，我覺得佢講得啱。',
    tags: ['哲思'],
    url: 'posts/schopenhauer-tube.html'
  },
  {
    slug: 'tea',
    title: '茶',
    date: '2025-07-19',
    excerpt: '一杯普洱泡到第三泡先肯講真話。',
    tags: ['物', '散文'],
    cover: 'images/sample-3.svg',
    url: 'posts/tea.html'
  },
  {
    slug: 'on-restraint',
    title: '克制論',
    date: '2026-01-20',
    excerpt: '香港人嘅克制，唔係修養，係保護。著住件大衣，唔係怕凍，係怕畀人睇穿。',
    tags: ['哲思', '散文'],
    url: 'posts/on-restraint.html'
  },
  {
    slug: 'bath-postcard',
    title: 'Bath 寄出嘅明信片',
    date: '2025-10-11',
    excerpt: 'Roman Bath 嘅水仲係綠。寄畀阿媽嗰張明信片，揀咗最唔似旅遊嗰張。',
    tags: ['遊記', '移英'],
    cover: 'images/sample-4.svg',
    url: 'posts/bath-postcard.html'
  }
];

init();
