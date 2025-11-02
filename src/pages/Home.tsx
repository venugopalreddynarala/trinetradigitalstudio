import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ownerPhoto from "@/assets/owner-photo.jpg";
import galleryWedding from "@/assets/gallery-wedding.jpg";
import galleryPortrait from "@/assets/gallery-portrait.jpg";
import galleryLandscape from "@/assets/gallery-landscape.jpg";

const Home = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* About Preview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-serif font-bold mb-6">
                Meet the <span className="text-accent">Artist</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                With over a decade of experience, {settings?.owner_name || "our photographer"} brings 
                passion, creativity, and technical excellence to every shoot. Specializing in 
                weddings, portraits, and events, we create timeless memories that you'll cherish forever.
              </p>
              <Button asChild>
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="animate-fade-in">
              <img 
                src={ownerPhoto} 
                alt={settings?.owner_name || "Studio Owner"} 
                className="rounded-lg shadow-elegant w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Featured <span className="text-accent">Work</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A glimpse into our portfolio of beautiful moments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: galleryWedding, title: "Wedding Photography", desc: "Romantic & Timeless" },
              { img: galleryPortrait, title: "Professional Portraits", desc: "Elegant & Refined" },
              { img: galleryLandscape, title: "Landscape & Nature", desc: "Breathtaking & Serene" },
            ].map((item, idx) => (
              <Card key={idx} className="overflow-hidden group cursor-pointer shadow-elegant hover:shadow-hover transition-smooth">
                <CardContent className="p-0">
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center flex-col text-primary-foreground">
                      <h3 className="text-2xl font-serif font-bold mb-2">{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Ready to Create <span className="text-accent">Magic</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's work together to capture your special moments. Book your session today!
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
