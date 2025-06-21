-- First, create the auth users manually in Supabase Dashboard or via API
-- Then run this script to update their roles

-- Update admin role (after creating admin@wordvale.com in auth)
UPDATE users SET 
  role = 'admin', 
  bio = 'WordVale Administrator - Managing the platform',
  full_name = 'Admin User',
  is_verified = true
WHERE email = 'admin@wordvale.com';

-- Update author role (after creating author@wordvale.com in auth)
UPDATE users SET 
  role = 'author', 
  bio = 'Published author and writing coach',
  full_name = 'Sarah Chen',
  preferred_categories = ARRAY['Writing', 'Self-Help', 'Business']
WHERE email = 'author@wordvale.com';

-- Update user profile (after creating user@wordvale.com in auth)
UPDATE users SET 
  bio = 'Avid reader and book enthusiast',
  full_name = 'Book Worm',
  preferred_categories = ARRAY['Fiction', 'Mystery', 'Romance']
WHERE email = 'user@wordvale.com';

-- Verify the author
INSERT INTO author_verifications (user_id, admin_id, verification_type, notes)
SELECT 
  u.id,
  a.id,
  'verified',
  'Initial verification for demo author'
FROM users u, users a
WHERE u.email = 'author@wordvale.com' 
AND a.email = 'admin@wordvale.com';

-- Update author verification status
UPDATE users SET is_verified = true WHERE email = 'author@wordvale.com';
