import { motion } from 'framer-motion';

export default function Player({ row, col, cellSize }) {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none flex items-center justify-center"
      style={{
        width: cellSize,
        height: cellSize,
      }}
      animate={{
        x: col * cellSize,
        y: row * cellSize,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
    >
      <div className="relative w-4/5 h-4/5 flex items-center justify-center">
        {/* Glow halo */}
        <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-sm animate-pulse"></div>

        {/* Tactical operative body */}
        <div className="relative w-full h-full bg-slate-900 border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.8)]">
          {/* Visor */}
          <div className="w-2.5 h-1.5 bg-emerald-300 rounded-sm shadow-[0_0_6px_#10b981]"></div>
        </div>

        {/* Subtle player badge */}
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full border border-slate-950"></div>
      </div>
    </motion.div>
  );
}
