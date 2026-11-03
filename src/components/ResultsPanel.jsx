import { useGameStore } from '../store/gameStore';
import { Trophy, Skull, ArrowRight, RotateCcw, Home, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResultsPanel() {
  const navigate = useNavigate();
  const gameStatus = useGameStore(s => s.gameStatus);
  const currentLevel = useGameStore(s => s.currentLevel);
  const score = useGameStore(s => s.score);
  const levelResult = useGameStore(s => s.levelResult);
  const currentAlgorithm = useGameStore(s => s.currentAlgorithm);
  const startGame = useGameStore(s => s.startGame);
  const playerBombOrder = useGameStore(s => s.playerBombOrder);

  if (gameStatus !== 'level_complete' && gameStatus !== 'game_over' && gameStatus !== 'victory') {
    return null;
  }

  const isWin = gameStatus === 'level_complete' || gameStatus === 'victory';
  const isVictory = gameStatus === 'victory';

  const breakdown = levelResult?.score_breakdown || {
    base_bomb_reward: 500,
    time_bonus: 200,
    efficiency_bonus: 100,
    life_bonus: 200,
    hazard_penalty: 0,
    total_score: 1000,
  };

  const handleNextLevel = () => {
    if (currentLevel < 3) {
      startGame(currentLevel + 1);
    } else {
      navigate('/leaderboard');
    }
  };

  const handleRetry = () => {
    startGame(currentLevel);
  };

  const handleMainMenu = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-300">
      <div className={`w-full max-w-md bg-tactical-900 border-2 rounded-2xl p-4 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto ${
        isWin ? 'border-emerald-500 shadow-emerald-500/20' : 'border-rose-500 shadow-rose-500/20'
      }`}>
        {/* Banner Icon */}
        <div className="flex justify-center -mt-12 mb-3">
          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-lg ${
            isWin
              ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
              : 'bg-rose-950 border-rose-500 text-rose-300'
          }`}>
            {isVictory ? <Award className="w-8 h-8" /> : isWin ? <Trophy className="w-8 h-8" /> : <Skull className="w-8 h-8" />}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            {isVictory ? 'ALL SECTORS CLEARED' : `LEVEL ${currentLevel.toString().padStart(2, '0')} · ${currentAlgorithm}`}
          </span>
          <h2 className="font-display text-2xl font-black tracking-wider mt-1 text-slate-100">
            {isVictory ? 'OPERATION SUCCESSFUL' : isWin ? 'SECTOR SECURED' : 'MISSION FAILED'}
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            {isWin
              ? 'All ordnance defused and operative successfully extracted.'
              : 'Operative neutralized by hazards or countdown expired.'}
          </p>
        </div>

        {/* Score & Breakdown */}
        {isWin && (
          <div className="bg-tactical-950/80 rounded-xl p-4 border border-tactical-800 mb-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-tactical-800 mb-3">
              <span className="text-slate-400">TOTAL SCORE</span>
              <span className="text-xl font-bold font-display text-emerald-400">
                +{levelResult?.score_gained || breakdown.total_score}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Base Bomb Rewards</span>
                <span className="text-slate-200">+{breakdown.base_bomb_reward}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Bonus</span>
                <span className="text-cyan-400">+{breakdown.time_bonus}</span>
              </div>
              <div className="flex justify-between">
                <span>Route Efficiency</span>
                <span className="text-emerald-400">+{breakdown.efficiency_bonus}</span>
              </div>
              <div className="flex justify-between">
                <span>Life Reserve Bonus</span>
                <span className="text-amber-400">+{breakdown.life_bonus}</span>
              </div>
              {breakdown.hazard_penalty > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Hazard Damage Penalty</span>
                  <span>-{breakdown.hazard_penalty}</span>
                </div>
              )}
            </div>

            {/* Level 3 TSP Comparison */}
            {currentLevel === 3 && (
              <div className="mt-3 pt-3 border-t border-tactical-800 text-[11px]">
                <div className="text-amber-400 font-bold mb-1">TSP TOUR PERFORMANCE:</div>
                <div className="flex justify-between text-slate-300">
                  <span>Your Route Cost:</span>
                  <span className="font-bold">{levelResult?.player_cost ?? '—'}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Optimal TSP Cost:</span>
                  <span className="font-bold">{levelResult?.optimal_cost ?? '—'}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px] mt-1">
                  <span>Difference:</span>
                  <span>{levelResult?.difference > 0 ? `+${levelResult.difference} extra cost` : 'PERFECT OPTIMAL TOUR (0)'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2 font-display text-xs">
          {isWin && !isVictory && (
            <button
              onClick={handleNextLevel}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-slate-950 font-black rounded-lg shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              PROCEED TO LEVEL {currentLevel + 1}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isVictory && (
            <button
              onClick={() => navigate('/leaderboard')}
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black rounded-lg shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              VIEW GLOBAL LEADERBOARD
              <Trophy className="w-4 h-4" />
            </button>
          )}

          {!isWin && (
            <button
              onClick={handleRetry}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-slate-100 font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              RETRY MISSION
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleMainMenu}
            className="w-full py-2.5 px-4 bg-tactical-800 hover:bg-tactical-700 text-slate-300 font-bold rounded-lg border border-tactical-700 flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
