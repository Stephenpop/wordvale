-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books', 'books', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for books
CREATE POLICY "Anyone can view book files" ON storage.objects 
FOR SELECT USING (bucket_id = 'books');

CREATE POLICY "Authors can upload books" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'books' AND 
  auth.uid() IN (SELECT id FROM users WHERE role IN ('author', 'admin'))
);

CREATE POLICY "Authors can update their books" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'books' AND 
  auth.uid() IN (SELECT id FROM users WHERE role IN ('author', 'admin'))
);

CREATE POLICY "Authors can delete their books" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'books' AND 
  auth.uid() IN (SELECT id FROM users WHERE role IN ('author', 'admin'))
);

-- Storage policies for covers
CREATE POLICY "Anyone can view covers" ON storage.objects 
FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Authors can upload covers" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'covers' AND 
  auth.uid() IN (SELECT id FROM users WHERE role IN ('author', 'admin'))
);

CREATE POLICY "Authors can update covers" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'covers' AND 
  auth.uid() IN (SELECT id FROM users WHERE role IN ('author', 'admin'))
);

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their avatar" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their avatar" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their avatar" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
