import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|live\/|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "past");

  const EventCard = ({ event }: { event: any }) => (
    <Card 
      className="overflow-hidden group shadow-elegant hover:shadow-hover transition-smooth"
    >
      <div 
        className="cursor-pointer"
        onClick={() => setSelectedEvent(event)}
      >
        {event.thumbnail_url ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.thumbnail_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
            />
            <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
              {event.status === "upcoming" ? "Upcoming" : "Past Event"}
            </Badge>
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-muted-foreground/30" />
            <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
              {event.status === "upcoming" ? "Upcoming" : "Past Event"}
            </Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="group-hover:text-accent transition-smooth">
            {event.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {event.summary}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-accent" />
              {format(new Date(event.event_date), "MMMM d, yyyy")}
            </div>
            {event.event_time && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 text-accent" />
                {event.event_time}
              </div>
            )}
            {event.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 text-accent" />
                {event.location}
              </div>
            )}
          </div>
        </CardContent>
      </div>
      
      {event.youtube_url && (
        <CardContent className="pt-0 pb-4">
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold text-base py-6 shadow-lg"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <a href={event.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <ExternalLink className="h-5 w-5" />
              <span>🎥 WATCH {event.status === "upcoming" ? "LIVE" : "RECORDING"}</span>
            </a>
          </Button>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-serif font-bold mb-4 text-center">
            Our <span className="text-accent">Events</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            Join us for upcoming events or relive past moments
          </p>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : (
            <>
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-serif font-bold mb-8">Upcoming Events</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <section>
                  <h2 className="text-3xl font-serif font-bold mb-8">Past Events</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              )}

              {events.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No events scheduled yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              {selectedEvent.thumbnail_url && (
                <img
                  src={selectedEvent.thumbnail_url}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-3 text-accent" />
                  {format(new Date(selectedEvent.event_date), "MMMM d, yyyy")}
                </div>
                {selectedEvent.event_time && (
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-3 text-accent" />
                    {selectedEvent.event_time}
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-3 text-accent" />
                    {selectedEvent.location}
                  </div>
                )}
              </div>
              {selectedEvent.description_html && (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedEvent.description_html }}
                />
              )}
              {selectedEvent.youtube_url && (
                <div className="space-y-4">
                  {getYouTubeEmbedUrl(selectedEvent.youtube_url) && (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={getYouTubeEmbedUrl(selectedEvent.youtube_url) || ''}
                        title={selectedEvent.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <a href={selectedEvent.youtube_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in YouTube
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Events;
