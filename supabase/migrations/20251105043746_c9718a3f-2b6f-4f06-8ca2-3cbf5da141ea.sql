-- Drop the problematic admin_users table
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Create a simple profiles table for admin flags
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update RLS policies to use profiles table instead of admin_users

-- Contact messages policies
DROP POLICY IF EXISTS "Admins can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;

CREATE POLICY "Admins can read contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Events policies
DROP POLICY IF EXISTS "Admins can do everything on events" ON public.events;

CREATE POLICY "Admins can do everything on events"
  ON public.events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Gallery policies
DROP POLICY IF EXISTS "Admins can do everything on gallery" ON public.gallery_items;

CREATE POLICY "Admins can do everything on gallery"
  ON public.gallery_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Pages policies
DROP POLICY IF EXISTS "Admins can do everything on pages" ON public.pages;

CREATE POLICY "Admins can do everything on pages"
  ON public.pages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Site settings policies
DROP POLICY IF EXISTS "Admins can do everything on settings" ON public.site_settings;

CREATE POLICY "Admins can do everything on settings"
  ON public.site_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );