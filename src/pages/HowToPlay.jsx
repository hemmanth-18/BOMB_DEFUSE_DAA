import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/audio';
import { ArrowLeft, Play, Compass, Zap, ShieldAlert, Heart, Timer, Trophy } from 'lucide-react';

export default function HowToPlay() {
  const navigate = useNavigate();
  const startGame = useGameStore(s => s.startGame);

  const handlePlay = (lvl = 1) => {
    sound.playClick();
    startGame(lvl);
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-tactical-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-tactical-800 pb-4 mb-6">
          <button
            onClick={() => { sound.playClick(); navigate('/'); }}
            className="flex items-center gap-2 text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> MAIN MENU
          </button>
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            OPERATIVE MANUAL & ALGORITHM GUIDE
          </span>
        </div>

        <h1 className="font-display text-3xl font-black tracking-wider text-slate-100 mb-6">
          FIELD OPERATIONS PROTOCOL
        </h1>

        {/* Sections */}
        <div className="space-y-6">
          {/* 1. Core Mechanics */}
          <div className="bg-tactical-900/80 border border-tactical-700 rounded-xl p-5 shadow-lg">
            <h2 className="font-display text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              CORE MISSION OBJECTIVES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-tactical-950 rounded-lg border border-tactical-800">
                <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <span className="text-sm">1.</span> MOVE OPERATIVE
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Use <kbd className="px-1.5 py-0.5 rounded bg-tactical-800 border border-tactical-700 text-slate-300">W A S D</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-tactical-800 border border-tactical-700 text-slate-300">ARROW KEYS</kbd> to traverse open corridors. You cannot pass through solid walls.
                </p>
              </div>

              <div className="p-3 bg-tactical-950 rounded-lg border border-tactical-800">
                <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <span className="text-sm">2.</span> DEFUSE ORDNANCE
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Step onto a bomb cell and hold <kbd className="px-1.5 py-0.5 rounded bg-tactical-800 border border-tactical-700 text-slate-300">SPACE</kbd> or tap [DEFUSE] until the disarm progress hits 100%.
                </p>
              </div>

              <div className="p-3 bg-tactical-950 rounded-lg border border-tactical-800">
                <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <span className="text-sm">3.</span> ESCAPE THROUGH EXIT
                </div>
                <p className="text-slate-400 leading-relaxed">
                  The extraction hatch is locked until all sector bombs are defused. Once open, step onto the exit before the countdown timer hits 0.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Lives, Hazards, and Scoring */}
          <div className="bg-tactical-900/80 border border-tactical-700 rounded-xl p-5 shadow-lg">
            <h2 className="font-display text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              HAZARDS & DYNAMIC SCORING
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-tactical-950 rounded-lg border border-tactical-800 flex items-start gap-2.5">
                <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">3 LIVES SYSTEM</div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    Stepping on toxic (3), electrical (5), or plasma (8) hazards deducts 1 Life ❤️. Losing all 3 lives aborts the mission.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-tactical-950 rounded-lg border border-tactical-800 flex items-start gap-2.5">
                <Timer className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">TIMER COUNTDOWN</div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    Each level has an active countdown timer. Every remaining second awards +10 Bonus Points upon successful extraction.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-tactical-950 rounded-lg border border-tactical-800 flex items-start gap-2.5">
                <Trophy className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">ALGORITHM EFFICIENCY</div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    Traveling close to the mathematically optimal route grants up to +200 Route Efficiency Bonus points.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. The 3 Algorithms Deep Dive */}
          <div className="bg-tactical-900/80 border border-tactical-700 rounded-xl p-5 shadow-lg">
            <h2 className="font-display text-base font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              THE 3 CORE ALGORITHMS (PROJECT SYLLABUS)
            </h2>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-tactical-950 rounded-lg border-l-4 border-l-blue-500 border border-tactical-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-400 text-sm">LEVEL 1 · BREADTH-FIRST SEARCH (BFS)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">QUEUE · O(V + E)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Explores adjacent cells level by level using a FIFO queue. In an unweighted facility, BFS is guaranteed to discover the path with the minimum number of steps.
                </p>
              </div>

              <div className="p-3.5 bg-tactical-950 rounded-lg border-l-4 border-l-cyan-500 border border-tactical-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-cyan-400 text-sm">LEVEL 2 · DIJKSTRA'S ALGORITHM</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">MIN-HEAP · O((V+E) log V)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Calculates minimum cost over weighted terrain. A direct hallway through heavy hazard radiation (cost 8) will be routed around if an alternate clear hallway has lower total cost.
                </p>
              </div>

              <div className="p-3.5 bg-tactical-950 rounded-lg border-l-4 border-l-amber-500 border border-tactical-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-400 text-sm">LEVEL 3 · TRAVELING SALESPERSON PROBLEM (TSP)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">PERMUTATIONS · N! TOURS</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When 3 distinct warheads are primed in separate wings, the visit sequence matters. The system evaluates every permutation (Start → Bombs → Exit) to discover the global optimal order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => handlePlay(1)}
            className="py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-display font-black text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            DEPLOY TO SECTOR 1
          </button>
        </div>
      </div>
    </div>
  );
}
