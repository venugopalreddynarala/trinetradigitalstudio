import { Link } from "react-router-dom";
import { Camera, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="h-8 w-8 text-accent" />
              <span className="text-xl font-serif font-bold">Trinetra Digital Studio</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Capturing life's precious moments with artistry and passion.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-accent transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-accent transition-smooth">
                  About
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm hover:text-accent transition-smooth">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm hover:text-accent transition-smooth">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <span>contact@trinetradigital.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>123 Photography Lane, CC 12345</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-smooth">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-accent transition-smooth">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-accent transition-smooth">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Trinetra Digital Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
