import { CheckCircle } from "lucide-react";
import featuresImg from "@/assets/features-illustration.png";

const features = [
  "Powerful online protection.",
  "Internet without borders.",
  "Supercharged VPN",
  "No specific time limits.",
];

const FeaturesSection = () => {
  return (
    <section className="container py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 flex justify-center">
          <img src={featuresImg} alt="Features illustration" loading="lazy" width={512} height={512} className="w-full max-w-sm" />
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            We Provide Many Features You Can Use
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            You can explore the features that we provide with fun and have their own functions each feature.
          </p>
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
