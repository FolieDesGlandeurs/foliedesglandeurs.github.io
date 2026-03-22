// ── AJOUTER LES BIÈRES ──
const ALL_BEERS = [
  { name: 'La Bière du Démon', imgUrl: 'image/LaBièreDuDemon.png' },
  { name: 'La Bête',        imgUrl: 'image/LaBête.png' },
  { name: 'Anosteké',       imgUrl: 'image/Anosteke.png' },
  { name: 'La Chouffe',     imgUrl: 'image/LaChouffe.png' },
  { name: 'Delirium',       imgUrl: 'image/Delirium.png' },
];

// ── DRAG ──
let draggedCard = null;
let dragSource  = null;

const FALLBACK_EMOJIS = ['🍺','🍻','🫗','🥂','🍾'];
function getEmoji(name) {
  let h = 0;
  for (const c of name) h = ((h << 5) - h) + c.charCodeAt(0);
  return FALLBACK_EMOJIS[Math.abs(h) % FALLBACK_EMOJIS.length];
}

// ── BUILD CARD ──
function buildCard(beer) {
  const card = document.createElement('div');
  card.className = 'tlm-card';
  card.draggable = true;
  card.dataset.name = beer.name;

  const wrap = document.createElement('div');
  wrap.className = 'card-img-wrap';

  const img = document.createElement('img');
  img.src = beer.imgUrl || '';
  img.alt = beer.name;

  const fb = document.createElement('span');
  fb.className = 'card-emoji-fallback';
  fb.textContent = getEmoji(beer.name);

  if (!beer.imgUrl) {
    img.style.display = 'none';
    fb.style.display = 'block';
  } else {
    img.onerror = function() {
      this.style.display = 'none';
      fb.style.display = 'block';
    };
  }

  wrap.appendChild(img);
  wrap.appendChild(fb);

  const nameEl = document.createElement('span');
  nameEl.className = 'card-name';
  nameEl.textContent = beer.name;

  card.appendChild(wrap);
  card.appendChild(nameEl);

  card.addEventListener('dragstart', () => {
    draggedCard = card;
    dragSource  = card.parentElement.id;
    setTimeout(() => card.classList.add('dragging'), 0);
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggedCard = null;
    dragSource  = null;
  });

  return card;
}

// ── DRAG HANDLERS ──
function onDragOver(e, targetId) {
  e.preventDefault();
  document.getElementById(targetId).classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e, targetId) {
  e.preventDefault();
  document.getElementById(targetId).classList.remove('drag-over');
  if (!draggedCard || dragSource === targetId) return;
  document.getElementById(targetId).appendChild(draggedCard);
  refreshEmpty(dragSource);
  refreshEmpty(targetId);
  updateCounts();
}

// ── EMPTY STATES ──
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

// ── COUNTS ──
function updateCounts() {
  const pp = document.getElementById('grid-pas-pisse').querySelectorAll('.tlm-card').length;
  const p  = document.getElementById('grid-pisse').querySelectorAll('.tlm-card').length;
  document.getElementById('count-pp').textContent = pp + (pp > 1 ? ' bières' : ' bière');
  document.getElementById('count-p').textContent  = p  + (p  > 1 ? ' bières' : ' bière');
}

// ── RESET ──
function resetAll() {
  ['grid-pas-pisse', 'grid-pisse', 'grid-pool'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
  loadBeers();
  updateCounts();
  showToast('Liste réinitialisée 🔄');
}

// ── LOAD ──
function loadBeers() {
  const pool = document.getElementById('grid-pool');
  ALL_BEERS.forEach(b => pool.appendChild(buildCard(b)));
  refreshEmpty('grid-pool');
  refreshEmpty('grid-pas-pisse');
  refreshEmpty('grid-pisse');
}

// ── PSEUDO UPDATE ──
function updatePseudo(val) {
  const title = document.getElementById('page-title');
  if (val.trim()) {
    title.innerHTML = `Beer List de<br><span>${val.trim()}</span>`;
  } else {
    title.innerHTML = `Beer List<br><span>Maker</span>`;
  }
}

// ── FORMAT DATE FR ──
function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ── DOWNLOAD ──
async function downloadTierList() {
  const pseudo = document.getElementById('pseudo-input').value.trim();
  const captureTitle  = document.getElementById('capture-title');
  const captureFooter = document.getElementById('capture-footer');
  const captureFooterDate = document.getElementById('capture-footer-date');
  const zone    = document.getElementById('capture-zone');
  const loading = document.getElementById('loading');

  // Titre en haut
  captureTitle.textContent = pseudo
    ? `Beer List de ${pseudo}`
    : `Ma Beer List`;
  captureTitle.style.display = 'block';

  // Footer en bas
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
    });

    const link = document.createElement('a');
    const filename = pseudo
      ? `beerlist-${pseudo.toLowerCase().replace(/\s+/g, '-')}.png`
      : 'ma-beerlist.png';
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
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

// ── TOAST ──
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pseudo-input').addEventListener('input', e => updatePseudo(e.target.value));
  loadBeers();
  updateCounts();
});