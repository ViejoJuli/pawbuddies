import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import confetti from "canvas-confetti";
import { useRef } from "react";
import { Product, useCart } from "@/context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { add, open } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleAdd = () => {
    add(product);
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 35,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#CCFF00", "#004C54", "#333333", "#ffffff"],
        scalar: 0.9,
      });
    }
    setTimeout(() => open(), 250);
  };

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group relative bg-card rounded-3xl border border-border overflow-hidden flex flex-col"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={512}
          height={512}
          className="w-full h-full object-contain p-6"
          whileHover={{ scale: 1.08, rotate: -2 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        <span className="absolute top-3 left-3 text-xs font-bold bg-neon text-petrol px-2.5 py-1 rounded-full">
          {product.tag}
        </span>
        <button
          aria-label="Favorito"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center text-petrol hover:bg-neon transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <h3 className="font-extrabold text-petrol text-lg leading-tight">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-2xl font-black text-petrol">
            ${product.price.toFixed(2)}
          </span>
          <motion.button
            ref={btnRef}
            onClick={handleAdd}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-1.5 bg-petrol text-petrol-foreground hover:bg-carbon font-bold text-sm px-4 py-2.5 rounded-full transition-colors"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <Plus className="w-4 h-4" /> Añadir
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;