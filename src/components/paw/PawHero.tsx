import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/paw-hero.png";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 180, damping: 12, mass: 0.9 },
  },
};

const PawHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Wiggle: mientras se hace scroll cerca del hero la mascota oscila suavemente
  const wiggle = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, -4, 4, 0]);
  const scaleOnScroll = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 1]);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="container py-10 md:py-20 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-neon/30 text-petrol text-xs sm:text-sm font-bold"
          >
            <Sparkles className="w-4 h-4" /> Nuevo · Marketplace para amantes de mascotas
          </motion.span>

          <motion.h1
            variants={item}
            className="text-3xl sm:text-5xl md:text-6xl font-black !leading-[1.15] text-petrol"
          >
            Todo lo que tu{" "}
            <span className="relative isolate inline-block px-2 before:absolute before:inset-x-0 before:top-[0.2em] before:bottom-[0.16em] before:-z-10 before:rounded-lg before:bg-neon before:content-['']">
              buddy
            </span>{" "}
            ama, en un solo lugar.
          </motion.h1>

          <motion.p variants={item} className="text-base sm:text-lg text-petrol/70 max-w-md">
            Descubre productos cuidadosamente seleccionados por veterinarios y otros pet-lovers.
            Compra con cariño, recibe con cola movida. 🐾
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-neon text-petrol hover:bg-neon/90 font-extrabold rounded-full px-8 shadow-[0_10px_30px_-10px_hsl(72_100%_50%/0.6)]"
            >
              <a href="#productos">
                Explorar tienda <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-petrol text-petrol hover:bg-petrol hover:text-petrol-foreground font-bold"
            >
              <a href="#comunidad">Cómo funciona</a>
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6 pt-4 max-w-md"
          >
            {[
              { v: "10k+", l: "Familias felices" },
              { v: "500+", l: "Productos curados" },
              { v: "4.9★", l: "Rating" },
            ].map((s, i) => (
              <div key={s.v} className="flex items-center gap-3 sm:gap-6">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-petrol leading-none">{s.v}</p>
                  <p className="text-[10px] sm:text-xs text-petrol/60 font-semibold mt-1">{s.l}</p>
                </div>
                {i < 2 && <div className="hidden sm:block w-px h-10 bg-border" />}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.3 }}
          className="relative flex justify-center order-first md:order-none"
        >
          <div className="absolute inset-0 m-auto w-56 sm:w-72 h-56 sm:h-72 bg-neon rounded-full blur-3xl opacity-30" />
          <motion.img
            src={heroImg}
            alt="Perro y gato amigos en Paw Buddies"
            width={1024}
            height={1024}
            className="relative w-full max-w-[260px] sm:max-w-sm md:max-w-md drop-shadow-2xl animate-float"
            style={{ rotate: wiggle, scale: scaleOnScroll }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PawHero;