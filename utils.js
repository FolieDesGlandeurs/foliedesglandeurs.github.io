// ═══════════════════════════════════════════════
//  UTILS — partagé entre script.js et script-tlm.js
//  (une seule source de vérité, comme le verdict du Glaude)
// ═══════════════════════════════════════════════

/**
 * Retourne "N bière(s)" avec le pluriel qui va bien
 */
function countLabel(n) {
  return n + (n > 1 ? ' bières' : ' bière');
}

/**
 * Crée un wrapper <div> avec une <img> et un <span> fallback emoji.
 * Si l'image fail ou est absente → le fallback prend le relais.
 *
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
