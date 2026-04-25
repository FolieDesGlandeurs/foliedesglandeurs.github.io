// ═══════════════════════════════════════════════
//  TIER LIST DU GLAUDE
//  (l'homme, la légende, le bob peinard)
// ═══════════════════════════════════════════════

const GLAUDE = {
  pasPisse: [
    { name: 'La Goudale',           imgUrl: 'images/Goudale.webp',          fallback: '🍺' },
    { name: 'La Bière du Démon',    imgUrl: 'images/LaBièreDuDemon.webp',   fallback: '🍺' },
    { name: 'La Chouffe',           imgUrl: 'images/LaChouffe.webp',        fallback: '🍺' },
    { name: '72 Blonde',            imgUrl: 'images/Blonde72.webp',         fallback: '🍺' },
    { name: 'JoliCoeur',            imgUrl: 'images/JoliCoeur.webp',        fallback: '🍺' },
    { name: 'Delirium',             imgUrl: 'images/Delirium.webp',         fallback: '🍺' },
    { name: 'La Cuvée des Trolls',  imgUrl: 'images/Trolls.webp',           fallback: '🍺' },
    { name: 'La Bête',              imgUrl: 'images/LaBête.webp',           fallback: '🍺' },
    { name: '3 Monts',              imgUrl: 'images/3Monts.webp',           fallback: '🍺' },
  ],
  pisse: [
    { name: 'La Charnue',   imgUrl: 'images/LaCharnue.webp',   fallback: '🚽' },
    { name: 'Chti',         imgUrl: 'images/Chti.webp',        fallback: '🚽' },
    { name: 'Vieux Lille',  imgUrl: 'images/vieuxlille.webp',  fallback: '🚽' },
    { name: 'Anosteké',     imgUrl: 'images/Anosteke.webp',    fallback: '🚽' },
    { name: 'Heineken',     imgUrl: 'images/Heineken.webp',    fallback: '🚽' },
  ],
};

// ═══════════════════════════════════════════════
//  TIER LIST DU BOMBÉ
//  (l'autre homme, l'autre légende, les lunettes bien NOIRES)
// ═══════════════════════════════════════════════

const BOMBE = {
  pasPisse: [
    { name: 'La Goudale',           imgUrl: 'images/Goudale.webp',          fallback: '🍺' },
    { name: 'La Chouffe',           imgUrl: 'images/LaChouffe.webp',        fallback: '🍺' },
    { name: 'La Cuvée des Trolls',  imgUrl: 'images/Trolls.webp',           fallback: '🍺' },
    { name: 'La Bière du Démon',    imgUrl: 'images/LaBièreDuDemon.webp',   fallback: '🍺' },
    { name: 'Chti',                 imgUrl: 'images/Chti.webp',             fallback: '🍺' },
    { name: 'La Charnue',           imgUrl: 'images/LaCharnue.webp',        fallback: '🍺' },
    { name: 'JoliCoeur',            imgUrl: 'images/JoliCoeur.webp',        fallback: '🍺' },
    { name: '72 Blonde',            imgUrl: 'images/Blonde72.webp',         fallback: '🍺' },
    { name: 'Delirium',             imgUrl: 'images/Delirium.webp',         fallback: '🍺' },
    { name: 'La Bête',              imgUrl: 'images/LaBête.webp',           fallback: '🍺' },
  ],
  pisse: [
    { name: 'Heineken',     imgUrl: 'images/Heineken.webp',    fallback: '🚽' },
    { name: '3 Monts',      imgUrl: 'images/3Monts.webp',      fallback: '🚽' },
    { name: 'Vieux Lille',  imgUrl: 'images/vieuxlille.webp',  fallback: '🚽' },
    { name: 'Anosteké',     imgUrl: 'images/Anosteke.webp',    fallback: '🚽' },
  ],
};

// ═══════════════════════════════════════════════
//  BUILD CARD — délègue l'image à buildImgWrap (utils.js)
// ═══════════════════════════════════════════════

function buildCard(beer) {
  const card = document.createElement('div');
  card.className = 'beer-card';

  const wrap = buildImgWrap(beer, 'beer-img-wrap', 'beer-emoji-fallback', beer.fallback);

  const img = wrap.querySelector('img');
  if (img) img.loading = 'lazy';

  const nameEl = document.createElement('span');
  nameEl.className = 'beer-name';
  nameEl.textContent = beer.name;

  card.appendChild(wrap);
  card.appendChild(nameEl);
  return card;
}

// ═══════════════════════════════════════════════
//  POPULATE (grille + compteur)
// ═══════════════════════════════════════════════

function populate(gridId, countId, beers) {
  const grid    = document.getElementById(gridId);
  const counter = document.getElementById(countId);
  beers.forEach(b => grid.appendChild(buildCard(b)));
  counter.textContent = countLabel(beers.length); // countLabel vient de utils.js
}

populate('glaude-pp-grid', 'glaude-pp-count', GLAUDE.pasPisse);
populate('glaude-p-grid',  'glaude-p-count',  GLAUDE.pisse);
populate('bombe-pp-grid',  'bombe-pp-count',  BOMBE.pasPisse);
populate('bombe-p-grid',   'bombe-p-count',   BOMBE.pisse);

// ═══════════════════════════════════════════════
//  SWITCH TAB (Transition coolos)
// ═══════════════════════════════════════════════

function switchTab(who) {
  const containers = document.querySelectorAll('.tier-container');
  const current = document.querySelector('.tier-container.active');
  const next = document.getElementById(`tier-${who}`);

  if (!current || current === next) return;

  document.querySelectorAll('.tab-btn').forEach(b => {
    const isActive = b.dataset.tab === who;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  current.classList.add('tab-exit');

  setTimeout(() => {
    current.classList.remove('active', 'tab-exit');

    next.classList.add('active', 'tab-enter');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        next.classList.remove('tab-enter');
      });
    });
  }, 220);
}

document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});