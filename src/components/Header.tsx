import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Camera className="h-8 w-8 text-accent transition-smooth group-hover:scale-110" />
            <span className="text-2xl font-serif font-bold">Trinetra Digital Studio</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-accent transition-smooth">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-accent transition-smooth">
              About
            </Link>
            <Link to="/gallery" className="text-foreground hover:text-accent transition-smooth">
              Gallery
            </Link>
            <Link to="/events" className="text-foreground hover:text-accent transition-smooth">
              Events
            </Link>
            <Link to="/contact" className="text-foreground hover:text-accent transition-smooth">
              Contact
            </Link>
          </div>

          <Button asChild>
            <Link to="/contact">Book Now</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
