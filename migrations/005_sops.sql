-- SOPs Management
-- Adds table and policies for standard operating procedures

CREATE TABLE IF NOT EXISTS sops_hr_dash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  department VARCHAR(100),
  created_by UUID REFERENCES users_hr_dash(id),
  updated_by UUID REFERENCES users_hr_dash(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sops_hr_dash ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "All users can view SOPs" ON sops_hr_dash
  FOR SELECT USING (true);

CREATE POLICY "Managers can insert SOPs" ON sops_hr_dash
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_hr_dash
      WHERE id = auth.uid() AND role IN ('manager','superadmin')
    )
  );

CREATE POLICY "Managers can update SOPs" ON sops_hr_dash
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users_hr_dash
      WHERE id = auth.uid() AND role IN ('manager','superadmin')
    )
  );

CREATE POLICY "Managers can delete SOPs" ON sops_hr_dash
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users_hr_dash
      WHERE id = auth.uid() AND role IN ('manager','superadmin')
    )
  );

-- Sample SOP entries
INSERT INTO sops_hr_dash (title, content, department, created_by)
SELECT
  'Code Deployment',
  'Steps for deploying code to production.',
  'Engineering',
  u.id
FROM users_hr_dash u
WHERE u.email = 'admin@agency.com'
ON CONFLICT DO NOTHING;

INSERT INTO sops_hr_dash (title, content, department, created_by)
SELECT
  'New Hire Onboarding',
  'Checklist for onboarding new employees.',
  'HR',
  u.id
FROM users_hr_dash u
WHERE u.email = 'admin@agency.com'
ON CONFLICT DO NOTHING;
