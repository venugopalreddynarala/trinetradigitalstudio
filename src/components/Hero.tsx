import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 gradient-hero" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6">
          Capturing Life's
          <br />
          <span className="text-accent">Beautiful Moments</span>
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Professional photography that tells your unique story with artistry and passion
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg">
            <Link to="/gallery">View Portfolio</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
            <Link to="/contact">Book a Session</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
