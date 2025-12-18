-- =============================================
-- TRINETRA DIGITAL STUDIO - COMPLETE DATABASE SCHEMA
-- Generated: 2024
-- =============================================

-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =============================================
-- TABLES
-- =============================================

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Site settings table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_name TEXT DEFAULT 'Trinetra Digital Studio',
    studio_logo TEXT,
    owner_name TEXT,
    owner_photo TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    maps_coordinates TEXT,
    timezone TEXT DEFAULT 'UTC',
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pages table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_html TEXT,
    hero_image TEXT,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME WITHOUT TIME ZONE,
    location TEXT,
    summary TEXT,
    description_html TEXT,
    thumbnail_url TEXT,
    youtube_url TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    status TEXT DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Gallery items table
CREATE TABLE public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    thumb_url TEXT,
    type TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'::text[],
    display_order INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact messages table
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read_flag BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Featured work table
CREATE TABLE public.featured_work (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger for site_settings updated_at
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for pages updated_at
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for events updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for featured_work updated_at
CREATE TRIGGER update_featured_work_updated_at
    BEFORE UPDATE ON public.featured_work
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_work ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - PROFILES
-- =============================================

CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- =============================================
-- RLS POLICIES - USER ROLES
-- =============================================

CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - SITE SETTINGS
-- =============================================

CREATE POLICY "Public can read site settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can do everything on settings"
ON public.site_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - PAGES
-- =============================================

CREATE POLICY "Public can read pages"
ON public.pages FOR SELECT
USING (visible = true);

CREATE POLICY "Admins can do everything on pages"
ON public.pages FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - EVENTS
-- =============================================

CREATE POLICY "Public can read events"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Admins can do everything on events"
ON public.events FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - GALLERY ITEMS
-- =============================================

CREATE POLICY "Public can read gallery items"
ON public.gallery_items FOR SELECT
USING (true);

CREATE POLICY "Admins can do everything on gallery"
ON public.gallery_items FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - CONTACT MESSAGES
-- =============================================

CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
ON public.contact_messages FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - FEATURED WORK
-- =============================================

CREATE POLICY "Public can read visible featured work"
ON public.featured_work FOR SELECT
USING (visible = true);

CREATE POLICY "Admins can do everything on featured work"
ON public.featured_work FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('event-thumbnails', 'event-thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- =============================================
-- STORAGE RLS POLICIES
-- =============================================

-- Event thumbnails policies
CREATE POLICY "Public can view event thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-thumbnails');

CREATE POLICY "Admins can upload event thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update event thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete event thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-thumbnails' AND public.has_role(auth.uid(), 'admin'));

-- Site assets policies
CREATE POLICY "Public can view site assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- =============================================
-- DEFAULT DATA (Optional)
-- =============================================

-- Insert default site settings
INSERT INTO public.site_settings (studio_name, timezone)
VALUES ('Trinetra Digital Studio', 'UTC')
ON CONFLICT DO NOTHING;

-- =============================================
-- END OF SCHEMA
-- =============================================
