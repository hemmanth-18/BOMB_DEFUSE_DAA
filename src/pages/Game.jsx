import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import HUD from '../components/HUD';
import GameBoard from '../components/GameBoard';
import AlgorithmPanel from '../components/AlgorithmPanel';
import DefusePanel from '../components/DefusePanel';
import ResultsPanel from '../components/ResultsPanel';

export default function Game() {
  const gameStatus = useGameStore(s => s.gameStatus);
  const currentLevel = useGameStore(s => s.currentLevel);
  const startGame = useGameStore(s => s.startGame);

  useEffect(() => {
    if (gameStatus === 'menu') {
      startGame(1);
    }
  }, [gameStatus, startGame]);

  return (
    <div className="min-h-screen bg-tactical-950 text-slate-100 flex flex-col justify-between">
      {/* HUD Header */}
      <HUD />

      {/* Main Play Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-2 py-3 sm:p-4 flex flex-col items-center gap-4 sm:gap-6 justify-center">
        {/* Quick Level Selector */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs w-full">
          <span className="text-slate-400 mr-1 text-[11px]">SECTORS:</span>
          {[
            { lvl: 1, name: 'L1 (BFS)' },
            { lvl: 2, name: 'L2 (DIJKSTRA)' },
            { lvl: 3, name: 'L3 (TSP)' },
          ].map(item => (
            <button
              key={item.lvl}
              onClick={() => startGame(item.lvl)}
              className={`px-2.5 py-1 rounded text-xs border transition-all ${
                currentLevel === item.lvl
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'bg-tactical-900 border-tactical-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* 2D Interactive Grid Board */}
        <GameBoard />

        {/* Algorithm Analytics Panel */}
        <div className="w-full max-w-2xl">
          <AlgorithmPanel />
        </div>
      </main>

      {/* Defusal Modal & Results Overlays */}
      <DefusePanel />
      <ResultsPanel />

      {/* Tactical Bottom Bar */}
      <footer className="w-full py-2 px-4 bg-tactical-950 border-t border-tactical-800/80 text-center font-mono text-[10px] text-slate-400">
        CONTROLS: WASD / ARROWS TO MOVE · SPACE TO DISARM ORDNANCE · REACH EXTRACTION HATCH TO COMPLETE
      </footer>
    </div>
  );
}
