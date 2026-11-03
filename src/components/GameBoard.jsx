import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Player from './Player';
import Bomb from './Bomb';
import Exit from './Exit';
import Sentry from './Sentry';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Wrench, Hand } from 'lucide-react';

export default function GameBoard() {
  const grid = useGameStore(s => s.grid);
  const playerPos = useGameStore(s => s.playerPos);
  const exitPos = useGameStore(s => s.exitPos);
  const bombs = useGameStore(s => s.bombs);
  const patrols = useGameStore(s => s.patrols);
  const bombsDefused = useGameStore(s => s.bombsDefused);
  const movePlayer = useGameStore(s => s.movePlayer);
  const visitedCells = useGameStore(s => s.visitedCells);
  const visualizationStep = useGameStore(s => s.visualizationStep);
  const currentPath = useGameStore(s => s.currentPath);
  const difficulty = useGameStore(s => s.difficulty);
  const promptDefuse = useGameStore(s => s.promptDefuse);

  const boardRef = useRef(null);
  const touchStartRef = useRef(null);

  // Dynamic viewport width tracker for mobile reactivity
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 800
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          movePlayer(-1, 0);
          break;
        case 'KeyS':
        case 'ArrowDown':
          movePlayer(1, 0);
          break;
        case 'KeyA':
        case 'ArrowLeft':
          movePlayer(0, -1);
          break;
        case 'KeyD':
        case 'ArrowRight':
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  // Touch Swipe Gesture Handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || !e.changedTouches || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 24) {
      if (absX > absY) {
        if (dx > 0) movePlayer(0, 1); // Right
        else movePlayer(0, -1); // Left
      } else {
        if (dy > 0) movePlayer(1, 0); // Down
        else movePlayer(-1, 0); // Up
      }
    }
    touchStartRef.current = null;
  };

  if (!grid || !grid.length) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  // Responsive dynamic cell size:
  // Desktop: max 42px, Mobile: dynamically scales down to fit viewport nicely
  const availableWidth = Math.min(windowWidth - 28, 640);
  const idealCell = Math.floor(availableWidth / cols);
  const cellSize = Math.min(42, Math.max(17, idealCell));

  const isExitUnlocked = bombsDefused === bombs.length;

  // Check if player is standing on or adjacent to an active bomb for quick mobile button
  const adjacentBomb = bombs.find(b => !b.defused && (
    (b.row === playerPos[0] && b.col === playerPos[1]) ||
    (Math.abs(b.row - playerPos[0]) + Math.abs(b.col - playerPos[1]) === 1)
  ));

  // Build lookup sets for fast rendering
  const visitedSet = new Set(
    visitedCells.slice(0, visualizationStep).map(([r, c]) => `${r},${c}`)
  );

  const pathSet = new Set(
    currentPath.map(([r, c]) => `${r},${c}`)
  );

  const getCellDetails = (cell, r, c) => {
    const key = `${r},${c}`;
    const isPath = pathSet.has(key);
    const isVisited = visitedSet.has(key);

    let isDarkened = false;
    if (difficulty === 'hardcore') {
      const dist = Math.abs(r - playerPos[0]) + Math.abs(c - playerPos[1]);
      if (dist > 3) isDarkened = true;
    }

    if (typeof cell === 'string' && ['W', 'WALL', '#', 'BLOCKED'].includes(cell.toUpperCase())) {
      return {
        type: 'wall',
        bg: isDarkened ? 'bg-black border-slate-950 opacity-40' : 'bg-tactical-950 border-tactical-800 shadow-inner',
        label: null,
      };
    }

    if (isPath) {
      return {
        type: 'path',
        bg: 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse',
        label: null,
      };
    }

    if (isVisited) {
      return {
        type: 'visited',
        bg: 'bg-blue-600/30 border-blue-400/60 shadow-[0_0_6px_rgba(59,130,246,0.3)]',
        label: null,
      };
    }

    // Weighted hazard cells
    let cost = 1;
    if (typeof cell === 'number') cost = cell;
    if (typeof cell === 'string') {
      if (cell.toUpperCase() === 'DANGEROUS') cost = 3;
      if (cell.toUpperCase() === 'HIGH_RISK') cost = 5;
      if (cell.toUpperCase() === 'CRITICAL') cost = 8;
    }

    const showNumber = cellSize >= 24 && !isDarkened;

    if (cost === 3) {
      return {
        type: 'dangerous',
        bg: isDarkened ? 'bg-black/80 border-amber-900/30' : 'bg-amber-950/40 border-amber-600/60',
        label: showNumber ? '⚠️ 3' : (cellSize >= 20 ? '3' : null),
        textColor: 'text-amber-400',
      };
    }
    if (cost === 5) {
      return {
        type: 'high_risk',
        bg: isDarkened ? 'bg-black/80 border-orange-900/30' : 'bg-orange-950/50 border-orange-600/70',
        label: showNumber ? '🔥 5' : (cellSize >= 20 ? '5' : null),
        textColor: 'text-orange-400',
      };
    }
    if (cost >= 8) {
      return {
        type: 'critical',
        bg: isDarkened ? 'bg-black/80 border-rose-900/30' : 'bg-rose-950/60 border-rose-600/80',
        label: showNumber ? '☣️ 8' : (cellSize >= 20 ? '8' : null),
        textColor: 'text-rose-400',
      };
    }

    return {
      type: 'normal',
      bg: isDarkened ? 'bg-black/90 border-slate-950' : 'bg-tactical-900/60 border-tactical-800/80 hover:border-tactical-700',
      label: null,
    };
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-full overflow-hidden">
      {/* Scrollable Container on ultra-narrow screens */}
      <div className="w-full overflow-x-auto flex justify-center px-1 pb-1">
        {/* 2D Board Canvas Container */}
        <div
          ref={boardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative bg-tactical-950 p-1.5 sm:p-2.5 rounded-xl border-2 border-tactical-700 shadow-2xl overflow-hidden select-none touch-none"
          style={{
            width: cols * cellSize + 14,
            height: rows * cellSize + 14,
          }}
        >
          {/* Subtle grid backdrop decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none"></div>

          {/* The Cells Grid */}
          <div
            className="relative grid"
            style={{
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              width: cols * cellSize,
              height: rows * cellSize,
            }}
          >
            {grid.map((rowArr, r) =>
              rowArr.map((cell, c) => {
                const details = getCellDetails(cell, r, c);
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => {
                      const [pr, pc] = playerPos;
                      if (Math.abs(pr - r) + Math.abs(pc - c) === 1) {
                        movePlayer(r - pr, c - pc);
                      }
                    }}
                    className={`border transition-colors duration-150 flex flex-col items-center justify-center font-mono text-[8px] font-bold ${details.bg}`}
                    style={{ width: cellSize, height: cellSize }}
                  >
                    {details.label && (
                      <span className={`leading-none ${details.textColor || 'text-slate-300'}`}>
                        {details.label}
                      </span>
                    )}
                  </div>
                );
              })
            )}

            {/* Player Layer */}
            <Player row={playerPos[0]} col={playerPos[1]} cellSize={cellSize} />

            {/* Patrolling Security Sentries */}
            {(patrols || []).map(sentry => (
              <Sentry key={sentry.id} sentry={sentry} cellSize={cellSize} />
            ))}

            {/* Bombs Layer */}
            {bombs.map(bomb => (
              <Bomb key={bomb.id} bomb={bomb} cellSize={cellSize} />
            ))}

            {/* Exit Hatch Layer */}
            <Exit exitPos={exitPos} isUnlocked={isExitUnlocked} cellSize={cellSize} />
          </div>
        </div>
      </div>

      {/* Touch / Mobile Hint */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 md:hidden">
        <Hand className="w-3 h-3 text-cyan-400 animate-pulse" />
        <span>SWIPE ON GRID OR USE D-PAD BELOW</span>
      </div>

      {/* Enhanced Virtual Tactical D-Pad for Mobile Touch Devices */}
      <div className="flex flex-col items-center gap-1 md:hidden mt-1 touch-manipulation">
        {/* UP */}
        <button
          onClick={() => movePlayer(-1, 0)}
          className="w-16 h-12 bg-tactical-800 border-2 border-tactical-600 active:bg-cyan-500 active:text-slate-950 active:border-cyan-400 rounded-xl flex items-center justify-center text-slate-100 shadow-lg transition-transform active:scale-90"
          aria-label="Move Up"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* LEFT / CENTER / RIGHT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => movePlayer(0, -1)}
            className="w-16 h-12 bg-tactical-800 border-2 border-tactical-600 active:bg-cyan-500 active:text-slate-950 active:border-cyan-400 rounded-xl flex items-center justify-center text-slate-100 shadow-lg transition-transform active:scale-90"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Contextual Action Button (Defuse if near bomb) */}
          {adjacentBomb ? (
            <button
              onClick={() => promptDefuse(adjacentBomb)}
              className="w-16 h-12 bg-rose-600 border-2 border-rose-400 text-white font-mono font-black text-xs rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-bounce"
              aria-label="Disarm Bomb"
            >
              <Wrench className="w-4 h-4" />
              <span>DEFUSE</span>
            </button>
          ) : (
            <div className="w-16 h-12 rounded-xl bg-tactical-900/60 border border-tactical-800 flex items-center justify-center text-[10px] font-mono text-slate-400">
              PAD
            </div>
          )}

          <button
            onClick={() => movePlayer(0, 1)}
            className="w-16 h-12 bg-tactical-800 border-2 border-tactical-600 active:bg-cyan-500 active:text-slate-950 active:border-cyan-400 rounded-xl flex items-center justify-center text-slate-100 shadow-lg transition-transform active:scale-90"
            aria-label="Move Right"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* DOWN */}
        <button
          onClick={() => movePlayer(1, 0)}
          className="w-16 h-12 bg-tactical-800 border-2 border-tactical-600 active:bg-cyan-500 active:text-slate-950 active:border-cyan-400 rounded-xl flex items-center justify-center text-slate-100 shadow-lg transition-transform active:scale-90"
          aria-label="Move Down"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
