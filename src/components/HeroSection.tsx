import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="container py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            Want anything to be easy with <span className="text-foreground">LaslesVPN.</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md">
            Provide a network for all your needs with ease and fun using <strong className="text-foreground">LaslesVPN</strong> discover interesting features from us.
          </p>
          <Button size="lg" className="px-12 py-6 text-base font-bold shadow-lg shadow-primary/30">
            Get Started
          </Button>
        </div>
        <div className="flex-1 flex justify-center">
          <img src={heroImg} alt="VPN illustration" width={640} height={512} className="w-full max-w-lg" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
