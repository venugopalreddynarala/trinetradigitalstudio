import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ownerPhoto from "@/assets/owner-photo.jpg";

const About = () => {
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
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-serif font-bold mb-8 text-center">
              About <span className="text-accent">Us</span>
            </h1>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <img 
                  src={ownerPhoto} 
                  alt={settings?.owner_name || "Studio Owner"} 
                  className="rounded-lg shadow-elegant w-full"
                />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Our Story</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Founded with a passion for capturing life's fleeting moments, Trinetra Digital Studio 
                    has been serving clients for over a decade. Our name, "Trinetra" (meaning "third eye" 
                    in Sanskrit), represents our unique vision and ability to see beyond the ordinary.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Led by {settings?.owner_name || "our award-winning photographer"}, we specialize in 
                    wedding photography, portrait sessions, and event coverage. Every photograph we create 
                    tells a story - your story - with authenticity and artistic flair.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-8 mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">Our Philosophy</h2>
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
                We believe that great photography is about more than technical skill—it's about 
                connection, emotion, and trust. We take the time to understand your vision, creating 
                a comfortable environment where your authentic self shines through in every frame.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-accent mb-2">10+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-accent mb-2">500+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-accent mb-2">1000+</div>
                <div className="text-muted-foreground">Events Captured</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
