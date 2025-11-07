import { Link } from "react-router-dom";
import { Camera, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const socialLinks = typeof settings?.social_links === 'object' && settings.social_links !== null && !Array.isArray(settings.social_links)
    ? settings.social_links as Record<string, any>
    : {};

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {settings?.studio_logo ? (
                <img src={settings.studio_logo} alt="Logo" className="h-8 w-auto" />
              ) : (
                <Camera className="h-8 w-8 text-accent" />
              )}
              <span className="text-xl font-serif font-bold">{settings?.studio_name || "Trinetra Digital Studio"}</span>
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
              {settings?.contact_email && (
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <span>{settings.contact_email}</span>
                </li>
              )}
              {settings?.contact_phone && (
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>{settings.contact_phone}</span>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-smooth">
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-smooth">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-smooth">
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-smooth">
                  <Youtube className="h-6 w-6" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-smooth">
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.studio_name || "Trinetra Digital Studio"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
