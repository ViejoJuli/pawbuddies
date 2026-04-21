import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/paw-hero.png";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 16 } },
};

const PawHero = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="container py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/30 text-petrol text-sm font-bold"
          >
            <Sparkles className="w-4 h-4" /> Nuevo · Marketplace para amantes de mascotas
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-black leading-[1.05] text-petrol"
          >
            Todo lo que tu <span className="bg-neon px-2 rounded-lg">buddy</span> ama,
            en un solo lugar.
          </motion.h1>

          <motion.p variants={item} className="text-lg text-petrol/70 max-w-md">
            Descubre productos cuidadosamente seleccionados por veterinarios y otros pet-lovers.
            Compra con cariño, recibe con cola movida. 🐾
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-neon text-petrol hover:bg-neon/90 font-extrabold rounded-full px-8 shadow-[0_10px_30px_-10px_hsl(72_100%_50%/0.6)]"
            >
              Explorar tienda <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-petrol text-petrol hover:bg-petrol hover:text-petrol-foreground font-bold"
            >
              Cómo funciona
            </Button>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-6 pt-4">
            <div>
              <p className="text-2xl font-black text-petrol">10k+</p>
              <p className="text-xs text-petrol/60 font-semibold">Familias felices</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-2xl font-black text-petrol">500+</p>
              <p className="text-xs text-petrol/60 font-semibold">Productos curados</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-2xl font-black text-petrol">4.9★</p>
              <p className="text-xs text-petrol/60 font-semibold">Rating</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 m-auto w-72 h-72 bg-neon rounded-full blur-3xl opacity-30" />
          <motion.img
            src={heroImg}
            alt="Perro y gato amigos en Paw Buddies"
            width={1024}
            height={1024}
            className="relative w-full max-w-md drop-shadow-2xl animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PawHero;