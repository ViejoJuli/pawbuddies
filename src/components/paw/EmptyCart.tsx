import { motion } from "framer-motion";

const EmptyCart = ({ onExplore }: { onExplore: () => void }) => {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <motion.svg
        viewBox="0 0 200 160"
        className="w-48 h-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        {/* Bowl */}
        <motion.ellipse
          cx="100"
          cy="125"
          rx="70"
          ry="14"
          fill="hsl(var(--petrol) / 0.08)"
        />
        <path
          d="M40 90 Q100 140 160 90 L150 110 Q100 150 50 110 Z"
          fill="hsl(var(--petrol))"
        />
        <rect x="40" y="82" width="120" height="14" rx="7" fill="hsl(var(--neon))" />
        {/* Paw prints floating */}
        {[
          { x: 30, y: 40, d: 0 },
          { x: 160, y: 55, d: 0.3 },
          { x: 95, y: 20, d: 0.6 },
        ].map((p, i) => (
          <motion.g
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: p.d, ease: "easeInOut" }}
          >
            <circle cx={p.x} cy={p.y} r="6" fill="hsl(var(--petrol))" />
            <circle cx={p.x - 8} cy={p.y - 6} r="2.5" fill="hsl(var(--petrol))" />
            <circle cx={p.x - 3} cy={p.y - 10} r="2.5" fill="hsl(var(--petrol))" />
            <circle cx={p.x + 4} cy={p.y - 10} r="2.5" fill="hsl(var(--petrol))" />
            <circle cx={p.x + 9} cy={p.y - 6} r="2.5" fill="hsl(var(--petrol))" />
          </motion.g>
        ))}
      </motion.svg>

      <h3 className="text-xl font-extrabold text-petrol mt-4">Tu carrito está esperando</h3>
      <p className="text-petrol/60 mt-2 max-w-xs">
        Aún no hay nada aquí. Encuentra el regalo perfecto para tu buddy 🐾
      </p>
      <button
        onClick={onExplore}
        className="mt-6 bg-neon text-petrol font-extrabold px-6 py-3 rounded-full hover:scale-105 transition-transform"
      >
        Explorar productos
      </button>
    </div>
  );
};

export default EmptyCart;