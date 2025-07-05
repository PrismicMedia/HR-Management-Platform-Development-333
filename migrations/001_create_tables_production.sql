-- Production Database Setup - Clean Tables Without Sample Data
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

-- Performance review periods table
CREATE TABLE IF NOT EXISTS review_periods_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  description TEXT,
  created_by UUID REFERENCES users_hr_dash(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance reviews table
CREATE TABLE IF NOT EXISTS performance_reviews_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES users_hr_dash(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users_hr_dash(id),
  review_period_id UUID REFERENCES review_periods_hr_dash(id),
  self_review JSONB,
  manager_review JSONB,
  peer_reviews JSONB DEFAULT '[]'::jsonb,
  goals JSONB DEFAULT '[]'::jsonb,
  overall_rating DECIMAL(3,2),
  status VARCHAR(20) DEFAULT 'pending',
  self_review_completed_at TIMESTAMP WITH TIME ZONE,
  manager_review_completed_at TIMESTAMP WITH TIME ZONE,
  final_review_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Review templates table
CREATE TABLE IF NOT EXISTS review_templates_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'self', 'manager', 'peer', '360'
  questions JSONB NOT NULL,
  rating_scale JSONB DEFAULT '{"min": 1, "max": 5, "labels": ["Poor", "Below Average", "Average", "Good", "Excellent"]}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users_hr_dash(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES users_hr_dash(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'performance', 'development', 'behavioral'
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_by UUID REFERENCES users_hr_dash(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Global permissions table
CREATE TABLE IF NOT EXISTS global_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'Custom',
  is_system BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users_hr_dash(id),
  updated_by UUID REFERENCES users_hr_dash(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(50) NOT NULL,
  permission_id UUID REFERENCES global_permissions(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users_hr_dash(id),
  updated_by UUID REFERENCES users_hr_dash(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role, permission_id)
);

-- Permission audit log
CREATE TABLE IF NOT EXISTS permission_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'ENABLE', 'DISABLE'
  permission_key VARCHAR(100),
  role VARCHAR(50),
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES users_hr_dash(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  session_id VARCHAR(255),
  risk_level VARCHAR(20) DEFAULT 'LOW',
  affected_users INTEGER DEFAULT 0
);

-- User activity log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_hr_dash(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- 'user', 'role', 'permission', 'system'
  resource_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System configuration log
CREATE TABLE IF NOT EXISTS system_config_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(255) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES users_hr_dash(id),
  change_reason TEXT,
  environment VARCHAR(50) DEFAULT 'production',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permission usage statistics
CREATE TABLE IF NOT EXISTS permission_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(permission_key, role, usage_date)
);

-- Enable RLS on all tables
ALTER TABLE users_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_periods_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_templates_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_usage_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users
CREATE POLICY "Users can view own profile" ON users_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users_hr_dash FOR UPDATE USING (true);
CREATE POLICY "Allow admin to manage users" ON users_hr_dash FOR ALL USING (true);

-- RLS Policies - Leave requests
CREATE POLICY "Users can view own leave requests" ON leave_requests_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can create own leave requests" ON leave_requests_hr_dash FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own leave requests" ON leave_requests_hr_dash FOR UPDATE USING (true);
CREATE POLICY "Allow admin to manage leave requests" ON leave_requests_hr_dash FOR ALL USING (true);

-- RLS Policies - Skills
CREATE POLICY "Users can view own skills" ON skills_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON skills_hr_dash FOR ALL USING (true);

-- RLS Policies - Tasks
CREATE POLICY "Users can view own tasks" ON tasks_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can manage own tasks" ON tasks_hr_dash FOR ALL USING (true);

-- RLS Policies - KPIs
CREATE POLICY "Users can view own KPIs" ON kpis_hr_dash FOR SELECT USING (true);
CREATE POLICY "Users can manage own KPIs" ON kpis_hr_dash FOR ALL USING (true);

-- RLS Policies - Review periods
CREATE POLICY "Users can view active review periods" ON review_periods_hr_dash FOR SELECT USING (status = 'active' OR status = 'completed');
CREATE POLICY "Managers can manage review periods" ON review_periods_hr_dash FOR ALL USING (true);

-- RLS Policies - Performance reviews
CREATE POLICY "Users can view own performance reviews" ON performance_reviews_hr_dash FOR SELECT USING (employee_id = auth.uid() OR reviewer_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON performance_reviews_hr_dash FOR UPDATE USING (employee_id = auth.uid() OR reviewer_id = auth.uid());
CREATE POLICY "Managers can view team reviews" ON performance_reviews_hr_dash FOR ALL USING (true);

-- RLS Policies - Review templates
CREATE POLICY "Users can view active templates" ON review_templates_hr_dash FOR SELECT USING (is_active = true);
CREATE POLICY "Managers can manage templates" ON review_templates_hr_dash FOR ALL USING (true);

-- RLS Policies - Goals
CREATE POLICY "Users can view own goals" ON goals_hr_dash FOR SELECT USING (employee_id = auth.uid() OR created_by = auth.uid());
CREATE POLICY "Users can manage own goals" ON goals_hr_dash FOR ALL USING (employee_id = auth.uid() OR created_by = auth.uid());

-- RLS Policies - Global permissions
CREATE POLICY "Superadmins can manage global permissions" ON global_permissions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);
CREATE POLICY "All users can view active permissions" ON global_permissions FOR SELECT USING (is_active = true);

-- RLS Policies - Role permissions
CREATE POLICY "Superadmins can manage role permissions" ON role_permissions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);
CREATE POLICY "Users can view role permissions" ON role_permissions FOR SELECT USING (true);

-- RLS Policies - Permission audit log
CREATE POLICY "Superadmins can view audit logs" ON permission_audit_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);
CREATE POLICY "System can insert audit logs" ON permission_audit_log FOR INSERT WITH CHECK (true);

-- RLS Policies - User activity log
CREATE POLICY "Superadmins can view all activity logs" ON user_activity_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);
CREATE POLICY "Users can view own activity logs" ON user_activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert activity logs" ON user_activity_log FOR INSERT WITH CHECK (true);

-- RLS Policies - System config log
CREATE POLICY "Superadmins can view system config logs" ON system_config_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);
CREATE POLICY "System can manage config logs" ON system_config_log FOR ALL WITH CHECK (true);

-- RLS Policies - Permission usage stats
CREATE POLICY "Managers can view usage stats" ON permission_usage_stats FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role IN ('superadmin', 'manager')
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users_hr_dash(email);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests_hr_dash(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills_hr_dash(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks_hr_dash(user_id);
CREATE INDEX IF NOT EXISTS idx_kpis_user_id ON kpis_hr_dash(user_id);
CREATE INDEX IF NOT EXISTS idx_review_periods_status ON review_periods_hr_dash(status);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee ON performance_reviews_hr_dash(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_reviewer ON performance_reviews_hr_dash(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_period ON performance_reviews_hr_dash(review_period_id);
CREATE INDEX IF NOT EXISTS idx_goals_employee ON goals_hr_dash(employee_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals_hr_dash(status);
CREATE INDEX IF NOT EXISTS idx_global_permissions_key ON global_permissions(key);
CREATE INDEX IF NOT EXISTS idx_global_permissions_category ON global_permissions(category);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permission_audit_log_action ON permission_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_permission_audit_log_changed_by ON permission_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_system_config_log_config_key ON system_config_log(config_key);
CREATE INDEX IF NOT EXISTS idx_permission_usage_stats_permission ON permission_usage_stats(permission_key);
CREATE INDEX IF NOT EXISTS idx_permission_usage_stats_date ON permission_usage_stats(usage_date);