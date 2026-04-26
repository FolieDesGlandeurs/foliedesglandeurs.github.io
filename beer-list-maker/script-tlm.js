// ═════════════════════════════════════════════════════════════════════════════
//  BEER LIST MAKER — script principal
//  fais ta liste, télécharge-la, et défends-la comme ton fils devant le Bombé
// ═════════════════════════════════════════════════════════════════════════════

// ── LA CAVE — toutes les bières disponibles ──
// (ajouter une bière ici = elle apparaît dans le pool. Magique nan ?)
const ALL_BEERS = [
  { name: 'La Bière du Démon',     imgUrl: '/images/LaBièreDuDemon.webp' },
  { name: 'La Bête',               imgUrl: '/images/LaBête.webp' },
  { name: 'Anosteké',              imgUrl: '/images/Anosteke.webp' },
  { name: 'La Chouffe',            imgUrl: '/images/LaChouffe.webp' },
  { name: 'Delirium',              imgUrl: '/images/Delirium.webp' },
  { name: 'La Cuvée des Trolls',   imgUrl: '/images/Trolls.webp' },
  { name: 'Vieux Lille',           imgUrl: '/images/vieuxlille.webp' },
  { name: 'La Goudale',            imgUrl: '/images/Goudale.webp' },
  { name: '3 Monts',               imgUrl: '/images/3Monts.webp' },
  { name: 'JoliCoeur',             imgUrl: '/images/JoliCoeur.webp' },
  { name: 'Heineken',              imgUrl: '/images/Heineken.webp' },
  { name: 'La Charnue',            imgUrl: '/images/LaCharnue.webp' },
  { name: 'Chti',                  imgUrl: '/images/Chti.webp' },
  { name: '72 Blonde',             imgUrl: '/images/Blonde72.webp' },
];

// ═══════════════════════════════════════════════
//  DRAG (souris)
// ═══════════════════════════════════════════════

let draggedCard = null;
let dragSource  = null;

// Fallback emoji si l'image refuse de charger
const FALLBACK_EMOJIS = ['🍺','🍻','🫗','🥂','🍾'];
function getEmoji(name) {
  let h = 0;
  for (const c of name) h = ((h << 5) - h) + c.charCodeAt(0);
  return FALLBACK_EMOJIS[Math.abs(h) % FALLBACK_EMOJIS.length];
}

// ═══════════════════════════════════════════════
//  INSERTION PRÉCISE CORE
// ═══════════════════════════════════════════════

function getInsertionPoint(grid, clientX, clientY) {
  const cards = [...grid.querySelectorAll('.tlm-card:not(.dragging)')];
  if (!cards.length) return null;

  let closest     = null;
  let closestDist = Infinity;

  for (const card of cards) {
    const rect     = card.getBoundingClientRect();
    const centerX  = rect.left + rect.width  / 2;
    const centerY  = rect.top  + rect.height / 2;
    const dx       = clientX - centerX;
    const dy       = clientY - centerY;
    const dist     = Math.sqrt(dx * dx + dy * dy);

    if (dist < closestDist) {
      closestDist = dist;
      closest     = { card, isLeft: clientX < centerX };
    }
  }

  if (!closest) return null;

  if (closest.isLeft) return closest.card;

  const next = closest.card.nextElementSibling;
  return next && next.classList.contains('drop-indicator') ? next.nextElementSibling : next;
}

// ═══════════════════════════════════════════════
//  DROP INDICATOR (Golden Line et pas Golden Wind lol)
// ═══════════════════════════════════════════════

let dropIndicator = null;

function showDropIndicator(grid, clientX, clientY) {
  // Retire l'ancien si présent
  removeDropIndicator();

  const refNode = getInsertionPoint(grid, clientX, clientY);

  dropIndicator = document.createElement('div');
  dropIndicator.className = 'drop-indicator';

  grid.insertBefore(dropIndicator, refNode ?? null);
}

function removeDropIndicator() {
  if (dropIndicator) {
    dropIndicator.remove();
    dropIndicator = null;
  }
}

// ═══════════════════════════════════════════════
//  BUILD CARD (buildImgWrap -> utils.js)
// ═══════════════════════════════════════════════

function buildCard(beer) {
  const card = document.createElement('div');
  card.className = 'tlm-card';
  card.draggable = true;
  card.dataset.name = beer.name;

  const wrap = buildImgWrap(beer, 'card-img-wrap', 'card-emoji-fallback', getEmoji(beer.name));

  const nameEl = document.createElement('span');
  nameEl.className = 'card-name';
  nameEl.textContent = beer.name;

  card.appendChild(wrap);
  card.appendChild(nameEl);

  // ── Events souris ──
  card.addEventListener('dragstart', () => {
    draggedCard = card;
    dragSource  = card.parentElement.id;
    setTimeout(() => card.classList.add('dragging'), 0);
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    removeDropIndicator();
    draggedCard = null;
    dragSource  = null;
  });

  // ── Events tactiles ──
  card.addEventListener('touchstart', onTouchStart, { passive: false });
  card.addEventListener('touchmove',  onTouchMove,  { passive: false });
  card.addEventListener('touchend',   onTouchEnd,   { passive: false });

  return card;
}

