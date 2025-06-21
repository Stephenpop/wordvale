-- Function to update book average rating
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books 
  SET 
    avg_rating = (
      SELECT COALESCE(AVG(rating::DECIMAL), 0) 
      FROM ratings 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ),
    total_ratings = (
      SELECT COUNT(*) 
      FROM ratings 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update book rating when ratings change
CREATE TRIGGER update_book_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_book_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_books_updated_at BEFORE UPDATE ON user_books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get personalized book recommendations
CREATE OR REPLACE FUNCTION get_personalized_books(user_id_param UUID, limit_param INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  author_id UUID,
  file_url TEXT,
  cover_url TEXT,
  categories TEXT[],
  tags TEXT[],
  total_pages INTEGER,
  avg_rating DECIMAL,
  total_ratings INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  author_username TEXT,
  author_avatar_url TEXT,
  relevance_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_preferences AS (
    SELECT preferred_categories
    FROM users
    WHERE users.id = user_id_param
  ),
  followed_authors AS (
    SELECT following_id
    FROM follows
    WHERE follower_id = user_id_param
  ),
  book_scores AS (
    SELECT 
      b.*,
      u.username as author_username,
      u.avatar_url as author_avatar_url,
      CASE
        WHEN b.author_id IN (SELECT following_id FROM followed_authors) THEN 100
        ELSE 0
      END +
      CASE
        WHEN b.categories && (SELECT preferred_categories FROM user_preferences) THEN 50
        ELSE 0
      END +
      CASE
        WHEN b.avg_rating >= 4.0 THEN 25
        WHEN b.avg_rating >= 3.5 THEN 15
        WHEN b.avg_rating >= 3.0 THEN 5
        ELSE 0
      END as relevance_score
    FROM books b
    JOIN users u ON b.author_id = u.id
    WHERE b.status = 'approved'
    AND b.id NOT IN (
      SELECT book_id 
      FROM user_books 
      WHERE user_books.user_id = user_id_param 
      AND finished_reading_at IS NOT NULL
    )
  )
  SELECT 
    bs.id,
    bs.title,
    bs.description,
    bs.author_id,
    bs.file_url,
    bs.cover_url,
    bs.categories,
    bs.tags,
    bs.total_pages,
    bs.avg_rating,
    bs.total_ratings,
    bs.created_at,
    bs.author_username,
    bs.author_avatar_url,
    bs.relevance_score
  FROM book_scores bs
  ORDER BY bs.relevance_score DESC, bs.avg_rating DESC, bs.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  admin_id_param UUID,
  action_param TEXT,
  target_type_param TEXT,
  target_id_param UUID DEFAULT NULL,
  details_param JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (admin_id_param, action_param, target_type_param, target_id_param, details_param);
END;
$$ LANGUAGE plpgsql;
