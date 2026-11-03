import { Radio } from 'lucide-react';

export default function Sentry({ sentry, cellSize }) {
  const top = sentry.row * cellSize;
  const left = sentry.col * cellSize;
  const iconSize = Math.max(9, Math.floor(cellSize * 0.45));

  return (
    <div
      className="absolute transition-all duration-300 ease-out pointer-events-none z-15 flex items-center justify-center"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
    >
      {/* Sentry Radar Pulse */}
      <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping"></div>

      {/* Sentry Body */}
      <div className="relative w-4/5 h-4/5 rounded bg-gradient-to-br from-rose-600 via-rose-700 to-slate-900 border border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)] flex items-center justify-center text-white">
        <Radio style={{ width: iconSize, height: iconSize }} className="text-rose-200 animate-spin" />
      </div>
    </div>
  );
}
