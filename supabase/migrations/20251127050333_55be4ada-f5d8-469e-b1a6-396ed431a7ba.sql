-- Create featured_work table
CREATE TABLE public.featured_work (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_work ENABLE ROW LEVEL SECURITY;

-- Public can read visible featured work
CREATE POLICY "Public can read visible featured work"
  ON public.featured_work FOR SELECT
  USING (visible = true);

-- Admins can do everything on featured work
CREATE POLICY "Admins can do everything on featured work"
  ON public.featured_work FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default featured work items
INSERT INTO public.featured_work (title, description, image_url, display_order) VALUES
  ('Wedding Photography', 'Romantic & Timeless', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 1),
  ('Professional Portraits', 'Elegant & Refined', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800', 2),
  ('Landscape & Nature', 'Breathtaking & Serene', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 3);