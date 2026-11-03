import { useGameStore } from '../store/gameStore';
import { Compass, FastForward, Trash2, Cpu, CheckCircle2 } from 'lucide-react';

export default function AlgorithmPanel() {
  const currentLevel = useGameStore(s => s.currentLevel);
  const currentAlgorithm = useGameStore(s => s.currentAlgorithm);
  const isVisualizing = useGameStore(s => s.isVisualizing);
  const currentPath = useGameStore(s => s.currentPath);
  const algorithmStats = useGameStore(s => s.algorithmStats);
  const tspCandidates = useGameStore(s => s.tspCandidates);
  const runAlgorithmVisualization = useGameStore(s => s.runAlgorithmVisualization);
  const storeFindPath = useGameStore(s => s.findShortestPath);
  const findShortestPath = storeFindPath || runAlgorithmVisualization;
  const skipVisualization = useGameStore(s => s.skipVisualization);
  const clearPath = useGameStore(s => s.clearPath);

  const handleFindPath = () => {
    if (typeof findShortestPath === 'function') {
      findShortestPath();
    } else if (typeof runAlgorithmVisualization === 'function') {
      runAlgorithmVisualization();
    }
  };

  const algoDescriptions = {
    BFS: {
      name: 'Breadth-First Search',
      structure: 'Queue (FIFO)',
      guarantee: 'Unweighted Shortest Path (Minimum Hops)',
      complexity: 'O(V + E)',
    },
    DIJKSTRA: {
      name: "Dijkstra's Algorithm",
      structure: 'Priority Queue (Min-Heap)',
      guarantee: 'Optimal Minimum Cost Traversal',
      complexity: 'O((V + E) log V)',
    },
    TSP: {
      name: 'Traveling Salesperson Problem',
      structure: 'Permutations + Pairwise Dijkstra',
      guarantee: 'Global Shortest Multi-Bomb Tour',
      complexity: 'O(N! · (V log V))',
    }
  };

  const currentInfo = algoDescriptions[currentAlgorithm] || algoDescriptions.BFS;

  return (
    <div className="w-full bg-tactical-900/95 border border-tactical-700 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tactical-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display text-xs sm:text-sm font-bold tracking-wider text-slate-100">
            ALGORITHM SYSTEM: <span className="text-cyan-400">{currentInfo.name}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isVisualizing && (
            <button
              onClick={skipVisualization}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              <FastForward className="w-3.5 h-3.5" />
              SKIP ANIMATION
            </button>
          )}

          {currentPath.length > 0 && !isVisualizing && (
            <button
              onClick={clearPath}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-tactical-600 rounded text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              CLEAR
            </button>
          )}

          <button
            onClick={handleFindPath}
            disabled={isVisualizing}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.5)] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 ${isVisualizing ? 'animate-spin' : ''}`} />
            {isVisualizing ? 'EXPLORING...' : 'FIND SHORTEST PATH'}
          </button>
        </div>
      </div>

      {/* Algorithm Specs & Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Specs Box */}
        <div className="bg-tactical-950/60 p-3 rounded-lg border border-tactical-800 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block">DATA STRUCTURE</span>
              <span className="text-slate-200 font-semibold">{currentInfo.structure}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">COMPLEXITY</span>
              <span className="text-amber-400 font-semibold">{currentInfo.complexity}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-tactical-800/80">
              <span className="text-[10px] text-slate-400 block">GUARANTEE</span>
              <span className="text-emerald-400 font-semibold">{currentInfo.guarantee}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-tactical-950/60 p-3 rounded-lg border border-tactical-800">
          <span className="text-[10px] text-slate-400 block mb-2 font-bold tracking-wider">CELL LEGEND</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-tactical-800 border border-tactical-600"></div>
              <span className="text-slate-300">Normal (1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-700"></div>
              <span className="text-slate-400">Wall (Block)</span>
            </div>
            {currentLevel >= 2 && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500"></div>
                  <span className="text-amber-400">Danger (3)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-orange-500/20 border border-orange-500"></div>
                  <span className="text-orange-400">Risk (5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-rose-500/20 border border-rose-500"></div>
                  <span className="text-rose-400">Critical (8)</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-blue-500/30 border border-blue-400"></div>
              <span className="text-blue-300">Visited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-400"></div>
              <span className="text-emerald-300">Optimal Path</span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Stats (Academic Project Defense Table) */}
      {algorithmStats && (
        <div className="bg-tactical-950/80 rounded-lg p-3 border border-tactical-700">
          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            COMPUTATION METRICS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2 rounded bg-tactical-900 border border-tactical-800">
              <div className="text-[10px] text-slate-400">STEPS / HOPS</div>
              <div className="text-base font-bold text-slate-100 font-mono">{algorithmStats.distance ?? '—'}</div>
            </div>
            <div className="p-2 rounded bg-tactical-900 border border-tactical-800">
              <div className="text-[10px] text-slate-400">TOTAL COST</div>
              <div className="text-base font-bold text-emerald-400 font-mono">{algorithmStats.cost ?? '—'}</div>
            </div>
            <div className="p-2 rounded bg-tactical-900 border border-tactical-800">
              <div className="text-[10px] text-slate-400">NODES EXPLORED</div>
              <div className="text-base font-bold text-cyan-400 font-mono">{algorithmStats.nodes_explored ?? '—'}</div>
            </div>
            <div className="p-2 rounded bg-tactical-900 border border-tactical-800">
              <div className="text-[10px] text-slate-400">EXECUTION TIME</div>
              <div className="text-base font-bold text-amber-400 font-mono">{algorithmStats.execution_time_ms} ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Level 3 TSP Candidate Routes Table */}
      {currentLevel === 3 && tspCandidates.length > 0 && (
        <div className="bg-tactical-950/80 rounded-lg p-3 border border-amber-500/30">
          <div className="text-[11px] font-mono font-bold text-amber-400 mb-2">
            TSP PERMUTATION COMPARISON (OPTIMAL VS CANDIDATES)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-tactical-800 text-slate-400 text-[10px]">
                  <th className="pb-1.5">TOUR ORDER</th>
                  <th className="pb-1.5 text-right">COST</th>
                  <th className="pb-1.5 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tactical-800/60">
                {tspCandidates.map((cand, idx) => {
                  const isOptimal = idx === 0;
                  return (
                    <tr key={idx} className={isOptimal ? 'text-emerald-300 font-bold bg-emerald-950/20' : 'text-slate-400'}>
                      <td className="py-1">{cand.order.join(' → ')}</td>
                      <td className="py-1 text-right">{cand.total_cost}</td>
                      <td className="py-1 text-right">
                        {isOptimal ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px]">OPTIMAL</span>
                        ) : (
                          <span className="text-[9px] text-slate-500">+{cand.total_cost - tspCandidates[0].total_cost}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
