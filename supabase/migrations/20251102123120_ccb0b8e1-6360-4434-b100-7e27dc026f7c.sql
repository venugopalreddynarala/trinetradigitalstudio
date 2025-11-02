-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pages table for editable content
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_html TEXT,
  hero_image TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gallery items table
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  thumb_url TEXT,
  tags TEXT[] DEFAULT '{}',
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  display_order INTEGER DEFAULT 0
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  summary TEXT,
  description_html TEXT,
  thumbnail_url TEXT,
  youtube_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past', 'live')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_flag BOOLEAN DEFAULT false
);

-- Create site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_name TEXT DEFAULT 'Trinetra Digital Studio',
  owner_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  social_links JSONB DEFAULT '{}',
  maps_coordinates TEXT,
  timezone TEXT DEFAULT 'UTC',
  owner_photo TEXT,
  studio_logo TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default site settings
INSERT INTO public.site_settings (studio_name, owner_name, contact_email, contact_phone, address)
VALUES ('Trinetra Digital Studio', 'Studio Owner', 'contact@trinetradigital.com', '+1 (555) 123-4567', '123 Photography Lane, Creative City, CC 12345');

-- Insert default pages
INSERT INTO public.pages (slug, title, content_html, visible) VALUES
('home', 'Home', '<h2>Welcome to Trinetra Digital Studio</h2><p>Capturing moments, creating memories.</p>', true),
('about', 'About Us', '<h2>Our Story</h2><p>We are passionate photographers dedicated to capturing life''s precious moments.</p>', true),
('contact', 'Contact', '<p>Get in touch with us for bookings and inquiries.</p>', true);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can read pages" ON public.pages
  FOR SELECT USING (visible = true);

CREATE POLICY "Public can read gallery items" ON public.gallery_items
  FOR SELECT USING (true);

CREATE POLICY "Public can read events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- RLS Policies for authenticated admin users
CREATE POLICY "Admins can do everything on pages" ON public.pages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can do everything on gallery" ON public.gallery_items
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can do everything on events" ON public.events
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can read contact messages" ON public.contact_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can do everything on settings" ON public.site_settings
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();