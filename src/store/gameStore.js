import { create } from 'zustand';
import { apiBFS, apiDijkstra, apiTSP, apiStartGame, apiCompleteLevel, apiSaveResult } from '../api/api';
import { sound } from '../utils/audio';

// Tactical facility levels
const FALLBACK_LEVELS = {
  1: {
    level: 1,
    name: 'Omega Sector Labyrinth',
    algorithm: 'BFS',
    time_limit: 100,
    player_start: [1, 1],
    exit: [10, 14],
    bombs: [
      { id: 'bomb_1', label: 'WARHEAD 01', row: 3, col: 14, defused: false }
    ],
    patrols: [
      { id: 'sentry_1', axis: 'horizontal', row: 5, minCol: 5, maxCol: 7, col: 5, direction: 1 }
    ],
    // 12 rows x 16 columns
    grid: [
      ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
      ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
      ["W", 1, "W", 1, "W", 1, "W", 1, "W", 1, "W","W","W", 1, "W","W"],
      ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W"],
      ["W","W","W","W","W", 1, "W","W","W", 1, "W", 1, "W","W", 1, "W"],
      ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1, "W", 1, "W", 1,  1, "W"],
      ["W", 1, "W", 1, "W","W","W", 1, "W", 1, "W", 1, "W", 1, "W","W"],
      ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W"],
      ["W", 1, "W","W","W", 1, "W","W","W","W","W", 1, "W","W", 1, "W"],
      ["W", 1,  1,  1, "W", 1,  1,  1,  1,  1, "W", 1, "W", 1,  1, "W"],
      ["W","W","W", 1,  1,  1, "W","W","W", 1,  1,  1, "W", 1,  1, "W"],
      ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
    ]
  },
  2: {
    level: 2,
    name: 'Thermal Reactor Meltdown',
    algorithm: 'DIJKSTRA',
    time_limit: 110,
    player_start: [1, 1],
    exit: [12, 1],
    bombs: [
      { id: 'bomb_1', label: 'REACTOR CORE', row: 9, col: 16, defused: false }
    ],
    patrols: [
      { id: 'sentry_1', axis: 'horizontal', row: 6, minCol: 3, maxCol: 7, col: 3, direction: 1 },
      { id: 'sentry_2', axis: 'vertical', col: 11, minRow: 3, maxRow: 6, row: 3, direction: 1 }
    ],
    // 14 rows x 18 columns
    grid: [
      ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
      ["W", 1,  1,  1, "W", 1,  1,  1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
      ["W", 1, "W", 1, "W", 1, "W","W","W", 1, "W", 1, "W","W","W","W", 1, "W"],
      ["W", 1, "W", 1,  1,  1, "W", 8,  8,  1, "W", 1, "W", 3,  3,  1,  1, "W"],
      ["W", 3,  3,  3, "W", 1, "W", 8,  8,  1, "W", 1, "W", 3,  5,  5,  1, "W"],
      ["W", 5, "W", 3, "W", 1, "W","W","W", 1,  1,  1, "W", 1, "W", 8,  1, "W"],
      ["W", 5, "W", 1,  1,  1,  1,  1, "W", 1, "W", 1, "W", 1, "W", 8,  1, "W"],
      ["W", 8, "W","W","W","W","W", 1, "W", 1, "W", 1,  1,  1, "W", 5,  1, "W"],
      ["W", 8,  8,  8,  8,  5, "W", 1, "W", 1, "W","W","W", 1, "W", 3,  1, "W"],
      ["W", 1, "W","W","W", 3, "W", 1,  1,  1,  1,  1, "W", 1,  1,  1,  1, "W"],
      ["W", 1,  1,  1, "W", 1, "W","W","W","W","W", 1, "W","W","W","W", 1, "W"],
      ["W","W","W", 1, "W", 1,  1,  1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
      ["W", 1,  1,  1,  1,  1, "W","W","W", 1,  1,  1, "W", 1,  1, "W", 1, "W"],
      ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
    ]
  },
  3: {
    level: 3,
    name: 'Blackout Vault — 4 Warheads',
    algorithm: 'TSP',
    time_limit: 140,
    player_start: [1, 1],
    exit: [14, 18],
    bombs: [
      { id: 'bomb_A', label: 'ALPHA', row: 1, col: 18, defused: false },
      { id: 'bomb_B', label: 'BRAVO', row: 14, col: 1, defused: false },
      { id: 'bomb_C', label: 'CHARLIE', row: 7, col: 9, defused: false },
      { id: 'bomb_D', label: 'DELTA', row: 13, col: 18, defused: false }
    ],
    patrols: [
      { id: 'sentry_1', axis: 'horizontal', row: 3, minCol: 7, maxCol: 10, col: 7, direction: 1 },
      { id: 'sentry_2', axis: 'horizontal', row: 9, minCol: 5, maxCol: 8, col: 5, direction: 1 },
      { id: 'sentry_3', axis: 'vertical', col: 13, minRow: 1, maxRow: 4, row: 1, direction: 1 }
    ],
    // 16 rows x 20 columns
    grid: [
      ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
      ["W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1, "W"],
      ["W", 1, "W", 1, "W", 1, "W","W", 1, "W", 1, "W","W", 1, "W", 1, "W","W", 1, "W"],
      ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1, "W"],
      ["W","W","W","W","W", 1, "W", 1, "W","W","W","W", 1, "W","W","W","W", 1, "W","W"],
      ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1,  1, "W"],
      ["W", 1, "W", 1, "W","W","W", 1, "W", 1, "W","W", 1, "W", 1, "W","W","W", 1, "W"],
      ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1, "W"],
      ["W", 1, "W","W","W", 1, "W","W","W", 1, "W", 1, "W","W","W","W", 1, "W", 1, "W"],
      ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1, "W"],
      ["W","W","W", 1, "W","W","W", 1, "W","W","W", 1, "W", 1, "W","W", 1, "W", 1, "W"],
      ["W", 1,  1,  1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W"],
      ["W", 1, "W","W","W", 1, "W","W","W", 1, "W","W","W", 1, "W", 1, "W","W","W","W"],
      ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
      ["W", 1,  1,  1, "W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1, "W", 1, "W"],
      ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
    ]
  }
};

