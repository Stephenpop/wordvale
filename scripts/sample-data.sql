-- Insert sample users
INSERT INTO users (id, email, username, bio, preferred_categories) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah.chen@example.com', 'sarahchen', 'Tech enthusiast and digital transformation expert', ARRAY['Technology', 'Business']),
  ('550e8400-e29b-41d4-a716-446655440002', 'michael.rodriguez@example.com', 'drrodriguez', 'Quantum physicist and science communicator', ARRAY['Science', 'Physics']),
  ('550e8400-e29b-41d4-a716-446655440003', 'emma.thompson@example.com', 'emmathompson', 'Mindfulness coach and wellness advocate', ARRAY['Self-Help', 'Health']),
  ('550e8400-e29b-41d4-a716-446655440004', 'alex.johnson@example.com', 'alexjohnson', 'Sci-fi author and futurist', ARRAY['Sci-Fi', 'Fiction']),
  ('550e8400-e29b-41d4-a716-446655440005', 'maria.gonzalez@example.com', 'chefmaria', 'Professional chef and culinary explorer', ARRAY['Cooking', 'Travel']),
  ('550e8400-e29b-41d4-a716-446655440006', 'james.wilson@example.com', 'drwilson', 'Psychologist specializing in success and motivation', ARRAY['Psychology', 'Self-Help']);

-- Insert sample books
INSERT INTO books (id, title, description, author_id, file_url, cover_url, categories, tags, total_pages, avg_rating, total_ratings) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'The Digital Renaissance', 'A comprehensive guide to the modern digital transformation and its impact on society.', '550e8400-e29b-41d4-a716-446655440001', '/books/digital-renaissance.pdf', '/covers/digital-renaissance.jpg', ARRAY['Technology', 'Business'], ARRAY['digital', 'transformation', 'future'], 320, 4.5, 127),
  ('650e8400-e29b-41d4-a716-446655440002', 'Mysteries of the Quantum Realm', 'Explore the fascinating world of quantum physics and its implications for our understanding of reality.', '550e8400-e29b-41d4-a716-446655440002', '/books/quantum-mysteries.pdf', '/covers/quantum-mysteries.jpg', ARRAY['Science', 'Physics'], ARRAY['quantum', 'physics', 'science'], 280, 4.8, 89),
  ('650e8400-e29b-41d4-a716-446655440003', 'The Art of Mindful Living', 'Discover practical techniques for incorporating mindfulness into your daily routine.', '550e8400-e29b-41d4-a716-446655440003', '/books/mindful-living.pdf', '/covers/mindful-living.jpg', ARRAY['Self-Help', 'Health'], ARRAY['mindfulness', 'wellness', 'meditation'], 240, 4.3, 156),
  ('650e8400-e29b-41d4-a716-446655440004', 'Echoes of Tomorrow', 'A thrilling sci-fi adventure set in a world where time travel has become reality.', '550e8400-e29b-41d4-a716-446655440004', '/books/echoes-tomorrow.pdf', '/covers/echoes-tomorrow.jpg', ARRAY['Sci-Fi', 'Fiction'], ARRAY['time-travel', 'adventure', 'future'], 380, 4.6, 203),
  ('650e8400-e29b-41d4-a716-446655440005', 'Culinary Adventures Around the World', 'A journey through global cuisines with authentic recipes and cultural stories.', '550e8400-e29b-41d4-a716-446655440005', '/books/culinary-adventures.pdf', '/covers/culinary-adventures.jpg', ARRAY['Cooking', 'Travel'], ARRAY['recipes', 'culture', 'food'], 450, 4.4, 178),
  ('650e8400-e29b-41d4-a716-446655440006', 'The Psychology of Success', 'Understanding the mental patterns and habits that lead to achievement and fulfillment.', '550e8400-e29b-41d4-a716-446655440006', '/books/psychology-success.pdf', '/covers/psychology-success.jpg', ARRAY['Psychology', 'Self-Help'], ARRAY['success', 'psychology', 'motivation'], 300, 4.7, 234);

-- Insert sample ratings
INSERT INTO ratings (user_id, book_id, rating, review) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 5, 'Excellent insights into digital transformation. Highly recommended!'),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 4, 'Great book with practical examples.'),
  ('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 5, 'Mind-blowing explanations of quantum physics!'),
  ('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', 4, 'Very helpful for developing mindfulness practices.'),
  ('550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440004', 5, 'Amazing sci-fi story with great character development.'),
  ('550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440005', 4, 'Love the diverse recipes and cultural insights.');

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample user books (reading progress)
INSERT INTO user_books (user_id, book_id, reading_progress, current_page, is_favorite, started_reading_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 65, 182, true, '2024-01-10 10:00:00'),
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 30, 96, false, '2024-01-12 14:30:00'),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440006', 80, 240, true, '2024-01-08 09:15:00'),
  ('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', 15, 36, false, '2024-01-15 16:45:00'),
  ('550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440004', 45, 171, true, '2024-01-11 11:20:00'),
  ('550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440005', 25, 112, false, '2024-01-13 13:00:00');

-- Insert sample bookmarks
INSERT INTO bookmarks (user_id, book_id, page_number, note) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 150, 'Important quantum entanglement explanation'),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440006', 200, 'Great section on habit formation'),
  ('550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440004', 120, 'Love this character development moment');
