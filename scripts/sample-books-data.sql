-- Insert sample books (run after demo users are created)
-- This will populate the library with some test content

INSERT INTO books (
  id,
  title, 
  description, 
  author_id, 
  file_url, 
  cover_url, 
  category_id,
  tags, 
  total_pages, 
  status,
  avg_rating,
  total_ratings
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'The Digital Renaissance',
  'A comprehensive guide to the modern digital transformation and its impact on society. This book explores how technology is reshaping our world, from artificial intelligence and machine learning to blockchain and the Internet of Things.',
  (SELECT id FROM users WHERE email = 'author@wordvale.com'),
  '/books/digital-renaissance.pdf',
  '/placeholder.svg?height=400&width=300',
  (SELECT id FROM categories WHERE name = 'Technology'),
  ARRAY['digital', 'transformation', 'AI', 'blockchain'],
  320,
  'approved',
  4.5,
  127
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Mysteries of the Quantum Realm',
  'Explore the fascinating world of quantum physics and its implications for our understanding of reality. A journey through the strange and wonderful world of quantum mechanics.',
  (SELECT id FROM users WHERE email = 'author@wordvale.com'),
  '/books/quantum-mysteries.pdf',
  '/placeholder.svg?height=400&width=300',
  (SELECT id FROM categories WHERE name = 'Science'),
  ARRAY['quantum', 'physics', 'science', 'reality'],
  280,
  'approved',
  4.8,
  89
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'The Art of Mindful Living',
  'Discover practical techniques for incorporating mindfulness into your daily routine. Learn how to find peace and clarity in our fast-paced world.',
  (SELECT id FROM users WHERE email = 'author@wordvale.com'),
  '/books/mindful-living.pdf',
  '/placeholder.svg?height=400&width=300',
  (SELECT id FROM categories WHERE name = 'Self-Help'),
  ARRAY['mindfulness', 'wellness', 'meditation', 'peace'],
  240,
  'approved',
  4.3,
  156
);

-- Insert some sample ratings
INSERT INTO ratings (user_id, book_id, rating, review) VALUES
(
  (SELECT id FROM users WHERE email = 'user@wordvale.com'),
  '550e8400-e29b-41d4-a716-446655440001',
  5,
  'Excellent insights into digital transformation. Highly recommended for anyone interested in technology!'
),
(
  (SELECT id FROM users WHERE email = 'user@wordvale.com'),
  '550e8400-e29b-41d4-a716-446655440002',
  5,
  'Mind-blowing explanations of quantum physics! Made complex concepts accessible.'
),
(
  (SELECT id FROM users WHERE email = 'admin@wordvale.com'),
  '550e8400-e29b-41d4-a716-446655440003',
  4,
  'Very helpful for developing mindfulness practices. Great practical advice.'
);

-- Insert some reading progress
INSERT INTO user_books (user_id, book_id, reading_progress, current_page, is_favorite, started_reading_at) VALUES
(
  (SELECT id FROM users WHERE email = 'user@wordvale.com'),
  '550e8400-e29b-41d4-a716-446655440001',
  65,
  208,
  true,
  NOW() - INTERVAL '5 days'
),
(
  (SELECT id FROM users WHERE email = 'user@wordvale.com'),
  '550e8400-e29b-41d4-a716-446655440003',
  30,
  72,
  false,
  NOW() - INTERVAL '2 days'
);
