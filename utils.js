// ═══════════════════════════════════════════════
//  UTILS — partagé entre script.js et script-tlm.js
//  (une seule source de vérité, comme le verdict du Glaude)
// ═══════════════════════════════════════════════

function countLabel(n) {
  return n + (n > 1 ? ' bières' : ' bière');
}

/**
 * @param {Object} beer          - { imgUrl, name }
 * @param {string} wrapClass     - classe CSS du wrapper
 * @param {string} fallbackClass - classe CSS du span fallback
 * @param {string} fallbackText  - emoji ou texte de secours
 */

function buildImgWrap(beer, wrapClass, fallbackClass, fallbackText) {
  const wrap = document.createElement('div');
  wrap.className = wrapClass;

  const img = document.createElement('img');
  img.src = beer.imgUrl || '';
  img.alt = beer.name;
  img.width = 62;
  img.height = 62;

  const fb = document.createElement('span');
  fb.className = fallbackClass;
  fb.textContent = fallbackText || '🍺';

  if (!beer.imgUrl) {
    img.style.display = 'none';
    fb.style.display = 'block';
  } else {
    img.onerror = function () {
      this.style.display = 'none';
      fb.style.display = 'block';
    };
  }

  wrap.appendChild(img);
  wrap.appendChild(fb);
  return wrap;
}

// ═══════════════════════════════════════════════
//  BOUTON RETOUR EN HAUT
// ═══════════════════════════════════════════════
const backToTopBtn = document.getElementById('back-to-top');

let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const scrolled = document.body.scrollTop > 300 || document.documentElement.scrollTop > 300;
    backToTopBtn.style.display = scrolled ? 'block' : 'none';
    scrollTicking = false;
  });
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});