/**
 * Life of Tono — Core Game Engine
 *
 * Mechanic: Grid puzzle — player rotates arrow cells to build a
 * continuous path from Tono's start to the destination.
 * Arrow directions: U/D/L/R. Tap a cell to rotate 90° clockwise.
 * Locked cells (one-way mechanic) cannot be rotated.
 * Flood mechanic: a row floods every N moves, blocking those cells.
 */

// ── Direction helpers ──────────────────────────────────────────────

const DIR_ORDER = ['U', 'R', 'D', 'L'];
const DIR_DELTA = { U: [-1,0], D: [1,0], L: [0,-1], R: [0,1] };
const DIR_OPPOSITE = { U:'D', D:'U', L:'R', R:'L' };
const DIR_ARROW = { U: '↑', D: '↓', L: '←', R: '→' };

function rotateDir(dir) {
  const i = DIR_ORDER.indexOf(dir);
  return DIR_ORDER[(i + 1) % 4];
}

// ── Game State ─────────────────────────────────────────────────────

class TonoGame {
  constructor(onStateChange) {
    this.onStateChange = onStateChange; // callback(state)
    this.level = null;
    this.cells = [];       // flat array, index = row*cols+col
    this.flooded = new Set(); // set of cell indices that are flooded
    this.moveCount = 0;
    this.phase = 'idle';   // idle | playing | won | lost
    this.path = [];        // currently highlighted path
  }

  loadLevel(levelData) {
    this.level = levelData;
    // Deep copy cells so we don't mutate the original
    this.cells = levelData.cells.map(c => ({ ...c }));
    this.flooded = new Set();
    this.moveCount = 0;
    this.phase = 'playing';
    this.path = [];
    this._computePath();
    this.notify();
  }

  // Tap a cell to rotate its arrow
  tapCell(index) {
    if (this.phase !== 'playing') return;
    const cell = this.cells[index];
    if (!cell || cell.locked || this.flooded.has(index)) return;

    cell.dir = rotateDir(cell.dir);
    this.moveCount++;

    // Apply flood if applicable
    if (this.level.flood) {
      this._applyFlood();
    }

    this._computePath();

    // Check win condition
    const { rows, cols } = this.level.gridSize;
    const [er, ec] = this.level.end;
    const endIndex = er * cols + ec;
    if (this.path.includes(endIndex)) {
      this.phase = 'won';
    }

    // Check lose: Tono's start is flooded
    const [sr, sc] = this.level.start;
    const startIndex = sr * cols + sc;
    if (this.flooded.has(startIndex)) {
      this.phase = 'lost';
    }

    this.notify();
  }

  // Check if current arrows form a path from start to end
  _computePath() {
    const { rows, cols } = this.level.gridSize;
    const [sr, sc] = this.level.start;
    const [er, ec] = this.level.end;
    const startIdx = sr * cols + sc;
    const endIdx   = er * cols + ec;

    const visited = new Set();
    const queue = [startIdx];
    const pathMap = new Map(); // index → came from index

    while (queue.length) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);

      if (cur === endIdx) {
        // Reconstruct path
        const path = [];
        let c = cur;
        while (c !== undefined) {
          path.unshift(c);
          c = pathMap.get(c);
        }
        this.path = path;
        return;
      }

      const r = Math.floor(cur / cols);
      const c = cur % cols;
      const cell = this.cells[cur];
      if (!cell || this.flooded.has(cur)) continue;

      // Follow THIS cell's arrow to neighbour
      const [dr, dc] = DIR_DELTA[cell.dir];
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

      const nextIdx = nr * cols + nc;
      const nextCell = this.cells[nextIdx];
      if (!nextCell || this.flooded.has(nextIdx)) continue;

      // The next cell must have its arrow pointing BACK (connected path)
      if (nextCell.dir !== DIR_OPPOSITE[cell.dir]) continue;

      if (!visited.has(nextIdx)) {
        pathMap.set(nextIdx, cur);
        queue.push(nextIdx);
      }
    }

    this.path = []; // no path found
  }

  _applyFlood() {
    const { flood, gridSize: { rows, cols } } = this.level;
    if (!flood) return;
    if (this.moveCount % flood.interval !== 0) return;

    // Calculate which row is currently flooded up to
    const floodedRows = Math.floor(this.moveCount / flood.interval);
    const topFloodRow = flood.startRow - floodedRows + 1;

    for (let r = flood.startRow; r >= topFloodRow && r >= 0; r--) {
      for (let c = 0; c < cols; c++) {
        this.flooded.add(r * cols + c);
      }
    }
  }

  notify() {
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  getState() {
    return {
      level: this.level,
      cells: this.cells,
      flooded: new Set(this.flooded),
      moveCount: this.moveCount,
      phase: this.phase,
      path: [...this.path],
    };
  }

  reset() {
    if (this.level) this.loadLevel(this.level);
  }
}
