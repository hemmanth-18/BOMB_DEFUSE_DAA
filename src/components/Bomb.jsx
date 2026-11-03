export default function Bomb({ bomb, cellSize }) {
  const { row, col, label, defused } = bomb;

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
      <div className="relative w-4/5 h-4/5 flex items-center justify-center">
        {defused ? (
          // Defused State
          <div className="w-full h-full rounded bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">
            <span className="text-emerald-400 text-[10px] font-bold">✓</span>
          </div>
        ) : (
          // Armed Bomb
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Warning pulse */}
            <div className="absolute inset-0 rounded-full bg-rose-600/30 animate-ping"></div>

            {/* Bomb core */}
            <div className="relative w-full h-full bg-slate-900 border-2 border-rose-500 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.9)]">
              <span style={{ fontSize: `${Math.max(10, Math.floor(cellSize * 0.45))}px` }}>💣</span>
            </div>

            {/* Bomb Label (only if cellSize >= 24 to keep mobile view clean) */}
            {cellSize >= 24 && (
              <div className="absolute -bottom-2 px-1 rounded bg-slate-950 border border-rose-500/80 text-[8px] font-mono font-bold text-rose-300 whitespace-nowrap shadow">
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
