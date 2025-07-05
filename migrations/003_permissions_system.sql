-- Enhanced Permissions System Migration
-- This creates tables for dynamic permission management

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
  user_agent TEXT
);

-- Enable RLS on all tables
ALTER TABLE global_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for global_permissions
CREATE POLICY "Superadmins can manage global permissions" ON global_permissions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

CREATE POLICY "All users can view active permissions" ON global_permissions FOR SELECT
USING (is_active = true);

-- RLS Policies for role_permissions
CREATE POLICY "Superadmins can manage role permissions" ON role_permissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

CREATE POLICY "Users can view role permissions" ON role_permissions FOR SELECT
USING (true);

-- RLS Policies for permission_audit_log
CREATE POLICY "Superadmins can view audit logs" ON permission_audit_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

CREATE POLICY "System can insert audit logs" ON permission_audit_log FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_global_permissions_key ON global_permissions(key);
CREATE INDEX IF NOT EXISTS idx_global_permissions_category ON global_permissions(category);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permission_audit_log_action ON permission_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_permission_audit_log_changed_by ON permission_audit_log(changed_by);

-- Insert default system permissions
INSERT INTO global_permissions (key, label, description, category, is_system) VALUES
-- Profile & Personal
('view_own_profile', 'View Own Profile', 'Access personal profile information', 'Profile & Personal', true),
('edit_own_profile', 'Edit Own Profile', 'Modify personal information', 'Profile & Personal', true),
('view_own_data', 'View Own Data', 'Access personal records and data', 'Profile & Personal', true),

-- Leave Management
('request_leave', 'Request Leave', 'Submit leave requests', 'Leave Management', true),
('view_own_leave', 'View Own Leave', 'View personal leave history', 'Leave Management', true),
('endorse_leave', 'Endorse Leave', 'Recommend leave approvals', 'Leave Management', true),
('approve_leave', 'Approve Leave', 'Final leave approval authority', 'Leave Management', true),

-- Task Management
('view_own_tasks', 'View Own Tasks', 'Access assigned tasks', 'Task Management', true),
('update_tasks', 'Update Tasks', 'Modify task status and details', 'Task Management', true),
('assign_tasks', 'Assign Tasks', 'Assign tasks to team members', 'Task Management', true),
('manage_all_tasks', 'Manage All Tasks', 'Full task management access', 'Task Management', true),

-- Team & Users
('view_team', 'View Team', 'Access team member information', 'Team & Users', true),
('manage_team', 'Manage Team', 'Add, edit, remove team members', 'Team & Users', true),
('view_all_users', 'View All Users', 'Access all user profiles', 'Team & Users', true),
('manage_users', 'Manage Users', 'Full user management capabilities', 'Team & Users', true),

-- Reports & Analytics
('view_reports', 'View Reports', 'Access reporting dashboard', 'Reports & Analytics', true),
('generate_reports', 'Generate Reports', 'Create custom reports', 'Reports & Analytics', true),
('view_analytics', 'View Analytics', 'Access system analytics', 'Reports & Analytics', true),
('export_data', 'Export Data', 'Export system data', 'Reports & Analytics', true),

-- System Administration
('system_settings', 'System Settings', 'Modify system configuration', 'System Administration', true),
('user_roles', 'User Roles', 'Manage user roles and permissions', 'System Administration', true),
('audit_logs', 'Audit Logs', 'View system audit trails', 'System Administration', true),
('backup_restore', 'Backup & Restore', 'System backup operations', 'System Administration', true),
('manage_permissions', 'Manage Permissions', 'Add, edit, delete permissions', 'System Administration', true),
('view_sops', 'View SOPs', 'View standard operating procedures', 'System Documentation', true),
('manage_sops', 'Manage SOPs', 'Create and edit SOPs', 'System Documentation', true)
ON CONFLICT (key) DO NOTHING;

-- Set up default role permissions
-- Staff permissions
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'staff', id, true FROM global_permissions 
  WHERE key IN (
  'view_own_profile', 'edit_own_profile', 'view_own_data',
  'request_leave', 'view_own_leave',
  'view_own_tasks', 'update_tasks',
  'view_sops'
  )
ON CONFLICT (role, permission_id) DO NOTHING;

-- Team Leader permissions
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'team_leader', id, true FROM global_permissions 
  WHERE key IN (
  'view_own_profile', 'edit_own_profile', 'view_own_data',
  'request_leave', 'view_own_leave', 'endorse_leave',
  'view_own_tasks', 'update_tasks', 'assign_tasks',
  'view_team',
  'view_sops'
  )
ON CONFLICT (role, permission_id) DO NOTHING;

-- Manager permissions
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'manager', id, true FROM global_permissions 
  WHERE key IN (
  'view_own_profile', 'edit_own_profile', 'view_own_data',
  'request_leave', 'view_own_leave', 'endorse_leave', 'approve_leave',
  'view_own_tasks', 'update_tasks', 'assign_tasks', 'manage_all_tasks',
  'view_team', 'manage_team',
  'view_reports', 'generate_reports', 'view_analytics',
  'view_sops', 'manage_sops'
  )
ON CONFLICT (role, permission_id) DO NOTHING;

-- Superadmin permissions (all permissions)
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'superadmin', id, true FROM global_permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Function to log permission changes
CREATE OR REPLACE FUNCTION log_permission_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO permission_audit_log (
    action,
    permission_key,
    role,
    old_value,
    new_value,
    changed_by
  ) VALUES (
    TG_OP,
    COALESCE(NEW.role, OLD.role),
    COALESCE((SELECT key FROM global_permissions WHERE id = COALESCE(NEW.permission_id, OLD.permission_id)), 'unknown'),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for permission audit logging
DROP TRIGGER IF EXISTS trigger_log_role_permission_changes ON role_permissions;
CREATE TRIGGER trigger_log_role_permission_changes
  AFTER INSERT OR UPDATE OR DELETE ON role_permissions
  FOR EACH ROW EXECUTE FUNCTION log_permission_change();

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(user_id UUID, permission_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  has_perm BOOLEAN := FALSE;
BEGIN
  -- Get user role
  SELECT role INTO user_role FROM users_hr_dash WHERE id = user_id;
  
  -- Check if user has the permission
  SELECT EXISTS (
    SELECT 1 
    FROM role_permissions rp
    JOIN global_permissions gp ON rp.permission_id = gp.id
    WHERE rp.role = user_role 
    AND gp.key = permission_key 
    AND rp.enabled = true
    AND gp.is_active = true
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;