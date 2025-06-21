-- Create demo users SQL script
-- First create the auth users manually in Supabase Dashboard, then run this

-- Update admin role (after creating admin@wordvale.com in auth)
UPDATE users SET 
  role = 'admin', 
  bio = 'WordVale Administrator - Managing the platform',
  full_name = 'Admin User',
  is_verified = true,
  preferred_categories = ARRAY['Technology', 'Business']
WHERE email = 'admin@wordvale.com';

-- Update author role (after creating author@wordvale.com in auth)
UPDATE users SET 
  role = 'author', 
  bio = 'Published author and writing coach',
  full_name = 'Sarah Chen',
  is_verified = true,
  preferred_categories = ARRAY['Writing', 'Self-Help', 'Business']
WHERE email = 'author@wordvale.com';

-- Update user profile (after creating user@wordvale.com in auth)
UPDATE users SET 
  bio = 'Avid reader and book enthusiast',
  full_name = 'Book Worm',
  preferred_categories = ARRAY['Fiction', 'Mystery', 'Romance']
WHERE email = 'user@wordvale.com';

-- Verify the author (get admin and author IDs first)
INSERT INTO author_verifications (user_id, admin_id, verification_type, notes)
SELECT 
  (SELECT id FROM users WHERE email = 'author@wordvale.com'),
  (SELECT id FROM users WHERE email = 'admin@wordvale.com'),
  'verified',
  'Initial verification for demo author'
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'author@wordvale.com')
AND EXISTS (SELECT 1 FROM users WHERE email = 'admin@wordvale.com');
