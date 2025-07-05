-- Enable RLS (Row Level Security)
ALTER database SET row_security = on;

-- Users table
CREATE TABLE IF NOT EXISTS users_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  department VARCHAR(100),
  avatar TEXT,
  phone VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  emergency_contact VARCHAR(20),
  bio TEXT,
  leave_balance INTEGER DEFAULT 25,
  join_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_hr_dash(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  half_day BOOLEAN DEFAULT FALSE,
  applied_on DATE DEFAULT CURRENT_DATE,
  approved_by UUID REFERENCES users_hr_dash(id),
  approved_on DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_hr_dash(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 1 AND proficiency <= 4),
  icon VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_hr_dash(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'todo',
  assignee VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- KPIs table
CREATE TABLE IF NOT EXISTS kpis_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_hr_dash(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  current_value DECIMAL(10,2) NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE users_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis_hr_dash ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view own profile" ON users_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users_hr_dash FOR UPDATE USING (true);
CREATE POLICY "Allow admin to manage users" ON users_hr_dash FOR ALL USING (true);

-- Leave requests policies
CREATE POLICY "Users can view own leave requests" ON leave_requests_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can create own leave requests" ON leave_requests_hr_dash FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own leave requests" ON leave_requests_hr_dash FOR UPDATE USING (true);
CREATE POLICY "Allow admin to manage leave requests" ON leave_requests_hr_dash FOR ALL USING (true);

-- Skills policies
CREATE POLICY "Users can view own skills" ON skills_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON skills_hr_dash FOR ALL USING (true);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can manage own tasks" ON tasks_hr_dash FOR ALL USING (true);

-- KPIs policies
CREATE POLICY "Users can view own KPIs" ON kpis_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can manage own KPIs" ON kpis_hr_dash FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users_hr_dash(email);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests_hr_dash(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills_hr_dash(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks_hr_dash(user_id);
CREATE INDEX IF NOT EXISTS idx_kpis_user_id ON kpis_hr_dash(user_id);

-- Insert sample data
INSERT INTO users_hr_dash (email, name, role, department, bio, leave_balance) VALUES
  ('admin@agency.com', 'Admin User', 'superadmin', 'Management', 'System administrator with full access to all features.', 30),
  ('john.doe@agency.com', 'John Doe', 'staff', 'Engineering', 'Senior developer with 5+ years of experience in full-stack development.', 25),
  ('jane.smith@agency.com', 'Jane Smith', 'team_leader', 'Design', 'Lead designer passionate about user experience and interface design.', 28),
  ('mike.johnson@agency.com', 'Mike Johnson', 'manager', 'Marketing', 'Marketing manager with expertise in digital campaigns and analytics.', 30)
ON CONFLICT (email) DO NOTHING;

-- Insert sample leave requests
INSERT INTO leave_requests_hr_dash (user_id, start_date, end_date, days, type, reason, status) 
SELECT 
  u.id, 
  '2024-03-15'::date, 
  '2024-03-17'::date, 
  3, 
  'vacation', 
  'Family vacation', 
  'approved'
FROM users_hr_dash u WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

-- Insert sample skills
INSERT INTO skills_hr_dash (user_id, name, category, proficiency, notes)
SELECT 
  u.id, 
  'React', 
  'Frontend', 
  4, 
  'Expert level with 5+ years of experience'
FROM users_hr_dash u WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

INSERT INTO skills_hr_dash (user_id, name, category, proficiency, notes)
SELECT 
  u.id, 
  'Node.js', 
  'Backend', 
  3, 
  'Advanced level with production experience'
FROM users_hr_dash u WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks_hr_dash (user_id, title, description, due_date, priority, status, assignee, tags)
SELECT 
  u.id, 
  'Complete React Dashboard', 
  'Finish the employee dashboard with all features', 
  '2024-03-20'::date, 
  'high', 
  'inProgress', 
  'John Doe', 
  ARRAY['react', 'dashboard', 'frontend']
FROM users_hr_dash u WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

-- Insert sample KPIs
INSERT INTO kpis_hr_dash (user_id, name, current_value, target_value, unit)
SELECT 
  u.id, 
  'Code Quality', 
  85, 
  90, 
  '%'
FROM users_hr_dash u WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

INSERT INTO kpis_hr_dash (user_id, name, current_value, target_value, unit)
SELECT 
  u.id, 
  'Tasks Completed', 
  23, 
  25, 
  'tasks'
FROM users_hr_dash u WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;