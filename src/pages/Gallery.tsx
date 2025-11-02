import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play } from "lucide-react";

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<any>(null);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ["gallery-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const allTags = Array.from(
    new Set(galleryItems.flatMap((item) => item.tags || []))
  );

  const filteredItems =
    selectedFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.tags?.includes(selectedFilter));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-serif font-bold mb-4 text-center">
            Our <span className="text-accent">Gallery</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            Explore our collection of beautiful moments captured through the lens
          </p>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Badge
              variant={selectedFilter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedFilter("all")}
            >
              All
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedFilter === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedFilter(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Masonry Gallery */}
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No items in gallery yet.</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="break-inside-avoid overflow-hidden group cursor-pointer shadow-elegant hover:shadow-hover transition-smooth"
                  onClick={() => setLightboxImage(item)}
                >
                  <CardContent className="p-0 relative">
                    {item.type === "image" ? (
                      <img
                        src={item.media_url}
                        alt={item.title}
                        className="w-full h-auto transition-smooth group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={item.thumb_url || item.media_url}
                          alt={item.title}
                          className="w-full h-auto transition-smooth group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/40">
                          <Play className="h-16 w-16 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
                      <div className="text-primary-foreground">
                        <h3 className="font-serif text-xl font-bold mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          {lightboxImage && (
            <div className="relative">
              {lightboxImage.type === "image" ? (
                <img
                  src={lightboxImage.media_url}
                  alt={lightboxImage.title}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <video
                  src={lightboxImage.media_url}
                  controls
                  className="w-full h-auto rounded-lg"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-transparent p-6 rounded-b-lg">
                <h3 className="text-2xl font-serif font-bold text-primary-foreground mb-2">
                  {lightboxImage.title}
                </h3>
                {lightboxImage.description && (
                  <p className="text-primary-foreground/90">{lightboxImage.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
