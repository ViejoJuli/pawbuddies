import { Button } from "@/components/ui/button";

const Navbar = () => {
  const links = ["About", "Features", "Pricing", "Testimonials", "Help"];

  return (
    <nav className="container flex items-center justify-between py-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-primary-foreground">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-foreground">LaslesVPN</span>
      </div>

      <ul className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-4">
        <Button variant="ghost" className="text-foreground font-medium">Sign In</Button>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium px-8">
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
