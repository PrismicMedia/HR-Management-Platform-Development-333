-- Default System Permissions Setup for Production
-- Insert only essential system permissions without sample data

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
('manage_permissions', 'Manage Permissions', 'Add, edit, delete permissions', 'System Administration', true)

ON CONFLICT (key) DO NOTHING;

-- Set up default role permissions
-- Staff permissions
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'staff', id, true FROM global_permissions 
WHERE key IN (
  'view_own_profile',
  'edit_own_profile', 
  'view_own_data',
  'request_leave',
  'view_own_leave',
  'view_own_tasks',
  'update_tasks'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- Team Leader permissions
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'team_leader', id, true FROM global_permissions 
WHERE key IN (
  'view_own_profile',
  'edit_own_profile',
  'view_own_data', 
  'request_leave',
  'view_own_leave',
  'endorse_leave',
  'view_own_tasks',
  'update_tasks',
  'assign_tasks',
  'view_team'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- Manager permissions
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'manager', id, true FROM global_permissions 
WHERE key IN (
  'view_own_profile',
  'edit_own_profile',
  'view_own_data',
  'request_leave',
  'view_own_leave', 
  'endorse_leave',
  'approve_leave',
  'view_own_tasks',
  'update_tasks',
  'assign_tasks',
  'manage_all_tasks',
  'view_team',
  'manage_team',
  'view_reports',
  'generate_reports',
  'view_analytics'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- Superadmin permissions (all permissions)
INSERT INTO role_permissions (role, permission_id, enabled)
SELECT 'superadmin', id, true FROM global_permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Create functions for permission management
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
    COALESCE(
      (SELECT key FROM global_permissions WHERE id = COALESCE(NEW.permission_id, OLD.permission_id)),
      'unknown'
    ),
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
  SELECT role INTO user_role 
  FROM users_hr_dash 
  WHERE id = user_id;
  
  -- Check if user has the permission
  SELECT EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN global_permissions gp ON rp.permission_id = gp.id
    WHERE rp.role = user_role 
      AND gp.key = permission_key 
      AND rp.enabled = true 
      AND gp.is_active = true
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action VARCHAR(100),
  p_resource_type VARCHAR(50),
  p_resource_id VARCHAR(255) DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_session_id VARCHAR(255) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activity_log (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    session_id
  ) VALUES (
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent,
    p_session_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track permission usage
CREATE OR REPLACE FUNCTION track_permission_usage(
  p_permission_key VARCHAR(100),
  p_role VARCHAR(50),
  p_user_id UUID
) RETURNS VOID AS $$
BEGIN
  INSERT INTO permission_usage_stats (permission_key, role, usage_count, unique_users)
  VALUES (p_permission_key, p_role, 1, 1)
  ON CONFLICT (permission_key, role, usage_date)
  DO UPDATE SET 
    usage_count = permission_usage_stats.usage_count + 1,
    updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;