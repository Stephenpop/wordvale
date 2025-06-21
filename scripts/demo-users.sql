-- Insert demo users (run after authentication is set up)
-- Note: These should be created through the Supabase Auth API or dashboard first

-- Demo Admin User
INSERT INTO users (id, email, username, role, bio, preferred_categories) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@wordvale.com', 'admin', 'admin', 'WordVale Administrator', ARRAY['Technology', 'Business'])
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  bio = 'WordVale Administrator';

-- Demo Regular User
INSERT INTO users (id, email, username, role, bio, preferred_categories) VALUES
  ('00000000-0000-0000-0000-000000000002', 'user@wordvale.com', 'bookworm', 'user', 'Avid reader and book enthusiast', ARRAY['Fiction', 'Mystery', 'Romance'])
ON CONFLICT (id) DO UPDATE SET
  role = 'user',
  bio = 'Avid reader and book enthusiast';

-- Demo Author User
INSERT INTO users (id, email, username, role, bio, preferred_categories) VALUES
  ('00000000-0000-0000-0000-000000000003', 'author@wordvale.com', 'author_sarah', 'author', 'Published author and writing coach', ARRAY['Writing', 'Self-Help', 'Business'])
ON CONFLICT (id) DO UPDATE SET
  role = 'author',
  bio = 'Published author and writing coach';
