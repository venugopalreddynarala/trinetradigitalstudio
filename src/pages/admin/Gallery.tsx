import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageCropper } from "@/components/ImageCropper";

const AdminGallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image",
    tags: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
      } else {
        setUser(session.user);
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: galleryItems = [] } = useQuery({
    queryKey: ["gallery-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    setCroppedImage(croppedImageBlob);
    setShowCropper(false);
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let mediaUrl = "";

      if (croppedImage) {
        const fileExt = "jpg";
        const fileName = `gallery-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(fileName, croppedImage);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("site-assets")
          .getPublicUrl(fileName);
        mediaUrl = publicUrl;
      }

      const { error } = await supabase.from("gallery_items").insert({
        title: data.title,
        description: data.description,
        media_url: mediaUrl,
        type: data.type,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()) : [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-items"] });
      setIsDialogOpen(false);
      setFormData({ title: "", description: "", type: "image", tags: "" });
      setImageFile(null);
      setImagePreview("");
      setCroppedImage(null);
      toast({ title: "Gallery item created successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-items"] });
      toast({ title: "Gallery item deleted successfully" });
    },
  });

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Gallery Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="mt-2">
                    {croppedImage && (
                      <div className="mb-4">
                        <img 
                          src={URL.createObjectURL(croppedImage)} 
                          alt="Cropped preview" 
                          className="h-32 w-auto object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="wedding, portrait, landscape"
                  />
                </div>
                <Button 
                  onClick={() => createMutation.mutate(formData)} 
                  className="w-full"
                  disabled={!croppedImage}
                >
                  Create Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {showCropper && imagePreview && (
            <ImageCropper
              image={imagePreview}
              onCropComplete={handleCropComplete}
              onCancel={() => {
                setShowCropper(false);
                setImageFile(null);
                setImagePreview("");
              }}
              aspectRatio={4 / 3}
            />
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Manage Gallery</h1>

        <div className="grid gap-4">
          {galleryItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {item.type === "image" ? (
                    <img src={item.media_url} alt={item.title} className="w-32 h-32 object-cover rounded" />
                  ) : (
                    <video src={item.media_url} className="w-32 h-32 object-cover rounded" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Type: {item.type}</p>
                    <p className="text-sm text-muted-foreground">Tags: {item.tags?.join(", ") || "None"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminGallery;