let timerInterval = null;
let patrolInterval = null;
let fuseInterval = null;

const WIRE_COLORS = ['RED', 'BLUE', 'YELLOW', 'GREEN'];

export const useGameStore = create((set, get) => ({
  // User Profile
  user: {
    id: 'agent_01',
    username: 'Agent Hazard',
    isGuest: true,
  },
  setUser: (user) => set({ user }),

  // Difficulty Mode
  difficulty: 'tactical', // 'tactical' (Standard) | 'hardcore' (Nightmare Fog-of-War & 2 lives)
  setDifficulty: (diff) => set({ difficulty: diff }),

  // Core Game State
  gameStatus: 'menu', // 'menu' | 'playing' | 'defusing' | 'level_complete' | 'game_over' | 'victory'
  currentLevel: 1,
  levelName: 'Omega Sector Labyrinth',
  currentAlgorithm: 'BFS',
  grid: FALLBACK_LEVELS[1].grid,
  playerPos: [1, 1],
  playerStart: [1, 1],
  exitPos: [10, 14],
  bombs: FALLBACK_LEVELS[1].bombs,
  patrols: FALLBACK_LEVELS[1].patrols || [],
  bombsDefused: 0,
  lives: 3,
  maxLives: 3,
  score: 0,
  timer: 100,
  maxTime: 100,

  // Player route & costs
  playerRoute: [[1, 1]],
  playerRouteCost: 0,
  playerBombOrder: [],

  // Tactical Defusal minigame state
  activeBomb: null,
  defuseProgress: 0,
  disarmSequence: ['BLUE', 'RED', 'GREEN'],
  cutWires: [],
  fuseTimer: 8.0,

  // Algorithm Visualizer
  isVisualizing: false,
  visualizationStep: 0,
  visitedCells: [],
  currentPath: [],
  algorithmStats: null,
  tspCandidates: [],

  // Level Results
  levelResult: null,

  // ── Actions ──────────────────────────────────────────────────────────────
  startGame: async (levelNum = 1) => {
    get().stopAllTimers();

    const { difficulty } = get();
    const backendData = await apiStartGame(levelNum);
    const data = backendData || FALLBACK_LEVELS[levelNum] || FALLBACK_LEVELS[1];

    const initialBombs = (data.bombs || []).map(b => ({ ...b, defused: false }));
    const baseTime = data.time_limit_seconds || data.time_limit || 100;
    const finalTime = difficulty === 'hardcore' ? Math.round(baseTime * 0.75) : baseTime;
    const finalLives = difficulty === 'hardcore' ? 2 : 3;

    set({
      gameStatus: 'playing',
      currentLevel: levelNum,
      levelName: data.level_name || data.name || `Level ${levelNum}`,
      currentAlgorithm: data.algorithm,
      grid: data.grid,
      playerPos: [data.player_start[0], data.player_start[1]],
      playerStart: [data.player_start[0], data.player_start[1]],
      exitPos: [data.exit[0], data.exit[1]],
      bombs: initialBombs,
      patrols: (FALLBACK_LEVELS[levelNum]?.patrols || []).map(p => ({ ...p })),
      bombsDefused: 0,
      lives: finalLives,
      maxLives: finalLives,
      timer: finalTime,
      maxTime: finalTime,
      playerRoute: [[data.player_start[0], data.player_start[1]]],
      playerRouteCost: 0,
      playerBombOrder: [],
      activeBomb: null,
      defuseProgress: 0,
      disarmSequence: [],
      cutWires: [],
      fuseTimer: 8.0,
      isVisualizing: false,
      visualizationStep: 0,
      visitedCells: [],
      currentPath: [],
      algorithmStats: null,
      tspCandidates: [],
      levelResult: null,
    });

    sound.playClick();
    get().startTimer();
    get().startPatrols();
  },

  startTimer: () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const { timer, gameStatus } = get();
      if (gameStatus !== 'playing' && gameStatus !== 'defusing') return;

      if (timer <= 1) {
        get().stopAllTimers();
        sound.playGameOver();
        set({ timer: 0, gameStatus: 'game_over' });
        return;
      }

      set({ timer: timer - 1 });
    }, 1000);
  },

  startPatrols: () => {
    if (patrolInterval) clearInterval(patrolInterval);
    patrolInterval = setInterval(() => {
      const { patrols, playerPos, lives, gameStatus } = get();
      if (gameStatus !== 'playing') return;
      if (!patrols || patrols.length === 0) return;

      let playerHit = false;
      const updatedPatrols = patrols.map(p => {
        let { axis, row, col, minRow, maxRow, minCol, maxCol, direction } = p;

        if (axis === 'horizontal') {
          let nextCol = col + direction;
          if (nextCol >= maxCol) {
            nextCol = maxCol;
            direction = -1;
          } else if (nextCol <= minCol) {
            nextCol = minCol;
            direction = 1;
          }
          if (row === playerPos[0] && nextCol === playerPos[1]) {
            playerHit = true;
          }
          return { ...p, col: nextCol, direction };
        } else {
          let nextRow = row + direction;
          if (nextRow >= maxRow) {
            nextRow = maxRow;
            direction = -1;
          } else if (nextRow <= minRow) {
            nextRow = minRow;
            direction = 1;
          }
          if (nextRow === playerPos[0] && col === playerPos[1]) {
            playerHit = true;
          }
          return { ...p, row: nextRow, direction };
        }
      });

      if (playerHit) {
        sound.playHazard();
        const nextLives = Math.max(0, lives - 1);
        if (nextLives === 0) {
          get().stopAllTimers();
          sound.playGameOver();
          set({ patrols: updatedPatrols, lives: 0, gameStatus: 'game_over' });
          return;
        }
        set({ patrols: updatedPatrols, lives: nextLives });
      } else {
        set({ patrols: updatedPatrols });
      }
    }, 900);
  },

  stopAllTimers: () => {
    if (timerInterval) clearInterval(timerInterval);
    if (patrolInterval) clearInterval(patrolInterval);
    if (fuseInterval) clearInterval(fuseInterval);
  },

  movePlayer: (dr, dc) => {
    const { playerPos, grid, gameStatus, lives, bombs, exitPos, bombsDefused, playerRoute, playerRouteCost, patrols } = get();
    if (gameStatus !== 'playing') return;

    const [r, c] = playerPos;
    const nr = r + dr;
    const nc = c + dc;
    const rows = grid.length;
    const cols = grid[0].length;

    // Check bounds
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;

    const cellVal = grid[nr][nc];
    // Check walls
    if (typeof cellVal === 'string' && ['W', 'WALL', '#', 'BLOCKED'].includes(cellVal.toUpperCase())) {
      return;
    }

    // Step cost
    let stepCost = 1;
    let isHazard = false;
    if (typeof cellVal === 'number') {
      stepCost = cellVal;
      if (cellVal >= 3) isHazard = true;
    } else if (typeof cellVal === 'string') {
      if (cellVal.toUpperCase() === 'DANGEROUS') { stepCost = 3; isHazard = true; }
      if (cellVal.toUpperCase() === 'HIGH_RISK') { stepCost = 5; isHazard = true; }
      if (cellVal.toUpperCase() === 'CRITICAL') { stepCost = 8; isHazard = true; }
    }

    // Sentry collision check
    const hitSentry = patrols && patrols.some(p => p.row === nr && p.col === nc);
    if (hitSentry) isHazard = true;

    // Handle Hazard damage
    let nextLives = lives;
    if (isHazard) {
      nextLives = Math.max(0, lives - 1);
      sound.playHazard();
      if (nextLives === 0) {
        get().stopAllTimers();
        sound.playGameOver();
        set({ playerPos: [nr, nc], lives: 0, gameStatus: 'game_over' });
        return;
      }
    } else {
      sound.playStep();
    }

    const newRoute = [...playerRoute, [nr, nc]];
    const newCost = playerRouteCost + stepCost;

    set({
      playerPos: [nr, nc],
      lives: nextLives,
      playerRoute: newRoute,
      playerRouteCost: newCost,
    });

    // Check if stepped on an active Bomb
    const bombAtPos = bombs.find(b => !b.defused && b.row === nr && b.col === nc);
    if (bombAtPos) {
      get().promptDefuse(bombAtPos);
      return;
    }

    // Check if reached Exit with all bombs defused
    if (nr === exitPos[0] && nc === exitPos[1]) {
      if (bombsDefused === bombs.length) {
        get().finishLevel();
      }
    }
  },

  promptDefuse: (bomb) => {
    // Generate a 3-wire disarm code randomly
    const shuffled = [...WIRE_COLORS].sort(() => 0.5 - Math.random());
    const seq = shuffled.slice(0, 3);

    set({
      gameStatus: 'defusing',
      activeBomb: bomb,
      defuseProgress: 0,
      disarmSequence: seq,
      cutWires: [],
      fuseTimer: 8.0,
    });

    sound.playDefuseTick();

    // Start 8-second fuse countdown
    if (fuseInterval) clearInterval(fuseInterval);
    fuseInterval = setInterval(() => {
      const { fuseTimer, gameStatus } = get();
      if (gameStatus !== 'defusing') {
        clearInterval(fuseInterval);
        return;
      }

      if (fuseTimer <= 0.1) {
        clearInterval(fuseInterval);
        get().stopAllTimers();
        sound.playGameOver();
        set({ gameStatus: 'game_over', fuseTimer: 0 });
        return;
      }

      set({ fuseTimer: Math.max(0, Math.round((fuseTimer - 0.1) * 10) / 10) });
    }, 100);
  },

  // Tactical wire cutting interaction
  cutWire: (color) => {
    const { disarmSequence, cutWires, fuseTimer, lives } = get();
    const nextExpected = disarmSequence[cutWires.length];

    if (color === nextExpected) {
      sound.playWireCut();
      const newCut = [...cutWires, color];
      const prog = Math.round((newCut.length / disarmSequence.length) * 100);
      set({ cutWires: newCut, defuseProgress: prog });

      if (newCut.length === disarmSequence.length) {
        get().completeDefusal();
      }
    } else {
      // Wrong wire penalty: lose 1 life and 2 seconds off fuse
      sound.playAlarm();
      const nextLives = Math.max(0, lives - 1);
      const nextFuse = Math.max(0.1, fuseTimer - 2.0);

      if (nextLives === 0) {
        get().stopAllTimers();
        sound.playGameOver();
        set({ lives: 0, gameStatus: 'game_over' });
        return;
      }

      set({
        lives: nextLives,
        fuseTimer: nextFuse,
      });
    }
  },

  // Fallback / Rapid bypass disarm
  advanceDefusal: (amount = 34) => {
    const { defuseProgress, activeBomb } = get();
    if (!activeBomb) return;

    sound.playDefuseTick();
    const nextProgress = Math.min(100, defuseProgress + amount);
    if (nextProgress >= 100) {
      get().completeDefusal();
    } else {
      set({ defuseProgress: nextProgress });
    }
  },

  completeDefusal: () => {
    if (fuseInterval) clearInterval(fuseInterval);

    const { activeBomb, bombs, bombsDefused, score, playerBombOrder } = get();
    if (!activeBomb) return;

    sound.playDefuseSuccess();

    const updatedBombs = bombs.map(b =>
      b.id === activeBomb.id ? { ...b, defused: true } : b
    );

    const newDefusedCount = bombsDefused + 1;
    const newOrder = [...playerBombOrder, activeBomb.label || activeBomb.id];

    set({
      gameStatus: 'playing',
      bombs: updatedBombs,
      bombsDefused: newDefusedCount,
      score: score + 500,
      activeBomb: null,
      defuseProgress: 0,
      cutWires: [],
      playerBombOrder: newOrder,
    });
  },

  cancelDefusal: () => {
    if (fuseInterval) clearInterval(fuseInterval);
    set({
      gameStatus: 'playing',
      activeBomb: null,
      defuseProgress: 0,
      cutWires: [],
    });
  },

  finishLevel: async () => {
    get().stopAllTimers();
    sound.playLevelComplete();

    const { currentLevel, timer, lives, bombsDefused, bombs, currentAlgorithm, playerRouteCost, playerBombOrder, user } = get();

    const payload = {
      level: currentLevel,
      time_remaining: timer,
      lives_remaining: lives,
      bombs_defused: bombsDefused,
      total_bombs: bombs.length,
      algorithm_used: currentAlgorithm,
      route_cost: playerRouteCost,
      player_bomb_order: playerBombOrder,
      user_id: user?.id,
      username: user?.username,
    };

    const result = await apiCompleteLevel(payload);

    const defaultScore = bombsDefused * 500 + 300 + timer * 10 + lives * 100;
    const levelResult = result || {
      success: true,
      score_gained: defaultScore,
      score_breakdown: {
        base_bomb_reward: bombsDefused * 500 + 300,
        time_bonus: timer * 10,
        efficiency_bonus: 100,
        life_bonus: lives * 100,
        hazard_penalty: (3 - lives) * 50,
        total_score: defaultScore,
      },
      optimal_cost: playerRouteCost,
      player_cost: playerRouteCost,
      difference: 0,
      next_level: currentLevel < 3 ? currentLevel + 1 : null,
    };

    set({
      gameStatus: 'level_complete',
      score: get().score + (levelResult.score_gained || defaultScore),
      levelResult,
    });

    apiSaveResult({
      user_id: user?.id || 'agent_01',
      username: user?.username || 'Agent Hazard',
      level: currentLevel,
      algorithm: currentAlgorithm,
      score: get().score,
      path_cost: playerRouteCost,
      time_taken: get().maxTime - timer,
      nodes_explored: get().algorithmStats?.nodes_explored || 25,
    });
  },

  goToNextLevel: () => {
    const { currentLevel } = get();
    if (currentLevel < 3) {
      get().startGame(currentLevel + 1);
    } else {
      set({ gameStatus: 'victory' });
    }
  },

  restartCurrentLevel: () => {
    const { currentLevel } = get();
    get().startGame(currentLevel);
  },

  returnToMenu: () => {
    get().stopAllTimers();
    set({ gameStatus: 'menu' });
  },

  // ── Algorithm Visualization ──────────────────────────────────────────────
  findShortestPath: () => get().runAlgorithmVisualization(),
  runAlgorithmVisualization: async () => {
    const { currentAlgorithm, grid, playerPos, bombs, exitPos, isVisualizing } = get();
    if (isVisualizing) return;

    sound.playClick();
    set({ isVisualizing: true });

    try {
      let res = null;

      if (currentAlgorithm === 'BFS') {
        const activeBomb = bombs.find(b => !b.defused);
        const target = activeBomb ? [activeBomb.row, activeBomb.col] : exitPos;
        res = await apiBFS(grid, playerPos, target);
        set({
          algorithmStats: {
            name: 'Breadth-First Search (BFS)',
            type: 'Unweighted Shortest Path (Queue FIFO)',
            distance: res?.distance || 0,
            cost: res?.distance || 0,
            nodes_explored: res?.nodes_explored || (res?.visited?.length || 1),
            execution_time_ms: res?.execution_time_ms || 0.5,
          }
        });
      } else if (currentAlgorithm === 'DIJKSTRA') {
        const activeBomb = bombs.find(b => !b.defused);
        const target = activeBomb ? [activeBomb.row, activeBomb.col] : exitPos;
        res = await apiDijkstra(grid, playerPos, target);
        set({
          algorithmStats: {
            name: "Dijkstra's Algorithm",
            type: 'Minimum Cost Path (Min-Heap Priority Queue)',
            distance: Math.max(0, (res?.path?.length || 1) - 1),
            cost: res?.cost || 0,
            nodes_explored: res?.nodes_explored || (res?.visited?.length || 1),
            execution_time_ms: res?.execution_time_ms || 0.8,
          }
        });
      } else {
        // Level 3: TSP
        const activeBombs = bombs.filter(b => !b.defused);
        if (activeBombs.length > 0) {
          const points = [playerPos, ...activeBombs.map(b => [b.row, b.col]), exitPos];
          const labels = ['START', ...activeBombs.map(b => b.label || 'WARHEAD'), 'EXIT'];
          const tspRes = await apiTSP(grid, points, labels);
          const route = tspRes?.route || [];
          res = {
            path: route,
            visited: route,
            cost: tspRes?.cost || 0,
            nodes_explored: points.length * 15,
            execution_time_ms: tspRes?.execution_time_ms || 1.2,
          };
          set({
            currentAlgorithm: 'TSP',
            tspCandidates: tspRes?.candidate_routes || [],
            algorithmStats: {
              name: 'TSP (Traveling Salesperson Tour)',
              type: 'Brute-Force Permutations (Optimal Bomb Order)',
              distance: Math.max(0, route.length - 1),
              cost: tspRes?.cost || 0,
              nodes_explored: points.length * 15,
              execution_time_ms: tspRes?.execution_time_ms || 1.2,
              optimal_order: tspRes?.route_labels || labels,
            }
          });
        } else {
          res = await apiDijkstra(grid, playerPos, exitPos);
          set({
            currentAlgorithm: 'DIJKSTRA',
            algorithmStats: {
              name: "Dijkstra's Algorithm to Exit",
              type: 'Direct Route to Extraction',
              distance: Math.max(0, (res?.path?.length || 1) - 1),
              cost: res?.cost || 0,
              nodes_explored: res?.nodes_explored || 1,
              execution_time_ms: res?.execution_time_ms || 0.5,
            }
          });
        }
      }

      if (res && res.path && res.path.length > 0) {
        const visitedList = res.visited && res.visited.length > 0 ? res.visited : res.path;
        set({
          visitedCells: visitedList,
          currentPath: res.path,
          visualizationStep: 0,
          isVisualizing: true,
        });

        // Step-by-step animation
        let step = 0;
        const totalSteps = visitedList.length;
        const interval = setInterval(() => {
          const store = get();
          if (!store.isVisualizing) {
            clearInterval(interval);
            return;
          }
          step += 2;
          if (step >= totalSteps) {
            clearInterval(interval);
            set({ visualizationStep: totalSteps, isVisualizing: false });
          } else {
            set({ visualizationStep: step });
          }
        }, 35);
      } else {
        set({ isVisualizing: false });
      }
    } catch (err) {
      console.error('Visualization failed:', err);
      set({ isVisualizing: false });
    }
  },


  skipVisualization: () => {
    const { visitedCells } = get();
    set({
      visualizationStep: visitedCells.length,
      isVisualizing: false,
    });
  },

  clearPath: () => {
    set({
      currentPath: [],
      visitedCells: [],
      visualizationStep: 0,
      isVisualizing: false,
    });
  },
}));