// ═══════════════════════════════════════════════
//  TOUCH DRAG (mobile)
//  (je déteste optimiser pour mobile...)
// ═══════════════════════════════════════════════

let touchCard    = null;
let touchGhost   = null;
let touchSource  = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

const DROP_ZONES = ['grid-pas-pisse', 'grid-pisse', 'grid-pool'];

function onTouchStart(e) {
  const card  = e.currentTarget;
  const touch = e.touches[0];
  const rect  = card.getBoundingClientRect();

  touchCard   = card;
  touchSource = card.parentElement.id;

  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  touchGhost = card.cloneNode(true);
  touchGhost.classList.add('touch-ghost');
  touchGhost.style.width  = rect.width  + 'px';
  touchGhost.style.height = rect.height + 'px';
  touchGhost.style.left   = (touch.clientX - touchOffsetX + window.scrollX) + 'px';
  touchGhost.style.top    = (touch.clientY - touchOffsetY + window.scrollY) + 'px';
  document.body.appendChild(touchGhost);

  card.classList.add('dragging');
  e.preventDefault();
}

function onTouchMove(e) {
  if (!touchGhost) return;
  const touch = e.touches[0];

  touchGhost.style.left = (touch.clientX - touchOffsetX + window.scrollX) + 'px';
  touchGhost.style.top  = (touch.clientY - touchOffsetY + window.scrollY) + 'px';

  // Cherche la zone sous le doigt 
  touchGhost.style.display = 'none';
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  touchGhost.style.display = '';

  DROP_ZONES.forEach(id => document.getElementById(id).classList.remove('drag-over'));
  removeDropIndicator();

  const zone = el && el.closest('[id]');
  if (zone && DROP_ZONES.includes(zone.id)) {
    const grid = document.getElementById(zone.id);
    grid.classList.add('drag-over');
    showDropIndicator(grid, touch.clientX, touch.clientY);
  }

  e.preventDefault();
}

function onTouchEnd(e) {
  if (!touchCard || !touchGhost) return;
  const touch = e.changedTouches[0];

  touchGhost.style.display = 'none';
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  touchGhost.style.display = '';

  const zone     = el && el.closest('[id]');
  const targetId = zone && DROP_ZONES.includes(zone.id) ? zone.id : null;

  DROP_ZONES.forEach(id => document.getElementById(id).classList.remove('drag-over'));
  touchGhost.remove();
  touchGhost = null;
  touchCard.classList.remove('dragging');

  if (targetId) {
    const grid    = document.getElementById(targetId);
    const refNode = getInsertionPoint(grid, touch.clientX, touch.clientY);
    removeDropIndicator();
    grid.insertBefore(touchCard, refNode ?? null);
    refreshEmpty(touchSource);
    refreshEmpty(targetId);
    updateCounts();
    saveState();
  } else {
    removeDropIndicator();
  }

  touchCard   = null;
  touchSource = null;
  e.preventDefault();
}

// ═══════════════════════════════════════════════
//  DRAG HANDLERS (souris)
// ═══════════════════════════════════════════════

function onDragOver(e, targetId) {
  e.preventDefault();
  const grid = document.getElementById(targetId);
  grid.classList.add('drag-over');
  showDropIndicator(grid, e.clientX, e.clientY);
}

function onDragLeave(e) {
  if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
  e.currentTarget.classList.remove('drag-over');
  removeDropIndicator();
}

function onDrop(e, targetId) {
  e.preventDefault();
  const grid = document.getElementById(targetId);
  grid.classList.remove('drag-over');
  if (!draggedCard) return;

  const refNode = getInsertionPoint(grid, e.clientX, e.clientY);
  removeDropIndicator();

  grid.insertBefore(draggedCard, refNode ?? null);

  refreshEmpty(dragSource);
  refreshEmpty(targetId);
  updateCounts();
  saveState();
}

// ═══════════════════════════════════════════════
//  EMPTY STATES
// ═══════════════════════════════════════════════

function refreshEmpty(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const cards = grid.querySelectorAll('.tlm-card');
  const empty = grid.querySelector('.tlm-empty, .tlm-pool-empty');
  if (cards.length === 0 && !empty) {
    const e = document.createElement('span');
    if (gridId === 'grid-pool') {
      e.className = 'tlm-pool-empty';
      e.textContent = '🎉 Toutes les bières ont été classées !';
    } else {
      e.className = 'tlm-empty';
      e.textContent = gridId === 'grid-pas-pisse'
        ? 'Glisse ici les bières qui envoient 🍺'
        : 'Glisse ici les bières de merde 🚽';
    }
    grid.appendChild(e);
  } else if (cards.length > 0 && empty) {
    empty.remove();
  }
}

// ═══════════════════════════════════════════════
//  COMPTEURS (labels from utils.js)
// ═══════════════════════════════════════════════

function updateCounts() {
  const pp = document.getElementById('grid-pas-pisse').querySelectorAll('.tlm-card').length;
  const p  = document.getElementById('grid-pisse').querySelectorAll('.tlm-card').length;
  document.getElementById('count-pp').textContent = countLabel(pp);
  document.getElementById('count-p').textContent  = countLabel(p);
}

