// ============================================
// Post page — bilingual segmented toggle
// 3 modes (mobile only):
//   - zh    : Chinese only (default)
//   - both  : Chinese + English stacked
//   - en    : English only
// CSS handles visibility; JS just toggles the class on .article-body.
// ============================================

(function () {
  const body = document.querySelector('.article-body');
  if (!body) return;

  const hasEnglish = body.querySelector('.pair .en') !== null;
  if (!hasEnglish) return;  // pure-Chinese article: do nothing

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
