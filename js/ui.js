/**
 * Life of Tono — UI / Renderer
 *
 * Renders the game grid and handles all screen interactions.
 * Keeps game logic (game.js) separate from DOM concerns.
 */

// ── App State ──────────────────────────────────────────────────────

let game = null;
let currentLevelIndex = 0;

// ── Boot ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  game = new TonoGame(renderState);
  setupScreens();
  showScreen('title');
});

// ── Screens ────────────────────────────────────────────────────────

function setupScreens() {
  // Title screen — Start button
  document.getElementById('btn-start').addEventListener('click', () => {
    currentLevelIndex = 0;
    startLevel(LEVELS[currentLevelIndex]);
  });

  // Title screen — Open map button
  document.getElementById('btn-open-map').addEventListener('click', () => {
    showScreen('map');
    renderMap();
  });

  // In-game — Reset button
  document.getElementById('btn-reset').addEventListener('click', () => {
    game.reset();
  });

  // In-game — Back to map
  document.getElementById('btn-back').addEventListener('click', () => {
    showScreen('map');
    renderMap();
  });

  // Win overlay — Next level
  document.getElementById('btn-next').addEventListener('click', () => {
    currentLevelIndex++;
    if (currentLevelIndex < LEVELS.length) {
      startLevel(LEVELS[currentLevelIndex]);
    } else {
      showScreen('title'); // all done!
    }
  });

  // Win overlay — Map
  document.getElementById('btn-win-map').addEventListener('click', () => {
    showScreen('map');
    renderMap();
  });

  // Lost overlay — Retry
  document.getElementById('btn-retry').addEventListener('click', () => {
    game.reset();
    showScreen('play');
  });

  // Lost overlay — Map
  document.getElementById('btn-lost-map').addEventListener('click', () => {
    showScreen('map');
    renderMap();
  });

  // Map screen — back
  document.getElementById('btn-map-back').addEventListener('click', () => {
    // Go back to title if no level has been started yet
    const playScreen = document.getElementById('screen-play');
    if (playScreen && !playScreen.hidden) {
      showScreen('play');
    } else {
      showScreen('title');
    }
  });
}

function showScreen(name) {
  ['title', 'play', 'map'].forEach(s => {
    const el = document.getElementById('screen-' + s);
    if (el) el.hidden = (s !== name);
  });
}

function startLevel(levelData) {
  game.loadLevel(levelData);
  updateLevelHeader(levelData);
  showScreen('play');
}

// ── Level Header ───────────────────────────────────────────────────

function updateLevelHeader(level) {
  document.getElementById('level-id').textContent    = 'Level ' + level.id;
  document.getElementById('level-emoji').textContent = level.emoji;
  document.getElementById('level-mission').textContent = level.mission;

  const badge = document.getElementById('mechanic-badge');
  badge.textContent = level.mechanic;
  badge.className = 'mechanic-badge mechanic-' + level.mechanic;
}

// ── Render State ───────────────────────────────────────────────────

function renderState(state) {
  renderGrid(state);
  renderMoveCount(state.moveCount);

  // Overlays
  document.getElementById('overlay-win').hidden  = (state.phase !== 'won');
  document.getElementById('overlay-lost').hidden = (state.phase !== 'lost');

  // Update next button text on last level
  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.textContent = currentLevelIndex >= LEVELS.length - 1
      ? 'Selesai! 🎉'
      : 'Level Berikutnya →';
  }
}

function renderMoveCount(n) {
  const el = document.getElementById('move-count');
  if (el) el.textContent = n;
}

// ── Grid Renderer ──────────────────────────────────────────────────

function renderGrid(state) {
  const { level, cells, flooded, path } = state;
  const { rows, cols } = level.gridSize;
  const grid = document.getElementById('game-grid');
  if (!grid) return;

  // Set CSS grid columns dynamically
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Build set of path indices for styling
  const pathSet = new Set(path);

  grid.innerHTML = '';
  cells.forEach((cell, idx) => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    const isStart   = r === level.start[0] && c === level.start[1];
    const isEnd     = r === level.end[0]   && c === level.end[1];
    const isFlooded = flooded.has(idx);
    const isOnPath  = pathSet.has(idx);

    const div = document.createElement('div');
    div.className = [
      'cell',
      isFlooded ? 'cell--flooded' : '',
      cell.locked  ? 'cell--locked'  : '',
      isOnPath     ? 'cell--path'    : '',
      isStart      ? 'cell--start'   : '',
      isEnd        ? 'cell--end'     : '',
    ].filter(Boolean).join(' ');

    // Arrow or special icon
    if (isFlooded) {
      div.innerHTML = '<span class="cell-icon">🌊</span>';
    } else if (isEnd) {
      div.innerHTML = '<span class="cell-icon cell-end-icon">🏠</span>';
    } else {
      const arrow = document.createElement('span');
      arrow.className = 'cell-arrow dir-' + cell.dir;
      arrow.textContent = DIR_ARROW[cell.dir];
      div.appendChild(arrow);
      if (cell.locked) {
        const lock = document.createElement('span');
        lock.className = 'cell-lock';
        lock.textContent = '🔒';
        div.appendChild(lock);
      }
    }

    // Tono marker at start
    if (isStart) {
      const tono = document.createElement('span');
      tono.className = 'cell-tono';
      tono.textContent = '🧑';
      div.appendChild(tono);
    }

    if (!isFlooded && !cell.locked) {
      div.addEventListener('click', () => game.tapCell(idx));
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', `Rotate cell ${r+1},${c+1}`);
    }

    grid.appendChild(div);
  });
}

// ── Level Map ──────────────────────────────────────────────────────

function renderMap() {
  const container = document.getElementById('map-levels');
  if (!container) return;
  container.innerHTML = '';

  // Group levels
  const groups = {};
  LEVELS.forEach(lvl => {
    if (!groups[lvl.group]) groups[lvl.group] = { name: lvl.groupName, mechanic: lvl.mechanic, levels: [] };
    groups[lvl.group].levels.push(lvl);
  });

  Object.values(groups).forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'map-group';

    const header = document.createElement('div');
    header.className = 'map-group-header';
    header.innerHTML = `
      <span class="map-group-name">${group.name}</span>
      <span class="map-group-badge mechanic-${group.mechanic}">${group.mechanic}</span>
    `;
    groupEl.appendChild(header);

    group.levels.forEach(lvl => {
      const btn = document.createElement('button');
      btn.className = 'map-level-btn';
      btn.innerHTML = `
        <span class="map-level-emoji">${lvl.emoji}</span>
        <span class="map-level-info">
          <span class="map-level-id">Level ${lvl.id}</span>
          <span class="map-level-mission">${lvl.mission}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        currentLevelIndex = LEVEL_IDS.indexOf(lvl.id);
        startLevel(lvl);
      });
      groupEl.appendChild(btn);
    });

    container.appendChild(groupEl);
  });
}
