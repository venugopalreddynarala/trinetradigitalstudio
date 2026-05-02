import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, VideoOff, AlertTriangle } from "lucide-react";

interface YouTubePlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  youtubeUrl?: string | null;
  title?: string;
}

const extractVideoId = (url?: string | null): string | null => {
  if (!url) return null;
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|live\/|shorts\/|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const YouTubePlayerModal = ({
  open,
  onOpenChange,
  youtubeUrl,
  title = "Live Stream",
}: YouTubePlayerModalProps) => {
  const videoId = extractVideoId(youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : null;

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Reset states whenever the modal reopens or the source changes
  useEffect(() => {
    if (open) {
      setIframeLoaded(false);
      setLoadError(false);
    }
  }, [open, embedUrl]);

  // Safety timeout: if iframe never loads, show an error fallback
  useEffect(() => {
    if (!open || !embedUrl || iframeLoaded) return;
    const timer = window.setTimeout(() => {
      if (!iframeLoaded) setLoadError(true);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [open, embedUrl, iframeLoaded]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl font-serif pr-8 line-clamp-1">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-4">
          {/* Case 1: No link provided */}
          {!youtubeUrl && (
            <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center text-center px-6 gap-3">
              <VideoOff className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No live stream available</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                This event doesn't have a live stream link yet. Please check
                back closer to the event time.
              </p>
            </div>
          )}

          {/* Case 2: Link provided but invalid YouTube URL */}
          {youtubeUrl && !embedUrl && (
            <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center text-center px-6 gap-3">
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Invalid stream link</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                The provided link doesn't look like a valid YouTube URL. You can
                still try opening it directly.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open link
                </a>
              </Button>
            </div>
          )}

          {/* Case 3: Valid embed — show player with loading + error states */}
          {embedUrl && (
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                {!iframeLoaded && !loadError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    <p className="text-sm text-white/80">Loading stream…</p>
                  </div>
                )}

                {loadError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 z-10 px-6 text-center bg-black/80">
                    <AlertTriangle className="h-10 w-10 text-accent" />
                    <p className="text-sm text-white/90">
                      The stream is taking too long to load.
                    </p>
                    <Button asChild variant="secondary" size="sm">
                      <a
                        href={youtubeUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open on YouTube
                      </a>
                    </Button>
                  </div>
                )}

                <iframe
                  key={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>

              <Button asChild variant="outline" className="w-full">
                <a
                  href={youtubeUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in YouTube
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubePlayerModal;
