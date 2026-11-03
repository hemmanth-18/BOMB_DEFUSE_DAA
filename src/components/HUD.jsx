import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/audio';
import { Shield, Flame, Timer as TimerIcon, Trophy, Volume2, VolumeX, Eye, Skull } from 'lucide-react';
import { useState } from 'react';

export default function HUD() {
  const currentLevel = useGameStore(s => s.currentLevel);
  const levelName = useGameStore(s => s.levelName);
  const currentAlgorithm = useGameStore(s => s.currentAlgorithm);
  const timer = useGameStore(s => s.timer);
  const maxTime = useGameStore(s => s.maxTime);
  const lives = useGameStore(s => s.lives);
  const maxLives = useGameStore(s => s.maxLives || 3);
  const bombs = useGameStore(s => s.bombs);
  const bombsDefused = useGameStore(s => s.bombsDefused);
  const score = useGameStore(s => s.score);
  const difficulty = useGameStore(s => s.difficulty);
  const setDifficulty = useGameStore(s => s.setDifficulty);

  const [isMuted, setIsMuted] = useState(sound.muted);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const toggleDifficulty = () => {
    const nextDiff = difficulty === 'tactical' ? 'hardcore' : 'tactical';
    setDifficulty(nextDiff);
    sound.playClick();
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = timer <= 15;

  const algoColors = {
    BFS: 'border-blue-500 text-blue-400 bg-blue-950/40 shadow-blue-500/20',
    DIJKSTRA: 'border-cyan-500 text-cyan-400 bg-cyan-950/40 shadow-cyan-500/20',
    TSP: 'border-amber-500 text-amber-400 bg-amber-950/40 shadow-amber-500/20',
  };

  return (
    <header className="w-full bg-tactical-900/95 backdrop-blur-md border-b border-tactical-700 px-3 py-2 shadow-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Top / Left Row: Identity, Algorithm, Settings */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">💣</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-xs sm:text-sm font-bold tracking-wider text-slate-100">
                  BOMB DEFUSAL
                </h1>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-tactical-800 text-slate-300 border border-tactical-700">
                  L{currentLevel}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 truncate max-w-[140px] sm:max-w-none">{levelName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Algorithm Badge */}
            <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm ${algoColors[currentAlgorithm] || algoColors.BFS}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {currentAlgorithm}
            </div>

            {/* Difficulty Toggle Button */}
            <button
              onClick={toggleDifficulty}
              className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                difficulty === 'hardcore'
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                  : 'bg-tactical-800 border-tactical-700 text-cyan-400'
              }`}
              title="Toggle between Tactical and Nightmare Mode"
            >
              {difficulty === 'hardcore' ? (
                <>
                  <Skull className="w-3 h-3 text-rose-400" />
                  <span className="hidden sm:inline">NIGHTMARE</span>
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">TACTICAL</span>
                </>
              )}
            </button>

            {/* Sound Mute Button */}
            <button
              onClick={toggleSound}
              className="p-1 rounded hover:bg-tactical-700 text-slate-400 hover:text-slate-100 transition-colors"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Bottom / Right Row: Live Game Stats Grid */}
        <div className="grid grid-cols-4 sm:flex items-center gap-1.5 sm:gap-4 font-mono text-xs">
          {/* Timer */}
          <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded border transition-colors ${
            isTimeCritical
              ? 'bg-rose-950/70 border-rose-500/80 text-rose-300 animate-pulse'
              : 'bg-tactical-800/80 border-tactical-700 text-slate-200'
          }`}>
            <TimerIcon className={`w-3.5 h-3.5 ${isTimeCritical ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span className="font-bold text-[11px] sm:text-xs tracking-wider">{timeStr}</span>
          </div>

          {/* Lives */}
          <div className="flex items-center justify-center gap-1 bg-tactical-800/80 px-2 py-1 rounded border border-tactical-700">
            <div className="flex gap-0.5">
              {Array.from({ length: maxLives }).map((_, i) => {
                const heartIdx = i + 1;
                return (
                  <span
                    key={heartIdx}
                    className={`text-xs transition-all duration-300 ${
                      heartIdx <= lives ? 'scale-100 opacity-100 filter drop-shadow-[0_0_3px_#ef4444]' : 'scale-75 opacity-20 grayscale'
                    }`}
                  >
                    ❤️
                  </span>
                );
              })}
            </div>
          </div>

          {/* Bombs Defused */}
          <div className="flex items-center justify-center gap-1 bg-tactical-800/80 px-2 py-1 rounded border border-tactical-700 text-slate-200">
            <span className="text-xs">💣</span>
            <span className="font-bold text-amber-400">{bombsDefused}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{bombs.length}</span>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-1 bg-tactical-800/80 px-2 py-1 rounded border border-tactical-700 text-emerald-400 font-bold">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-[11px] sm:text-xs">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