// ═══════════════════════════════════════════════
//  PERSISTENCE — localStorage
//  (un refresh ne détruira plus jamais le travail acharné du Glaude)
// ═══════════════════════════════════════════════

function saveState() {
  const pseudo = document.getElementById('pseudo-input').value.trim();
  const state  = {
    pseudo,
    pasPisse: [...document.getElementById('grid-pas-pisse').querySelectorAll('.tlm-card')].map(c => c.dataset.name),
    pisse:    [...document.getElementById('grid-pisse').querySelectorAll('.tlm-card')].map(c => c.dataset.name),
  };
  try {
    localStorage.setItem('beerlist-state', JSON.stringify(state));
  } catch (e) {
    console.warn('localStorage indisponible :', e);
  }
}

function loadState() {
  let raw;
  try {
    raw = localStorage.getItem('beerlist-state');
  } catch (e) {
    return; // localStorage bloqué (privé strict)
  }
  if (!raw) return;

  try {
    const state = JSON.parse(raw);

    // Restauration du pseudo
    if (state.pseudo) {
      const input = document.getElementById('pseudo-input');
      input.value = state.pseudo;
      updatePseudo(state.pseudo);
    }

    // Restauration des grilles (ordre préservé)
    const saved = [...(state.pasPisse || []), ...(state.pisse || [])];
    if (!saved.length) return;

    const ppGrid = document.getElementById('grid-pas-pisse');
    const pGrid  = document.getElementById('grid-pisse');
    const pool   = document.getElementById('grid-pool');

    saved.forEach(name => {
      const card = [...pool.querySelectorAll('.tlm-card')].find(c => c.dataset.name === name);
      if (!card) return;
      if (state.pasPisse.includes(name)) ppGrid.appendChild(card);
      else pGrid.appendChild(card);
    });

    refreshEmpty('grid-pool');
    refreshEmpty('grid-pas-pisse');
    refreshEmpty('grid-pisse');
    updateCounts();
    showToast('Beer list restaurée 🍺');
  } catch (e) {
    console.warn('Impossible de restaurer la beer list :', e);
  }
}

// ═══════════════════════════════════════════════
//  RESET
// ═══════════════════════════════════════════════

function resetAll() {
  ['grid-pas-pisse', 'grid-pisse', 'grid-pool'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
  try { localStorage.removeItem('beerlist-state'); } catch (_) {}
  loadBeers();
  updateCounts();
  showToast('Liste réinitialisée 🔄');
}

// ═══════════════════════════════════════════════
//  LOAD
// ═══════════════════════════════════════════════

function loadBeers() {
  const pool = document.getElementById('grid-pool');
  ALL_BEERS.forEach(b => pool.appendChild(buildCard(b)));
  refreshEmpty('grid-pool');
  refreshEmpty('grid-pas-pisse');
  refreshEmpty('grid-pisse');
}

// ── Mise à jour du titre selon le pseudo saisi ──
function updatePseudo(val) {
  const title = document.getElementById('page-title');
  if (val.trim()) {
    title.innerHTML = `Beer List de<br><span>${val.trim()}</span>`;
  } else {
    title.innerHTML = `Beer List<br><span>Maker</span>`;
  }
}

// ── Format date pour le pied de l'image exportée ──
function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ═══════════════════════════════════════════════
//  DOWNLOAD (html2canvas)
// ═══════════════════════════════════════════════

async function downloadTierList() {
  const pseudo            = document.getElementById('pseudo-input').value.trim();
  const captureTitle      = document.getElementById('capture-title');
  const captureFooter     = document.getElementById('capture-footer');
  const captureFooterDate = document.getElementById('capture-footer-date');
  const zone              = document.getElementById('capture-zone');
  const loading           = document.getElementById('loading');

  captureTitle.textContent    = pseudo ? `Beer List de ${pseudo}` : `Ma Beer List`;
  captureTitle.style.display  = 'block';
  captureFooterDate.textContent = getFormattedDate();
  captureFooter.classList.add('visible');
  loading.classList.add('show');

  await new Promise(r => setTimeout(r, 100));

  try {
    const canvas = await html2canvas(zone, {
      backgroundColor: '#0d0a06',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: 900, // force le rendu en mode desktop 
    });
    const link     = document.createElement('a');
    const filename = pseudo
      ? `beerlist-${pseudo.toLowerCase().replace(/\s+/g, '-')}.png`
      : 'ma-beerlist.png';
    link.download = filename;
    link.href     = canvas.toDataURL('image/png');
    link.click();
    showToast('Image téléchargée ! 📸');
  } catch (err) {
    showToast('Erreur lors de la capture 😬');
    console.error(err);
  } finally {
    captureTitle.style.display = 'none';
    captureFooter.classList.remove('visible');
    loading.classList.remove('show');
  }
}

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pseudo-input').addEventListener('input', e => {
    updatePseudo(e.target.value);
    saveState(); // ← persistence du pseudo
  });
  loadBeers();
  loadState(); // ← restauration au chargement
  updateCounts();
});