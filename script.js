// ═══════════════════════════════════════════════
//  TIER LIST DU GLAUDE
//  (l'homme, la légende, le bob peinard)
// ═══════════════════════════════════════════════

const GLAUDE = {
  pasPisse: [
    { name: 'La Goudale',           imgUrl: 'image/Goudale.png',          fallback: '🍺' },
    { name: 'La Bière du Demon',    imgUrl: 'image/LaBièreDuDemon.png',   fallback: '🍺' },
    { name: 'La Chouffe',           imgUrl: 'image/LaChouffe.png',        fallback: '🍺' },
    { name: 'JoliCoeur',           imgUrl: 'image/JoliCoeur.png',        fallback: '🍺' },
    { name: 'Delirium',             imgUrl: 'image/Delirium.png',         fallback: '🍺' },
    { name: 'La Cuvée des Trolls',  imgUrl: 'image/Trolls.png',           fallback: '🍺' },
    { name: 'La Bête',              imgUrl: 'image/LaBête.png',           fallback: '🍺' },
    { name: '3 Monts',              imgUrl: 'image/3Monts.png',           fallback: '🍺' },
  ],
  pisse: [
    { name: 'Vieux Lille',  imgUrl: 'image/vieuxlille.png',  fallback: '🚽' },
    { name: 'Anosteké',     imgUrl: 'image/Anosteke.png',    fallback: '🚽' },
  ],
};

// ═══════════════════════════════════════════════
//  TIER LIST DU BOMBÉ
//  (l'autre homme, l'autre légende, les lunettes bien NOIRES)
// ═══════════════════════════════════════════════

const BOMBE = {
  pasPisse: [
    { name: 'La Goudale',           imgUrl: 'image/Goudale.png',          fallback: '🍺' },
    { name: 'La Chouffe',           imgUrl: 'image/LaChouffe.png',        fallback: '🍺' },
    { name: 'La Cuvée des Trolls',  imgUrl: 'image/Trolls.png',           fallback: '🍺' },
    { name: 'La Bière du Demon',    imgUrl: 'image/LaBièreDuDemon.png',   fallback: '🍺' },
    { name: 'Delirium',             imgUrl: 'image/Delirium.png',         fallback: '🍺' },
    { name: 'JoliCoeur',           imgUrl: 'image/JoliCoeur.png',        fallback: '🍺' },
    { name: 'La Bête',              imgUrl: 'image/LaBête.png',           fallback: '🍺' },
  ],
  pisse: [
    { name: '3 Monts',      imgUrl: 'image/3Monts.png',       fallback: '🚽' },
    { name: 'Vieux Lille',  imgUrl: 'image/vieuxlille.png',   fallback: '🚽' },
    { name: 'Anosteké',     imgUrl: 'image/Anosteke.png',     fallback: '🚽' },
  ],
};

// ═══════════════════════════════════════════════
//  UTILS (c'est pour mettre le pluriel ptdrr)
// ═══════════════════════════════════════════════

function countLabel(n) {
  return n + (n > 1 ? ' bières' : ' bière');
}

// ═══════════════════════════════════════════════
//  BUILD CARD 
// ═══════════════════════════════════════════════

function buildCard(beer) {
  const card = document.createElement('div');
  card.className = 'beer-card';

  const wrap = document.createElement('div');
  wrap.className = 'beer-img-wrap';

  const img = document.createElement('img');
  img.src = beer.imgUrl;
  img.alt = beer.name;

  const fallback = document.createElement('span');
  fallback.className = 'beer-emoji-fallback';
  fallback.textContent = beer.fallback || '🍺';

  // Si l'image se barre ptit emoji qui sauve
  img.onerror = function() {
    this.style.display = 'none';
    fallback.style.display = 'block';
  };

  wrap.appendChild(img);
  wrap.appendChild(fallback);

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
  const grid = document.getElementById(gridId);
  const counter = document.getElementById(countId);
  beers.forEach(b => grid.appendChild(buildCard(b)));
  counter.textContent = countLabel(beers.length);
}

populate('glaude-pp-grid', 'glaude-pp-count', GLAUDE.pasPisse);
populate('glaude-p-grid',  'glaude-p-count',  GLAUDE.pisse);
populate('bombe-pp-grid',  'bombe-pp-count',  BOMBE.pasPisse);
populate('bombe-p-grid',   'bombe-p-count',   BOMBE.pisse);

// ═══════════════════════════════════════════════
//  SWITCH TAB — Le Glaude ou Le Bombé (mskn j'me sens dans matrix en vous demandant la pilule rouge ou bleue)
// ═══════════════════════════════════════════════

function switchTab(who) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && who === 'glaude') || (i === 1 && who === 'bombe'));
  });
  document.querySelectorAll('.tier-container').forEach(c => c.classList.remove('active'));
  document.getElementById(`tier-${who}`).classList.add('active');
}