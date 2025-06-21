-- Update users table to include role
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'author', 'admin'));

-- Create admin user (run after setting up auth)
-- This will be done via the Supabase dashboard or API

-- Update RLS policies to include role-based access
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can update any user" ON users FOR UPDATE USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- Admin-only tables
CREATE TABLE admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'user', 'book', 'review'
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_logs
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can access admin logs
CREATE POLICY "Only admins can access admin logs" ON admin_logs FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- Create indexes for admin functionality
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_books_status ON books(status) WHERE status IS NOT NULL;

-- Add status column to books for admin approval
ALTER TABLE books ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

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
