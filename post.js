// ============================================
// Post page — bilingual toggle + share buttons
// Two independent features, two IIFEs. Each one
// no-ops gracefully if the article doesn't match.
// ============================================


// ============================================
// 1. Bilingual segmented toggle (mobile only)
//   - zh    : Chinese only (default)
//   - both  : Chinese + English stacked
//   - en    : English only
// CSS handles visibility; JS just toggles the class on .article-body.
// ============================================

(function () {
  const body = document.querySelector('.article-body');
  if (!body) return;

  const enParagraphs = body.querySelectorAll('.pair .en');
  if (enParagraphs.length === 0) return;  // pure-Chinese article: do nothing

  // Mark the English mirror text so screen readers switch voice and the
  // lang signal stays correct (the page itself is lang="zh-HK").
  enParagraphs.forEach(el => { if (!el.lang) el.lang = 'en'; });

  // build the segmented control
  const group = document.createElement('div');
  group.className = 'lang-toggle-group has-en';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'language display');

  const modes = [
    { key: 'zh',   label: '中' },
    { key: 'both', label: '中 + EN' },
    { key: 'en',   label: 'EN' }
  ];

  const buttons = modes.map(m => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-toggle';
    btn.dataset.mode = m.key;
    btn.textContent = m.label;
    if (m.key === 'zh') btn.classList.add('is-active');
    return btn;
  });

  buttons.forEach(b => group.appendChild(b));

  // insert before the article body
  body.parentNode.insertBefore(group, body);

  function setMode(mode) {
    body.classList.remove('mode-both', 'mode-en');
    if (mode === 'both') body.classList.add('mode-both');
    if (mode === 'en')   body.classList.add('mode-en');

    buttons.forEach(b => {
      b.classList.toggle('is-active', b.dataset.mode === mode);
    });
  }

  group.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-mode]');
    if (!btn) return;
    setMode(btn.dataset.mode);
  });
})();


// ============================================
// 2. Share buttons (all posts, desktop + mobile)
// Inject 5 text-only share links: threads / facebook /
// x / linkedin / copy link. Appended after .article-tags
// inside <article class="article">. Pure DOM injection
// so it applies to every post that loads post.js — old
// and new alike, with no per-post markup needed.
// ============================================

(function () {
  const article = document.querySelector('article.article');
  if (!article) return;

  // Avoid double-injection on hot reload / repeat scripts
  if (article.querySelector('.article-share')) return;

  const url = window.location.href;
  const titleEl = document.querySelector('.article-title');
  // .article-title may contain a <br><span> for bilingual subtitle.
  // Clone the element so we can mutate without affecting the page,
  // then replace <br> with " — " (em-dash) so the share text reads cleanly:
  // e.g. "飽飯 — A Profound Satiety" instead of "飽飯A Profound Satiety".
  let title;
  if (titleEl) {
    const clone = titleEl.cloneNode(true);
    clone.querySelectorAll('br').forEach(br => {
      br.replaceWith(document.createTextNode(' — '));
    });
    title = clone.textContent.replace(/\s+/g, ' ').trim();
  } else {
    title = document.title;
  }

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const encShareText = encodeURIComponent(`${title} — ${url}`);

  // Share target definitions. `href` = static link, `action` = JS handler.
  const targets = [
    {
      label: 'threads',
      href: `https://www.threads.net/intent/post?text=${encShareText}`
    },
    {
      label: 'facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`
    },
    {
      label: 'x',
      href: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`
    },
    {
      label: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`
    },
    {
      label: 'copy link',
      action: 'copy'
    }
  ];

  const wrap = document.createElement('div');
  wrap.className = 'article-share';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'share this post');

  // Optional small label, matches the visual quietness of footer
  const lead = document.createElement('span');
  lead.className = 'article-share-lead';
  lead.textContent = 'share to';
  wrap.appendChild(lead);

  targets.forEach(t => {
    const el = document.createElement(t.action ? 'button' : 'a');
    el.className = 'share-btn';
    el.textContent = t.label;

    if (t.action === 'copy') {
      el.type = 'button';
      el.addEventListener('click', async () => {
        const original = el.textContent;
        try {
          await navigator.clipboard.writeText(url);
          el.textContent = 'copied';
        } catch {
          // Fallback for browsers without clipboard API
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); el.textContent = 'copied'; }
          catch { el.textContent = 'copy failed'; }
          document.body.removeChild(ta);
        }
        setTimeout(() => { el.textContent = original; }, 2000);
      });
    } else {
      el.href = t.href;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }

    wrap.appendChild(el);
  });

  // Insert after .article-tags if it exists, otherwise at end of article
  const tags = article.querySelector('.article-tags');
  if (tags && tags.parentNode === article) {
    tags.insertAdjacentElement('afterend', wrap);
  } else {
    article.appendChild(wrap);
  }
})();
