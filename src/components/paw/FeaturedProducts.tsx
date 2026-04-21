import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "@/context/CartContext";
import food from "@/assets/product-food.png";
import toy from "@/assets/product-toy.png";
import collar from "@/assets/product-collar.png";
import bed from "@/assets/product-bed.png";

const products: Product[] = [
  { id: "p1", name: "Alimento Premium Adulto", price: 38.9, image: food, tag: "Top Vet" },
  { id: "p2", name: "Juguete de Cuerda Rainbow", price: 12.5, image: toy, tag: "Nuevo" },
  { id: "p3", name: "Collar de Cuero Pack", price: 24.0, image: collar, tag: "Hecho a mano" },
  { id: "p4", name: "Cama Cozy Cloud", price: 49.9, image: bed, tag: "Best seller" },
];

const FeaturedProducts = () => {
  return (
    <section id="productos" className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
      >
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-petrol/60">
            Destacados de la semana
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-petrol mt-2 max-w-xl">
            Lo que más mueven la cola 🐶
          </h2>
        </div>
        <a href="#" className="text-petrol font-bold story-link">
          Ver toda la tienda →
        </a>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {products.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
            }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;