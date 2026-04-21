import PawNavbar from "@/components/paw/PawNavbar";
import PawHero from "@/components/paw/PawHero";
import FeaturedProducts from "@/components/paw/FeaturedProducts";
import CartDrawer from "@/components/paw/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Newspaper } from "lucide-react";

const Placeholder = ({
  id,
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Heart;
}) => (
  <section id={id} className="container py-16 md:py-24">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl border border-dashed border-petrol/20 bg-card p-8 md:p-12 text-center"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/30 text-petrol text-xs font-bold">
        <Icon className="w-3.5 h-3.5" /> {eyebrow}
      </span>
      <h2 className="text-2xl md:text-4xl font-black text-petrol mt-4">{title}</h2>
      <p className="text-petrol/70 mt-3 max-w-xl mx-auto">{description}</p>
      <p className="mt-6 text-xs text-petrol/40 font-semibold uppercase tracking-wider">
        Próximamente · sección en construcción 🐾
      </p>
    </motion.div>
  </section>
);

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <PawNavbar />
        <main>
          <PawHero />
          <FeaturedProducts />
          <Placeholder
            id="comunidad"
            eyebrow="Comunidad"
            title="Conecta con otros pet-parents"
            description="Comparte fotos, consejos y aventuras con miles de familias que aman a sus mascotas tanto como tú."
            icon={MessageCircle}
          />
          <Placeholder
            id="blog"
            eyebrow="Blog"
            title="Historias, tips y guías veterinarias"
            description="Artículos curados por expertos para que tu buddy viva su mejor vida — desde nutrición hasta entrenamiento."
            icon={Newspaper}
          />
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default Index;
