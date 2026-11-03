import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/audio';
import { Play, HelpCircle, Trophy, User, ShieldAlert, Zap, Compass, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const startGame = useGameStore(s => s.startGame);

  const handleStart = (lvl = 1) => {
    sound.playClick();
    startGame(lvl);
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-tactical-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161f2e_1px,transparent_1px),linear-gradient(to_bottom,#161f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      {/* Top Bar Status */}
      <div className="w-full px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          SECURITY SYSTEM ARMED · CLASSIFIED
        </div>
        <div className="font-mono text-xs text-slate-500">
          DAA ALGORITHMS PROJECT
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center z-10">
        {/* Animated Bomb Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-tactical-900 border-2 border-rose-500/60 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-5xl sm:text-6xl">
            💣
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-wider text-slate-100 mb-2">
          BOMB DEFUSAL <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">ROUTE</span>
        </h1>
        <p className="font-display text-xs sm:text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase mb-8">
          AN ALGORITHMIC ESCAPE GAME
        </p>

        {/* Algorithm Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-10 text-left font-mono text-xs">
          <div className="p-3 rounded-xl bg-tactical-900/80 border border-blue-500/40 hover:border-blue-500 transition-colors">
            <div className="text-blue-400 font-bold mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> LEVEL 1 · BFS
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Queue-based breadth-first search for unweighted minimum hops.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-tactical-900/80 border border-cyan-500/40 hover:border-cyan-500 transition-colors">
            <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> LEVEL 2 · DIJKSTRA
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Min-heap priority queue avoiding hazardous weighted terrain.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-tactical-900/80 border border-amber-500/40 hover:border-amber-500 transition-colors">
            <div className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> LEVEL 3 · TSP
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Optimal multi-bomb permutation tour before timer expiration.
            </p>
          </div>
        </div>

        {/* Difficulty Mode Selector */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 p-1.5 bg-tactical-900/90 border border-tactical-700 rounded-xl mb-6 font-mono text-xs w-full max-w-md">
          <span className="text-slate-400 px-2 font-bold">MODE:</span>
          <button
            onClick={() => { sound.playClick(); useGameStore.getState().setDifficulty('tactical'); }}
            className={`flex-1 min-w-[130px] py-1.5 px-3 rounded-lg font-bold transition-all text-center ${
              useGameStore(s => s.difficulty) === 'tactical'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TACTICAL (NORMAL)
          </button>
          <button
            onClick={() => { sound.playClick(); useGameStore.getState().setDifficulty('hardcore'); }}
            className={`flex-1 min-w-[130px] py-1.5 px-3 rounded-lg font-bold transition-all text-center ${
              useGameStore(s => s.difficulty) === 'hardcore'
                ? 'bg-rose-500 text-slate-950 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔥 NIGHTMARE (FOG)
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md font-display text-sm">
          <button
            onClick={() => handleStart(1)}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wider"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            PLAY GAME
          </button>
          <button
            onClick={() => { sound.playClick(); navigate('/how-to-play'); }}
            className="py-4 px-6 bg-tactical-900 hover:bg-tactical-800 border border-tactical-700 text-slate-200 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            HOW TO PLAY
          </button>
        </div>

        {/* Secondary Links */}
        <div className="flex items-center gap-4 mt-6 text-xs font-mono text-slate-400">
          <button
            onClick={() => { sound.playClick(); navigate('/leaderboard'); }}
            className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" /> Leaderboard
          </button>
          <span>·</span>
          <button
            onClick={() => { sound.playClick(); navigate('/profile'); }}
            className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <User className="w-3.5 h-3.5" /> Operative Profile
          </button>
        </div>
      </div>

      {/* Footer Specs */}
      <footer className="w-full px-6 py-4 border-t border-tactical-800 text-center font-mono text-[11px] text-slate-500 z-10">
        Engineered with React · Tailwind CSS · Manual Python BFS / Dijkstra / TSP · Supabase Compatible
      </footer>
    </div>
  );
}
