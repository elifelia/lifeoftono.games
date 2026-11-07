/**
 * Life of Tono — Level Data
 *
 * Grid cells: each cell has a `dir` (direction the arrow points)
 *   'U' = up, 'D' = down, 'L' = left, 'R' = right, 'X' = blocked/no arrow
 *
 * `locked`: cell arrow cannot be rotated by player
 * `start`: Tono's starting position [row, col]
 * `end`:   destination position [row, col]
 * `flood`: flood mechanic config (null if no flood)
 * `solution`: one valid solution path as array of [row,col]
 */

const LEVELS = [

  // ─── GRUP 1: Hari Biasa (Basic) — Grid 3×4, semua bisa dirotasi ───

  {
    id: '1-1',
    group: 1,
    groupName: 'Hari Biasa',
    mechanic: 'basic',
    emoji: '🛢️',
    mission: 'Beli minyak goreng ke warung',
    gridSize: { rows: 3, cols: 4 },
    start: [0, 0],
    end:   [2, 3],
    flood: null,
    // Player needs to rotate arrows to create a valid path
    // Initial state — scrambled arrows, one valid solution exists
    cells: [
      { dir: 'D', locked: false }, { dir: 'L', locked: false }, { dir: 'D', locked: false }, { dir: 'L', locked: false },
      { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: false }, { dir: 'U', locked: false },
      { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false },
    ],
    // Solution: R→R→D→D→R→R (row 0: right, right; row 1: down at col1; etc)
    solution: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3]],
  },

  {
    id: '1-2',
    group: 1,
    groupName: 'Hari Biasa',
    mechanic: 'basic',
    emoji: '👕',
    mission: 'Ambil jemuran sebelum hujan',
    gridSize: { rows: 3, cols: 4 },
    start: [0, 3],
    end:   [2, 0],
    flood: null,
    cells: [
      { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'L', locked: false }, { dir: 'D', locked: false },
      { dir: 'D', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'L', locked: false },
      { dir: 'R', locked: false }, { dir: 'L', locked: false }, { dir: 'U', locked: false }, { dir: 'U', locked: false },
    ],
    solution: [[0,3],[1,3],[1,2],[1,1],[1,0],[2,0]],
  },

  {
    id: '1-3',
    group: 1,
    groupName: 'Hari Biasa',
    mechanic: 'basic',
    emoji: '🛵',
    mission: 'Ambil GoFood di depan gang',
    gridSize: { rows: 3, cols: 4 },
    start: [0, 0],
    end:   [2, 3],
    flood: null,
    // S-shape path — trickier
    cells: [
      { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: false }, { dir: 'L', locked: false },
      { dir: 'U', locked: false }, { dir: 'L', locked: false }, { dir: 'D', locked: false }, { dir: 'U', locked: false },
      { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3]],
  },

  // ─── GRUP 2: Musim Hujan (Flood) — Grid 4×4, banjir naik ───

  {
    id: '2-1',
    group: 2,
    groupName: 'Musim Hujan',
    mechanic: 'flood',
    emoji: '🌧️',
    mission: 'Hujan mulai, cepat pulang',
    gridSize: { rows: 4, cols: 4 },
    start: [0, 0],
    end:   [0, 3],
    flood: {
      startRow: 3,  // flood starts at bottom row
      direction: 'up',
      interval: 3,  // flood rises every N moves
    },
    cells: [
      { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: false },
      { dir: 'D', locked: false }, { dir: 'U', locked: false }, { dir: 'U', locked: false }, { dir: 'U', locked: false },
      { dir: 'R', locked: false }, { dir: 'L', locked: false }, { dir: 'D', locked: false }, { dir: 'U', locked: false },
      { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'L', locked: false },
    ],
    solution: [[0,0],[0,1],[0,2],[0,3]],
  },

  {
    id: '2-2',
    group: 2,
    groupName: 'Musim Hujan',
    mechanic: 'flood',
    emoji: '🌊',
    mission: 'Jalan utama sudah tergenang',
    gridSize: { rows: 4, cols: 4 },
    start: [0, 0],
    end:   [3, 3],
    flood: {
      startRow: 3,
      direction: 'up',
      interval: 2, // faster
    },
    cells: [
      { dir: 'D', locked: false }, { dir: 'R', locked: false }, { dir: 'L', locked: false }, { dir: 'D', locked: false },
      { dir: 'D', locked: false }, { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: false },
      { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'U', locked: false }, { dir: 'D', locked: false },
      { dir: 'U', locked: false }, { dir: 'L', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[1,0],[2,0],[2,1],[2,2],[2,3],[3,3]],
  },

  {
    id: '2-3',
    group: 2,
    groupName: 'Musim Hujan',
    mechanic: 'flood',
    emoji: '🏊',
    mission: 'Jalan buntu — mana yang masih bisa?',
    gridSize: { rows: 4, cols: 4 },
    start: [0, 0],
    end:   [1, 3],
    flood: {
      startRow: 3,
      direction: 'up',
      interval: 2,
    },
    cells: [
      { dir: 'R', locked: false }, { dir: 'D', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: false },
      { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'U', locked: false },
      { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'L', locked: false }, { dir: 'U', locked: false },
      { dir: 'U', locked: false }, { dir: 'L', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[0,1],[0,2],[0,3],[1,3]],
  },

  // ─── GRUP 3: Gang Ditutup (One-way) — Grid 4×4, beberapa panah dikunci ───

  {
    id: '3-1',
    group: 3,
    groupName: 'Gang Ditutup',
    mechanic: 'oneway',
    emoji: '🚧',
    mission: 'Warga tutup satu gang',
    gridSize: { rows: 4, cols: 4 },
    start: [0, 0],
    end:   [3, 3],
    flood: null,
    cells: [
      { dir: 'R', locked: false }, { dir: 'D', locked: true  }, { dir: 'R', locked: false }, { dir: 'D', locked: false },
      { dir: 'D', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: true  }, { dir: 'D', locked: false },
      { dir: 'R', locked: true  }, { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: false },
      { dir: 'U', locked: false }, { dir: 'R', locked: true  }, { dir: 'U', locked: false }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[1,0],[2,0],[2,1],[2,2],[2,3],[3,3]],
  },

  {
    id: '3-2',
    group: 3,
    groupName: 'Gang Ditutup',
    mechanic: 'oneway',
    emoji: '🚫',
    mission: 'Dua gang sekaligus ditutup',
    gridSize: { rows: 4, cols: 4 },
    start: [0, 0],
    end:   [3, 3],
    flood: null,
    cells: [
      { dir: 'D', locked: true  }, { dir: 'R', locked: false }, { dir: 'D', locked: false }, { dir: 'L', locked: true  },
      { dir: 'D', locked: false }, { dir: 'U', locked: true  }, { dir: 'D', locked: false }, { dir: 'U', locked: false },
      { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: true  }, { dir: 'D', locked: false },
      { dir: 'U', locked: true  }, { dir: 'U', locked: false }, { dir: 'R', locked: true  }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[3,3]],
  },

  {
    id: '3-3',
    group: 3,
    groupName: 'Gang Ditutup',
    mechanic: 'oneway',
    emoji: '😰',
    mission: 'Hampir semua jalan diblokir',
    gridSize: { rows: 4, cols: 4 },
    start: [0, 0],
    end:   [3, 3],
    flood: null,
    cells: [
      { dir: 'R', locked: true  }, { dir: 'D', locked: false }, { dir: 'L', locked: true  }, { dir: 'D', locked: false },
      { dir: 'U', locked: true  }, { dir: 'R', locked: false }, { dir: 'D', locked: true  }, { dir: 'D', locked: false },
      { dir: 'D', locked: false }, { dir: 'U', locked: true  }, { dir: 'R', locked: false }, { dir: 'D', locked: true  },
      { dir: 'R', locked: false }, { dir: 'R', locked: true  }, { dir: 'U', locked: false }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[0,1],[1,1],[1,2],[1,3],[2,3],[3,3]],
  },

  // ─── GRUP 4: Saat Semua Salah (Dead End) — Grid 5×5, semua mekanik ───

  {
    id: '4-1',
    group: 4,
    groupName: 'Saat Semua Salah',
    mechanic: 'deadend',
    emoji: '🔀',
    mission: 'GPS error, semua arah salah',
    gridSize: { rows: 5, cols: 5 },
    start: [0, 0],
    end:   [4, 4],
    flood: null,
    cells: [
      { dir: 'R', locked: false }, { dir: 'D', locked: true  }, { dir: 'R', locked: false }, { dir: 'D', locked: false }, { dir: 'L', locked: false },
      { dir: 'D', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: true  }, { dir: 'R', locked: false }, { dir: 'D', locked: false },
      { dir: 'R', locked: true  }, { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: true  }, { dir: 'D', locked: false },
      { dir: 'D', locked: false }, { dir: 'L', locked: true  }, { dir: 'D', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: false },
      { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'R', locked: true  }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]],
  },

  {
    id: '4-2',
    group: 4,
    groupName: 'Saat Semua Salah',
    mechanic: 'deadend',
    emoji: '🌀',
    mission: 'Macet total, semua jalan memutar',
    gridSize: { rows: 5, cols: 5 },
    start: [0, 0],
    end:   [4, 4],
    flood: {
      startRow: 4,
      direction: 'up',
      interval: 3,
    },
    cells: [
      { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'D', locked: true  }, { dir: 'L', locked: false }, { dir: 'D', locked: false },
      { dir: 'U', locked: true  }, { dir: 'D', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'D', locked: false },
      { dir: 'D', locked: false }, { dir: 'D', locked: true  }, { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: true  },
      { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: true  }, { dir: 'D', locked: false }, { dir: 'R', locked: false },
      { dir: 'U', locked: true  }, { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false },
    ],
    solution: [[0,0],[0,1],[0,2],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4]],
  },

  {
    id: '4-3',
    group: 4,
    groupName: 'Saat Semua Salah',
    mechanic: 'deadend',
    emoji: '🏁',
    mission: 'Final — Tono vs Jakarta',
    gridSize: { rows: 5, cols: 5 },
    start: [2, 0],
    end:   [2, 4],
    flood: {
      startRow: 4,
      direction: 'up',
      interval: 2, // fast flood
    },
    cells: [
      { dir: 'D', locked: true  }, { dir: 'R', locked: false }, { dir: 'L', locked: true  }, { dir: 'D', locked: false }, { dir: 'L', locked: true  },
      { dir: 'D', locked: false }, { dir: 'U', locked: true  }, { dir: 'R', locked: false }, { dir: 'D', locked: true  }, { dir: 'U', locked: false },
      { dir: 'R', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false }, { dir: 'R', locked: false }, { dir: 'U', locked: false },
      { dir: 'U', locked: true  }, { dir: 'D', locked: false }, { dir: 'L', locked: true  }, { dir: 'U', locked: false }, { dir: 'D', locked: true  },
      { dir: 'R', locked: false }, { dir: 'U', locked: true  }, { dir: 'R', locked: false }, { dir: 'U', locked: true  }, { dir: 'R', locked: false },
    ],
    solution: [[2,0],[2,1],[2,2],[2,3],[2,4]],
  },

];

// Helper: get level by id string e.g. '1-1'
function getLevelById(id) {
  return LEVELS.find(l => l.id === id) || null;
}

// All level ids in order
const LEVEL_IDS = LEVELS.map(l => l.id);
