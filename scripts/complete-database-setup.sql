-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS user_books CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS background_music CASCADE;
DROP TABLE IF EXISTS author_verifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Categories table (admin managed)
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- icon name for UI
  color TEXT DEFAULT '#6366f1', -- hex color for category
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Background music table (admin managed)
CREATE TABLE background_music (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  file_url TEXT NOT NULL,
  genre TEXT,
  duration INTEGER, -- in seconds
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'author', 'admin')),
  is_verified BOOLEAN DEFAULT false, -- verification badge for authors
  preferred_categories TEXT[] DEFAULT '{}',
  reading_streak INTEGER DEFAULT 0,
  total_books_read INTEGER DEFAULT 0,
  total_reading_time INTEGER DEFAULT 0, -- in minutes
  is_active BOOLEAN DEFAULT true,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Author verifications table
CREATE TABLE author_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES users(id) NOT NULL,
  verification_type TEXT DEFAULT 'verified' CHECK (verification_type IN ('verified', 'featured', 'bestseller')),
  badge_color TEXT DEFAULT '#10b981', -- green for verified
  notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  cover_url TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  total_pages INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_reads INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'taken_down')),
  rejection_reason TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  price DECIMAL(10,2) DEFAULT 0,
  language TEXT DEFAULT 'en',
  isbn TEXT,
  publication_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Follows table
CREATE TABLE follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- User books (reading progress, bookmarks, etc.)
CREATE TABLE user_books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  reading_progress INTEGER DEFAULT 0 CHECK (reading_progress >= 0 AND reading_progress <= 100),
  current_page INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  is_downloaded BOOLEAN DEFAULT false,
  reading_time INTEGER DEFAULT 0, -- in minutes
  notes TEXT,
  started_reading_at TIMESTAMP WITH TIME ZONE,
  finished_reading_at TIMESTAMP WITH TIME ZONE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Bookmarks table (for specific pages/positions)
CREATE TABLE bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  position_data JSONB,
  note TEXT,
  highlight_text TEXT,
  highlight_color TEXT DEFAULT '#fbbf24',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin logs table
CREATE TABLE admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'user', 'book', 'category', 'music'
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, icon, color) VALUES
  ('Fiction', 'Novels, short stories, and fictional works', 'BookOpen', '#8b5cf6'),
  ('Non-Fiction', 'Factual books, biographies, and real-world topics', 'FileText', '#06b6d4'),
  ('Technology', 'Programming, AI, and tech-related books', 'Cpu', '#10b981'),
  ('Business', 'Entrepreneurship, management, and business strategy', 'Briefcase', '#f59e0b'),
  ('Self-Help', 'Personal development and improvement', 'Heart', '#ef4444'),
  ('Science', 'Scientific research, discoveries, and theories', 'Microscope', '#3b82f6'),
  ('History', 'Historical events, periods, and figures', 'Clock', '#92400e'),
  ('Romance', 'Love stories and romantic fiction', 'Heart', '#ec4899'),
  ('Mystery', 'Detective stories, thrillers, and suspense', 'Search', '#374151'),
  ('Fantasy', 'Magic, mythical creatures, and fantasy worlds', 'Sparkles', '#7c3aed'),
  ('Biography', 'Life stories of notable people', 'User', '#059669'),
  ('Health', 'Wellness, fitness, and medical topics', 'Activity', '#dc2626'),
  ('Travel', 'Travel guides, adventures, and cultural exploration', 'MapPin', '#0891b2'),
  ('Cooking', 'Recipes, culinary arts, and food culture', 'ChefHat', '#ea580c'),
  ('Art', 'Visual arts, design, and creative expression', 'Palette', '#c026d3'),
  ('Poetry', 'Poems, verses, and poetic works', 'Feather', '#7c2d12'),
  ('Drama', 'Plays, theatrical works, and dramatic literature', 'Theater', '#be123c'),
  ('Children', 'Books for young readers and children', 'Baby', '#16a34a');

-- Insert sample background music
INSERT INTO background_music (title, artist, file_url, genre, duration) VALUES
  ('Peaceful Piano', 'Ambient Sounds', '/music/peaceful-piano.mp3', 'Ambient', 180),
  ('Forest Rain', 'Nature Sounds', '/music/forest-rain.mp3', 'Nature', 300),
  ('Cafe Jazz', 'Smooth Jazz Collective', '/music/cafe-jazz.mp3', 'Jazz', 240),
  ('Ocean Waves', 'Nature Sounds', '/music/ocean-waves.mp3', 'Nature', 600),
  ('Classical Focus', 'Classical Orchestra', '/music/classical-focus.mp3', 'Classical', 420),
  ('Lo-Fi Study', 'Chill Beats', '/music/lofi-study.mp3', 'Lo-Fi', 360),
  ('Mountain Breeze', 'Nature Sounds', '/music/mountain-breeze.mp3', 'Nature', 480),
  ('Soft Guitar', 'Acoustic Vibes', '/music/soft-guitar.mp3', 'Acoustic', 210);

-- Create indexes for better performance
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE INDEX idx_books_category_id ON books(category_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_avg_rating ON books(avg_rating DESC);
CREATE INDEX idx_books_created_at ON books(created_at DESC);
CREATE INDEX idx_books_is_featured ON books(is_featured);
CREATE INDEX idx_ratings_book_id ON ratings(book_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_user_books_user_id ON user_books(user_id);
CREATE INDEX idx_user_books_book_id ON user_books(book_id);
CREATE INDEX idx_bookmarks_user_book ON bookmarks(user_id, book_id);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_verified ON users(is_verified);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_verifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Categories policies
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Background music policies
CREATE POLICY "Anyone can view active music" ON background_music FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage music" ON background_music FOR ALL USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Books policies
CREATE POLICY "Anyone can view approved books" ON books FOR SELECT USING (
  status = 'approved' OR auth.uid() = author_id OR 
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
CREATE POLICY "Authors can insert their own books" ON books FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their own books" ON books FOR UPDATE USING (
  auth.uid() = author_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
CREATE POLICY "Authors can delete their own books" ON books FOR DELETE USING (
  auth.uid() = author_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Ratings policies
CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can manage their own ratings" ON ratings FOR ALL USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Anyone can view follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their own follows" ON follows FOR ALL USING (auth.uid() = follower_id);

-- User books policies
CREATE POLICY "Users can manage their own reading data" ON user_books FOR ALL USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Admin logs policies
CREATE POLICY "Only admins can access admin logs" ON admin_logs FOR ALL USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- Author verifications policies
CREATE POLICY "Anyone can view verifications" ON author_verifications FOR SELECT USING (true);
CREATE POLICY "Only admins can manage verifications" ON author_verifications FOR ALL USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
