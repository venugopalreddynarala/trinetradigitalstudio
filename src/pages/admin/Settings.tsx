import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    studio_name: "",
    owner_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    timezone: "",
    social_links: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [ownerPhotoFile, setOwnerPhotoFile] = useState<File | null>(null);
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string>("");

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
    enabled: !!user,
  });

  useEffect(() => {
    if (settings) {
      const socialLinks = typeof settings.social_links === 'object' && settings.social_links !== null && !Array.isArray(settings.social_links)
        ? settings.social_links as Record<string, any>
        : {};
      
      setFormData({
        studio_name: settings.studio_name || "",
        owner_name: settings.owner_name || "",
        contact_email: settings.contact_email || "",
        contact_phone: settings.contact_phone || "",
        address: settings.address || "",
        timezone: settings.timezone || "",
        social_links: {
          facebook: socialLinks.facebook || "",
          instagram: socialLinks.instagram || "",
          twitter: socialLinks.twitter || "",
          youtube: socialLinks.youtube || "",
          linkedin: socialLinks.linkedin || "",
        },
      });
      setLogoPreview(settings.studio_logo || "");
      setOwnerPhotoPreview(settings.owner_photo || "");
    }
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOwnerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOwnerPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setOwnerPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let updateData: any = { ...data };

      // Upload logo if changed
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, logoFile);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(fileName);
        updateData.studio_logo = publicUrl;
      }

      // Upload owner photo if changed
      if (ownerPhotoFile) {
        const fileExt = ownerPhotoFile.name.split('.').pop();
        const fileName = `owner-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, ownerPhotoFile);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(fileName);
        updateData.owner_photo = publicUrl;
      }

      const { error } = await supabase
        .from("site_settings")
        .update(updateData)
        .eq("id", settings?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      setLogoFile(null);
      setOwnerPhotoFile(null);
      toast({ title: "Settings updated successfully" });
    },
  });

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Site Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Studio Information</CardTitle>
            <CardDescription>Update your studio details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="studio_logo">Studio Logo</Label>
                <div className="mt-2">
                  {logoPreview && (
                    <div className="relative inline-block mb-2">
                      <img src={logoPreview} alt="Logo preview" className="h-32 w-32 object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div>
                    <Input
                      id="studio_logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="owner_photo">Owner Photo</Label>
                <div className="mt-2">
                  {ownerPhotoPreview && (
                    <div className="relative inline-block mb-2">
                      <img src={ownerPhotoPreview} alt="Owner photo preview" className="h-32 w-32 object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setOwnerPhotoFile(null);
                          setOwnerPhotoPreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div>
                    <Input
                      id="owner_photo"
                      type="file"
                      accept="image/*"
                      onChange={handleOwnerPhotoChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="studio_name">Studio Name</Label>
                <Input
                  id="studio_name"
                  value={formData.studio_name}
                  onChange={(e) => setFormData({ ...formData, studio_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="owner_name">Owner Name</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  placeholder="UTC"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Add your social media profile URLs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.social_links.facebook}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.social_links.instagram}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.social_links.twitter}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, twitter: e.target.value }
                  })}
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={formData.social_links.youtube}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, youtube: e.target.value }
                  })}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.social_links.linkedin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_links: { ...formData.social_links, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <Button onClick={() => updateMutation.mutate(formData)} className="w-full">
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminSettings;
