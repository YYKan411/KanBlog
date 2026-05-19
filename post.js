// ============================================
// Post page — bilingual toggle
// Detects if any .pair contains .en child;
// if yes, injects a "show English" toggle button.
// CSS handles the actual showing/hiding via media query.
// ============================================

(function () {
  const body = document.querySelector('.article-body');
  if (!body) return;

  const hasEnglish = body.querySelector('.pair .en') !== null;
  if (!hasEnglish) return;  // pure-Chinese article: do nothing

  // build the toggle button
  const btn = document.createElement('button');
  btn.className = 'lang-toggle has-en';
  btn.type = 'button';
  btn.textContent = 'show English';
  btn.setAttribute('aria-pressed', 'false');

  // insert it just before the article body
  body.parentNode.insertBefore(btn, body);

  btn.addEventListener('click', () => {
    const showing = body.classList.toggle('show-en');
    btn.setAttribute('aria-pressed', String(showing));
    btn.textContent = showing ? 'hide English' : 'show English';
  });
})();
