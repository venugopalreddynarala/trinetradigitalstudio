-- Create storage bucket for event thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-thumbnails',
  'event-thumbnails',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Allow public access to view thumbnails
CREATE POLICY "Public can view event thumbnails"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-thumbnails');

-- Allow admins to upload thumbnails
CREATE POLICY "Admins can upload event thumbnails"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'event-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update thumbnails
CREATE POLICY "Admins can update event thumbnails"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'event-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete thumbnails
CREATE POLICY "Admins can delete event thumbnails"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'event-thumbnails' 
  AND public.has_role(auth.uid(), 'admin')
);