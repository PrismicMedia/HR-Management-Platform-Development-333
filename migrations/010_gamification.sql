-- Gamification Points Table
CREATE TABLE IF NOT EXISTS gamification_points_hr_dash (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_hr_dash(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE gamification_points_hr_dash ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own points" ON gamification_points_hr_dash
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all points" ON gamification_points_hr_dash
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users_hr_dash WHERE id = auth.uid() AND role = 'superadmin')
    );
