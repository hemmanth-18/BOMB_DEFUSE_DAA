import { Lock, LogOut } from 'lucide-react';

export default function Exit({ exitPos, isUnlocked, cellSize }) {
  const [row, col] = exitPos;
  const iconSize = Math.max(10, Math.floor(cellSize * 0.45));

  return (
    <div
      className="absolute z-10 flex items-center justify-center pointer-events-none"
      style={{
        width: cellSize,
        height: cellSize,
        left: col * cellSize,
        top: row * cellSize,
      }}
    >
      <div className="relative w-4/5 h-4/5 flex flex-col items-center justify-center">
        {isUnlocked ? (
          // Unlocked Extraction
          <div className="relative w-full h-full rounded bg-cyan-950/80 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.9)] animate-pulse">
            <LogOut style={{ width: iconSize, height: iconSize }} className="text-cyan-300" />
            {cellSize >= 24 && (
              <span className="text-[7px] font-mono font-bold text-cyan-200 tracking-wider">EXIT</span>
            )}
          </div>
        ) : (
          // Locked Exit
          <div className="w-full h-full rounded bg-slate-950/90 border border-slate-700/80 flex flex-col items-center justify-center opacity-70">
            <Lock style={{ width: iconSize, height: iconSize }} className="text-slate-500" />
            {cellSize >= 24 && (
              <span className="text-[7px] font-mono text-slate-500">LOCK</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
