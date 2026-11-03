/**
 * API client for Bomb Defusal Route.
 * Connects to FastAPI backend with offline client-side fallbacks.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Client-side Algorithm Fallbacks ───────────────────────────────────────
function clientBFS(grid, start, target) {
  const t0 = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const [sr, sc] = start;
  const [tr, tc] = target;

  const isWalk = (val) => {
    if (typeof val === 'string') return !['W', 'WALL', '#', 'BLOCKED'].includes(val.toUpperCase());
    return val >= 0;
  };

  const queue = [[sr, sc]];
  const visitedSet = new Set([`${sr},${sc}`]);
  const visitedOrder = [[sr, sc]];
  const parent = {};

  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let found = false;

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (r === tr && c === tc) {
      found = true;
      break;
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visitedSet.has(key) && isWalk(grid[nr][nc])) {
        visitedSet.add(key);
        visitedOrder.push([nr, nc]);
        parent[key] = [r, c];
        queue.push([nr, nc]);
        if (nr === tr && nc === tc) {
          found = true;
          break;
        }
      }
    }
    if (found) break;
  }

  const path = [];
  if (found) {
    let curr = [tr, tc];
    while (curr) {
      path.push(curr);
      curr = parent[`${curr[0]},${curr[1]}`];
    }
    path.reverse();
  }

  return {
    path,
    visited: visitedOrder,
    distance: Math.max(0, path.length - 1),
    nodes_explored: visitedSet.size,
    execution_time_ms: Math.round((performance.now() - t0) * 100) / 100
  };
}

function clientDijkstra(grid, start, target) {
  const t0 = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const [sr, sc] = start;
  const [tr, tc] = target;

  const getCost = (val) => {
    if (typeof val === 'string') {
      const v = val.toUpperCase();
      if (['W', 'WALL', '#', 'BLOCKED'].includes(v)) return Infinity;
      if (v === 'DANGEROUS') return 3;
      if (v === 'HIGH_RISK') return 5;
      if (v === 'CRITICAL') return 8;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 1 : parsed;
    }
    return val < 0 ? Infinity : val;
  };

  const dist = { [`${sr},${sc}`]: 0 };
  const parent = {};
  const visitedSet = new Set();
  const visitedOrder = [];

  const pq = [{ cost: 0, r: sr, c: sc }];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let found = false;

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { cost, r, c } = pq.shift();
    const key = `${r},${c}`;

    if (visitedSet.has(key)) continue;
    visitedSet.add(key);
    visitedOrder.push([r, c]);

    if (r === tr && c === tc) {
      found = true;
      break;
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const nKey = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const stepCost = getCost(grid[nr][nc]);
        if (stepCost !== Infinity) {
          const newCost = cost + stepCost;
          if (newCost < (dist[nKey] ?? Infinity)) {
            dist[nKey] = newCost;
            parent[nKey] = [r, c];
            pq.push({ cost: newCost, r: nr, c: nc });
          }
        }
      }
    }
  }

  const path = [];
  if (found) {
    let curr = [tr, tc];
    while (curr) {
      path.push(curr);
      curr = parent[`${curr[0]},${curr[1]}`];
    }
    path.reverse();
  }

  return {
    path,
    visited: visitedOrder,
    cost: dist[`${tr},${tc}`] || 0,
    nodes_explored: visitedSet.size,
    execution_time_ms: Math.round((performance.now() - t0) * 100) / 100
  };
}

function clientTSP(grid, points, labels = []) {
  const t0 = performance.now();
  const n = points.length;
  const safeLabels = labels.length === n ? labels : ['START', ...points.slice(1, -1).map((_, i) => `BOMB ${String.fromCharCode(65 + i)}`), 'EXIT'];

  // Pairwise Dijkstra
  const distMatrix = {};
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        distMatrix[`${i},${j}`] = { cost: 0, path: [points[i]] };
      } else {
        const res = clientDijkstra(grid, points[i], points[j]);
        distMatrix[`${i},${j}`] = { cost: res.path.length ? res.cost : Infinity, path: res.path };
      }
    }
  }

  const bombIndices = Array.from({ length: n - 2 }, (_, i) => i + 1);

  // Permutations
  function permute(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      for (const p of permute(rest)) {
        result.push([arr[i], ...p]);
      }
    }
    return result;
  }

  const perms = permute(bombIndices);
  let bestCost = Infinity;
  let bestPath = [];
  let bestOrder = [];
  const candidateRoutes = [];

  for (const p of perms) {
    const fullOrder = [0, ...p, n - 1];
    let totalCost = 0;
    let fullCoords = [];
    let possible = true;

    for (let i = 0; i < fullOrder.length - 1; i++) {
      const u = fullOrder[i];
      const v = fullOrder[i + 1];
      const seg = distMatrix[`${u},${v}`];
      if (seg.cost === Infinity) {
        possible = false;
        break;
      }
      totalCost += seg.cost;
      if (i === 0) fullCoords.push(...seg.path);
      else fullCoords.push(...seg.path.slice(1));
    }

    if (possible) {
      const orderLabels = fullOrder.map(idx => safeLabels[idx]);
      candidateRoutes.push({ order: orderLabels, path_coords: fullCoords, total_cost: totalCost });
      if (totalCost < bestCost) {
        bestCost = totalCost;
        bestPath = fullCoords;
        bestOrder = orderLabels;
      }
    }
  }

  candidateRoutes.sort((a, b) => a.total_cost - b.total_cost);

  return {
    route: bestPath,
    route_labels: bestOrder.length ? bestOrder : safeLabels,
    cost: bestCost === Infinity ? 0 : bestCost,
    candidate_routes: candidateRoutes,
    execution_time_ms: Math.round((performance.now() - t0) * 100) / 100
  };
}

// ── Exported API Functions ────────────────────────────────────────────────
export async function apiBFS(grid, start, target) {
  try {
    const res = await fetch(`${API_BASE}/api/bfs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid, start, target }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return clientBFS(grid, start, target);
}

export async function apiDijkstra(grid, start, target) {
  try {
    const res = await fetch(`${API_BASE}/api/dijkstra`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid, start, target }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return clientDijkstra(grid, start, target);
}

export async function apiTSP(grid, points, labels) {
  try {
    const res = await fetch(`${API_BASE}/api/tsp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid, points, labels }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return clientTSP(grid, points, labels);
}

export async function apiStartGame(level = 1) {
  try {
    const res = await fetch(`${API_BASE}/api/game/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function apiCompleteLevel(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/game/complete-level`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function apiSaveResult(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/game/save-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch {}
  return { status: 'offline_saved' };
}

export async function apiGetLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    if (res.ok) return await res.json();
  } catch {}
  return [
    { id: '1', username: 'GhostAgent', level: 3, algorithm: 'TSP', score: 3480, path_cost: 31, time_taken: 84, created_at: '2026-09-20' },
    { id: '2', username: 'CyberDisposal', level: 3, algorithm: 'TSP', score: 3120, path_cost: 35, time_taken: 98, created_at: '2026-09-20' },
    { id: '3', username: 'AlgoMaster', level: 2, algorithm: 'DIJKSTRA', score: 2150, path_cost: 17, time_taken: 42, created_at: '2026-09-20' },
    { id: '4', username: 'TacticalDev', level: 1, algorithm: 'BFS', score: 1420, path_cost: 14, time_taken: 35, created_at: '2026-09-20' },
  ];
}
