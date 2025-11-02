import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminMessages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

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

  const { data: messages = [] } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read_flag: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({
        title: "Message marked as read",
      });
    },
  });

  if (!user) {
    return <div>Loading...</div>;
  }

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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Contact Messages</h1>

        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className={!message.read_flag ? "border-accent" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {message.name}
                        {!message.read_flag && (
                          <Badge variant="default">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {message.email} • {format(new Date(message.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </div>
                    {!message.read_flag && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsReadMutation.mutate(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {message.subject && (
                    <div className="mb-2">
                      <strong>Subject:</strong> {message.subject}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-muted-foreground">
                    {message.message}
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <a href={`mailto:${message.email}?subject=Re: ${message.subject || "Your message"}`}>
                        Reply via Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMessages;
