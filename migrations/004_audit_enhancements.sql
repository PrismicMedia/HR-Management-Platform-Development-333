-- Enhanced Audit System Migration
-- Adds comprehensive audit tracking for all system changes

-- Enhanced audit log table with more detailed tracking
ALTER TABLE permission_audit_log ADD COLUMN IF NOT EXISTS details JSONB;
ALTER TABLE permission_audit_log ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
ALTER TABLE permission_audit_log ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) DEFAULT 'LOW';
ALTER TABLE permission_audit_log ADD COLUMN IF NOT EXISTS affected_users INTEGER DEFAULT 0;

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

-- Enable RLS on new tables
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_usage_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Superadmins can view all activity logs" ON user_activity_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

CREATE POLICY "Users can view own activity logs" ON user_activity_log FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert activity logs" ON user_activity_log FOR INSERT
WITH CHECK (true);

CREATE POLICY "Superadmins can view system config logs" ON system_config_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

CREATE POLICY "System can manage config logs" ON system_config_log FOR ALL
WITH CHECK (true);

CREATE POLICY "Managers can view usage stats" ON permission_usage_stats FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users_hr_dash 
    WHERE id = auth.uid() AND role IN ('superadmin', 'manager')
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_system_config_log_config_key ON system_config_log(config_key);
CREATE INDEX IF NOT EXISTS idx_permission_usage_stats_permission ON permission_usage_stats(permission_key);
CREATE INDEX IF NOT EXISTS idx_permission_usage_stats_date ON permission_usage_stats(usage_date);

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
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activity_log (
    user_id, action, resource_type, resource_id,
    old_values, new_values, ip_address, user_agent, session_id
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_ip_address, p_user_agent, p_session_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track permission usage
CREATE OR REPLACE FUNCTION track_permission_usage(
  p_permission_key VARCHAR(100),
  p_role VARCHAR(50),
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO permission_usage_stats (permission_key, role, usage_count, unique_users)
  VALUES (p_permission_key, p_role, 1, 1)
  ON CONFLICT (permission_key, role, usage_date)
  DO UPDATE SET
    usage_count = permission_usage_stats.usage_count + 1,
    updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate audit report
CREATE OR REPLACE FUNCTION generate_audit_report(
  start_date DATE,
  end_date DATE,
  report_type VARCHAR(50) DEFAULT 'summary'
)
RETURNS TABLE (
  metric VARCHAR(100),
  value BIGINT,
  details JSONB
) AS $$
BEGIN
  IF report_type = 'summary' THEN
    RETURN QUERY
    SELECT 
      'total_permission_changes'::VARCHAR(100) as metric,
      COUNT(*)::BIGINT as value,
      json_build_object(
        'period', json_build_object('start', start_date, 'end', end_date),
        'breakdown', json_object_agg(action, cnt)
      )::JSONB as details
    FROM (
      SELECT action, COUNT(*) as cnt
      FROM permission_audit_log
      WHERE changed_at::DATE BETWEEN start_date AND end_date
      GROUP BY action
    ) sub;
    
    RETURN QUERY
    SELECT 
      'active_users'::VARCHAR(100) as metric,
      COUNT(DISTINCT user_id)::BIGINT as value,
      json_build_object(
        'period', json_build_object('start', start_date, 'end', end_date)
      )::JSONB as details
    FROM user_activity_log
    WHERE created_at::DATE BETWEEN start_date AND end_date;
    
  ELSIF report_type = 'security' THEN
    RETURN QUERY
    SELECT 
      'high_risk_changes'::VARCHAR(100) as metric,
      COUNT(*)::BIGINT as value,
      json_build_object(
        'period', json_build_object('start', start_date, 'end', end_date),
        'actions', array_agg(DISTINCT action)
      )::JSONB as details
    FROM permission_audit_log
    WHERE changed_at::DATE BETWEEN start_date AND end_date
    AND risk_level = 'HIGH';
  END IF;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample audit data for testing
INSERT INTO user_activity_log (user_id, action, resource_type, resource_id, ip_address)
SELECT 
  u.id,
  'LOGIN',
  'session',
  'sess_' || generate_random_uuid(),
  '192.168.1.' || (100 + (random() * 50)::int)::inet
FROM users_hr_dash u
WHERE u.role IN ('superadmin', 'manager')
LIMIT 5;

INSERT INTO permission_usage_stats (permission_key, role, usage_count, unique_users)
VALUES 
  ('view_reports', 'manager', 25, 5),
  ('approve_leave', 'manager', 15, 3),
  ('manage_users', 'superadmin', 10, 1),
  ('view_team', 'team_leader', 45, 8),
  ('request_leave', 'staff', 120, 35)
ON CONFLICT (permission_key, role, usage_date) DO NOTHING;

-- Update existing audit logs with enhanced data
UPDATE permission_audit_log SET
  risk_level = CASE 
    WHEN action IN ('DELETE', 'DISABLE') AND permission_key LIKE '%admin%' THEN 'HIGH'
    WHEN action IN ('CREATE', 'ENABLE') AND permission_key LIKE '%manage%' THEN 'MEDIUM'
    ELSE 'LOW'
  END,
  affected_users = CASE
    WHEN role = 'superadmin' THEN 1
    WHEN role = 'manager' THEN 5
    WHEN role = 'team_leader' THEN 15
    WHEN role = 'staff' THEN 50
    ELSE 0
  END
WHERE risk_level IS NULL;