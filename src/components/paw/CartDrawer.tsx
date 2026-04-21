import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import EmptyCart from "./EmptyCart";

const CartDrawer = () => {
  const { isOpen, close, items, remove, clear } = useCart();
  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-petrol/40 backdrop-blur-sm z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-50 flex flex-col shadow-2xl"
          >
            <header className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-extrabold text-petrol">Tu carrito</h2>
              <button onClick={close} aria-label="Cerrar" className="text-petrol hover:text-neon">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <EmptyCart onExplore={close} />
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((i) => (
                    <motion.li
                      key={i.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 p-4"
                    >
                      <img src={i.image} alt={i.name} className="w-16 h-16 object-contain bg-muted rounded-xl" />
                      <div className="flex-1">
                        <p className="font-bold text-petrol text-sm">{i.name}</p>
                        <p className="text-petrol/60 text-xs">Cantidad: {i.qty}</p>
                      </div>
                      <span className="font-extrabold text-petrol">${(i.price * i.qty).toFixed(2)}</span>
                      <button
                        onClick={() => remove(i.id)}
                        className="text-petrol/40 hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border p-5 space-y-4 bg-muted/40">
                <div className="flex items-center justify-between">
                  <span className="text-petrol/70 font-semibold">Total</span>
                  <span className="text-2xl font-black text-petrol">${total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-neon text-petrol font-extrabold py-4 rounded-full hover:scale-[1.02] transition-transform">
                  Finalizar compra
                </button>
                <button onClick={clear} className="w-full text-sm text-petrol/60 hover:text-petrol">
                  Vaciar carrito
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;