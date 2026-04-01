// ═══════════════════════════════════════════════
//  TIER LIST DU GLAUDE
// ═══════════════════════════════════════════════

const GLAUDE = {
  pasPisse: [
    { name: 'La Goudale',           imgUrl: 'image/Goudale.png',          fallback: '🍺' },
    { name: 'La Bière du Demon', imgUrl: 'image/LaBièreDuDemon.png', fallback: '🍺' },
    { name: 'La Chouffe', imgUrl: 'image/LaChouffe.png', fallback: '🍺' },
    { name: 'Delirium', imgUrl: 'image/Delirium.png', fallback: '🍺' },
    { name: 'La Cuvée des Trolls', imgUrl: 'image/Trolls.png', fallback: '🍺' },
    { name: 'La Bête',           imgUrl: 'image/LaBête.png',          fallback: '🍺' },
  ],
  pisse: [
    { name: 'Vieux Lille',           imgUrl: 'image/vieuxlille.png',          fallback: '🚽' },
    { name: 'Anosteké', imgUrl: 'image/Anosteke.png', fallback: '🚽' },
  ],
};

// ═══════════════════════════════════════════════
//  TIER LIST DU BOMBÉ
// ═══════════════════════════════════════════════

const BOMBE = {
  pasPisse: [
    { name: 'La Goudale',           imgUrl: 'image/Goudale.png',          fallback: '🍺' },
    { name: 'La Chouffe', imgUrl: 'image/LaChouffe.png', fallback: '🍺' },
    { name: 'La Cuvée des Trolls', imgUrl: 'image/Trolls.png', fallback: '🍺' },
    { name: 'La Bière du Demon', imgUrl: 'image/LaBièreDuDemon.png', fallback: '🍺' },
    { name: 'Delirium', imgUrl: 'image/Delirium.png', fallback: '🍺' },
    { name: 'La Bête',           imgUrl: 'image/LaBête.png',          fallback: '🍺' },
  ],
  pisse: [
    { name: 'Vieux Lille',           imgUrl: 'image/vieuxlille.png',          fallback: '🚽' },
    { name: 'Anosteké', imgUrl: 'image/Anosteke.png', fallback: '🚽' },
  ],
};

// ═══════════════════════════════════════════════

function countLabel(n) {
  return n + (n > 1 ? ' bières' : ' bière');
}

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

function switchTab(who) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && who === 'glaude') || (i === 1 && who === 'bombe'));
  });
  document.querySelectorAll('.tier-container').forEach(c => c.classList.remove('active'));
  document.getElementById(`tier-${who}`).classList.add('active');
}