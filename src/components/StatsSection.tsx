import { Users, MapPin, Server } from "lucide-react";

const stats = [
  { icon: Users, value: "90+", label: "Users", color: "text-primary" },
  { icon: MapPin, value: "30+", label: "Locations", color: "text-primary" },
  { icon: Server, value: "50+", label: "Servers", color: "text-primary" },
];

const StatsSection = () => {
  return (
    <section className="container py-12">
      <div className="bg-background rounded-lg shadow-xl border border-border py-10 px-8 flex flex-col md:flex-row items-center justify-evenly gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
