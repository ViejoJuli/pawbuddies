import { motion } from "framer-motion";
import { PawPrint, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const links = ["Inicio", "Productos", "Mascotas", "Comunidad"];

const PawNavbar = () => {
  const { count, open } = useCart();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-2 text-petrol">
          <span className="w-9 h-9 rounded-full bg-neon flex items-center justify-center shadow-md">
            <PawPrint className="w-5 h-5 text-petrol" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">Paw Buddies</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l}>
              <a href="#" className="text-petrol/80 font-semibold hover:text-petrol transition-colors story-link">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <Button
          onClick={open}
          variant="ghost"
          className="relative text-petrol hover:bg-petrol/5 font-semibold"
          aria-label="Abrir carrito"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="hidden sm:inline">Carrito</span>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-neon text-petrol text-xs font-bold flex items-center justify-center"
            >
              {count}
            </motion.span>
          )}
        </Button>
      </div>
    </motion.nav>
  );
};

export default PawNavbar;