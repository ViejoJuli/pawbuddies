import PawNavbar from "@/components/paw/PawNavbar";
import PawHero from "@/components/paw/PawHero";
import FeaturedProducts from "@/components/paw/FeaturedProducts";
import CartDrawer from "@/components/paw/CartDrawer";
import { CartProvider } from "@/context/CartContext";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <PawNavbar />
        <main>
          <PawHero />
          <FeaturedProducts />
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default Index;
