import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetLeaderboard } from '../api/api';
import { sound } from '../utils/audio';
import { ArrowLeft, Trophy, Medal, UserCheck } from 'lucide-react';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetLeaderboard().then(data => {
      setEntries(data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const filtered = entries.filter(e => {
    if (filterLevel === 'all') return true;
    return e.level === parseInt(filterLevel, 10);
  });

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
            GLOBAL TACTICAL ARCHIVE
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-black tracking-wider text-slate-100 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              OPERATIVE LEADERBOARD
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Top recorded mission clearances sorted by algorithmic efficiency and score.
            </p>
          </div>

          {/* Level Filter */}
          <div className="flex gap-1.5 font-mono text-xs bg-tactical-900 p-1 rounded-lg border border-tactical-800">
            {['all', '1', '2', '3'].map(lvl => (
              <button
                key={lvl}
                onClick={() => { sound.playClick(); setFilterLevel(lvl); }}
                className={`px-3 py-1 rounded transition-colors ${
                  filterLevel === lvl
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'all' ? 'ALL' : `LVL ${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-tactical-900/80 border border-tactical-700 rounded-xl overflow-hidden shadow-2xl font-mono">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
              ACCESSING SECURE DATA VAULT...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              NO MISSIONS RECORDED YET. BE THE FIRST OPERATIVE TO CLEAR THIS SECTOR.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-tactical-950 border-b border-tactical-800 text-[10px] text-slate-400 tracking-wider">
                    <th className="py-3 px-4">RANK</th>
                    <th className="py-3 px-4">OPERATIVE</th>
                    <th className="py-3 px-4">SECTOR</th>
                    <th className="py-3 px-4">ALGORITHM</th>
                    <th className="py-3 px-4 text-right">PATH COST</th>
                    <th className="py-3 px-4 text-right">SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tactical-800/60">
                  {filtered.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-tactical-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold">
                        {idx === 0 ? <span className="text-yellow-400 flex items-center gap-1"><Medal className="w-4 h-4" /> #1</span> :
                         idx === 1 ? <span className="text-slate-300 flex items-center gap-1"><Medal className="w-4 h-4" /> #2</span> :
                         idx === 2 ? <span className="text-amber-600 flex items-center gap-1"><Medal className="w-4 h-4" /> #3</span> :
                         <span className="text-slate-500 pl-1.5">#{idx + 1}</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-semibold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        {row.username || 'Anonymous'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">Level {row.level}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-tactical-950 border border-tactical-700 text-cyan-300 font-bold">
                          {row.algorithm}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">{row.path_cost ?? '—'}</td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold font-display text-sm">
                        {row.score?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full text-center font-mono text-[11px] text-slate-600 py-4">
        Bomb Defusal Route · Verified Algorithm Execution
      </footer>
    </div>
  );
}
