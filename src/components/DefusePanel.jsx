import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { AlertTriangle, Wrench, X, Scissors, ShieldAlert, Zap } from 'lucide-react';

const WIRE_STYLES = {
  RED: {
    bg: 'bg-rose-600 hover:bg-rose-500',
    border: 'border-rose-400',
    text: 'text-rose-200',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    hot: true,
  },
  BLUE: {
    bg: 'bg-cyan-600 hover:bg-cyan-500',
    border: 'border-cyan-400',
    text: 'text-cyan-200',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    hot: false,
  },
  YELLOW: {
    bg: 'bg-amber-600 hover:bg-amber-500',
    border: 'border-amber-400',
    text: 'text-amber-200',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    hot: false,
  },
  GREEN: {
    bg: 'bg-emerald-600 hover:bg-emerald-500',
    border: 'border-emerald-400',
    text: 'text-emerald-200',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    hot: false,
  },
};

export default function DefusePanel() {
  const activeBomb = useGameStore(s => s.activeBomb);
  const defuseProgress = useGameStore(s => s.defuseProgress);
  const disarmSequence = useGameStore(s => s.disarmSequence);
  const cutWires = useGameStore(s => s.cutWires);
  const fuseTimer = useGameStore(s => s.fuseTimer);
  const cutWire = useGameStore(s => s.cutWire);
  const advanceDefusal = useGameStore(s => s.advanceDefusal);
  const cancelDefusal = useGameStore(s => s.cancelDefusal);
  const lives = useGameStore(s => s.lives);

  // Keyboard support: 1,2,3,4 for wire cutting, SPACE for manual bypass, ESC to abort
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Digit1' || e.code === 'Numpad1') {
        cutWire('RED');
      } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
        cutWire('BLUE');
      } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
        cutWire('YELLOW');
      } else if (e.code === 'Digit4' || e.code === 'Numpad4') {
        cutWire('GREEN');
      } else if (e.code === 'Space') {
        e.preventDefault();
        advanceDefusal(34);
      } else if (e.code === 'Escape') {
        cancelDefusal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cutWire, advanceDefusal, cancelDefusal]);

  if (!activeBomb) return null;

  const nextRequiredWire = disarmSequence[cutWires.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-tactical-950 border-2 border-rose-500 rounded-2xl p-4 sm:p-6 shadow-[0_0_40px_rgba(239,68,68,0.5)] relative max-h-[95vh] overflow-y-auto">
        {/* Cancel button */}
        <button
          onClick={cancelDefusal}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-tactical-800 border border-tactical-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Fuse Countdown */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4 pr-7 sm:pr-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse text-rose-500" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-lg font-black text-slate-100 tracking-wider">
                {activeBomb.label || 'TACTICAL WARHEAD'}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-mono text-rose-400 flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3" /> DISARM PROTOCOL
              </p>
            </div>
          </div>

          {/* Fuse Countdown Meter */}
          <div className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border text-center font-mono font-black ${
            fuseTimer < 3 ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-ping' : 'bg-slate-900 border-tactical-700 text-amber-400'
          }`}>
            <span className="text-[9px] block text-slate-400 font-sans tracking-widest">FUSE</span>
            <span className="text-base sm:text-xl">{fuseTimer.toFixed(1)}s</span>
          </div>
        </div>

        {/* Disarm Sequence Clue Panel */}
        <div className="p-2.5 sm:p-3.5 rounded-xl bg-tactical-900/90 border border-tactical-700 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-cyan-400 flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5" /> DISARM SEQUENCE:
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
              {cutWires.length}/{disarmSequence.length} CUT
            </span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2">
            {disarmSequence.map((wire, idx) => {
              const isCut = idx < cutWires.length;
              const isNext = idx === cutWires.length;
              return (
                <div
                  key={idx}
                  className={`flex-1 min-w-[70px] py-1 px-1.5 rounded font-mono text-[10px] sm:text-xs font-bold text-center border transition-all ${
                    isCut
                      ? 'bg-slate-800/80 border-slate-700 text-slate-500 line-through'
                      : isNext
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-pulse'
                      : 'bg-slate-900 border-tactical-700 text-slate-400'
                  }`}
                >
                  <span className="opacity-70">#{idx + 1}</span> <span className="font-black underline">{wire}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Tactical Wires */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {Object.entries(WIRE_STYLES).map(([color, cfg], idx) => {
            return (
              <button
                key={color}
                onClick={() => cutWire(color)}
                className={`py-3 px-3 rounded-xl border-2 font-display font-black text-xs tracking-wider text-slate-950 flex items-center justify-between transition-all active:scale-[0.97] ${cfg.bg} ${cfg.border} ${cfg.glow}`}
              >
                <div className="flex items-center gap-1.5 text-slate-950">
                  <Scissors className="w-3.5 h-3.5" />
                  CUT {color}
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-white font-mono text-[10px]">
                  {idx + 1}
                </kbd>
              </button>
            );
          })}
        </div>

        {/* Progress Bar & Manual Override */}
        <div className="pt-2 border-t border-tactical-800/80 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-slate-400">DEFUSAL STATUS</span>
            <span className="font-bold text-emerald-400">{defuseProgress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-tactical-700 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-150"
              style={{ width: `${defuseProgress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <button
              onClick={() => advanceDefusal(34)}
              className="flex-1 py-2 px-3 bg-tactical-800 hover:bg-tactical-700 border border-tactical-600 rounded-lg text-slate-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              RAPID OVERRIDE <kbd className="px-1 bg-black/40 rounded text-[10px] text-slate-300">SPACE</kbd>
            </button>
            <div className="text-[11px] font-mono text-slate-500">
              ❤️ Lives: <span className="text-rose-400 font-bold">{lives}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
