-- Performance Reviews Migration
-- Add performance review tables and relationships

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

-- Enable RLS on all tables
ALTER TABLE review_periods_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_templates_hr_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals_hr_dash ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review periods
CREATE POLICY "Users can view active review periods" ON review_periods_hr_dash 
    FOR SELECT USING (status = 'active' OR status = 'completed');
CREATE POLICY "Managers can manage review periods" ON review_periods_hr_dash 
    FOR ALL USING (true);

-- RLS Policies for performance reviews
CREATE POLICY "Users can view own performance reviews" ON performance_reviews_hr_dash 
    FOR SELECT USING (employee_id = auth.uid() OR reviewer_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON performance_reviews_hr_dash 
    FOR UPDATE USING (employee_id = auth.uid() OR reviewer_id = auth.uid());
CREATE POLICY "Managers can view team reviews" ON performance_reviews_hr_dash 
    FOR ALL USING (true);

-- RLS Policies for review templates
CREATE POLICY "Users can view active templates" ON review_templates_hr_dash 
    FOR SELECT USING (is_active = true);
CREATE POLICY "Managers can manage templates" ON review_templates_hr_dash 
    FOR ALL USING (true);

-- RLS Policies for goals
CREATE POLICY "Users can view own goals" ON goals_hr_dash 
    FOR SELECT USING (employee_id = auth.uid() OR created_by = auth.uid());
CREATE POLICY "Users can manage own goals" ON goals_hr_dash 
    FOR ALL USING (employee_id = auth.uid() OR created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_review_periods_status ON review_periods_hr_dash(status);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee ON performance_reviews_hr_dash(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_reviewer ON performance_reviews_hr_dash(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_period ON performance_reviews_hr_dash(review_period_id);
CREATE INDEX IF NOT EXISTS idx_goals_employee ON goals_hr_dash(employee_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals_hr_dash(status);

-- Insert sample review period
INSERT INTO review_periods_hr_dash (name, start_date, end_date, status, description)
VALUES 
('Q1 2024 Performance Review', '2024-01-01', '2024-03-31', 'active', 'Quarterly performance review for Q1 2024'),
('Annual Review 2023', '2023-01-01', '2023-12-31', 'completed', 'Annual performance review for 2023')
ON CONFLICT DO NOTHING;

-- Insert sample review templates
INSERT INTO review_templates_hr_dash (name, type, questions, created_by)
SELECT 
    'Self Assessment Template',
    'self',
    '[
        {"id": 1, "question": "What were your key accomplishments this period?", "type": "textarea"},
        {"id": 2, "question": "Rate your overall performance", "type": "rating"},
        {"id": 3, "question": "What challenges did you face?", "type": "textarea"},
        {"id": 4, "question": "What are your goals for next period?", "type": "textarea"},
        {"id": 5, "question": "Rate your communication skills", "type": "rating"},
        {"id": 6, "question": "Rate your teamwork", "type": "rating"}
    ]'::jsonb,
    u.id
FROM users_hr_dash u 
WHERE u.email = 'admin@agency.com'
ON CONFLICT DO NOTHING;

INSERT INTO review_templates_hr_dash (name, type, questions, created_by)
SELECT 
    'Manager Review Template',
    'manager',
    '[
        {"id": 1, "question": "Employee demonstrates strong technical skills", "type": "rating"},
        {"id": 2, "question": "Employee meets deadlines consistently", "type": "rating"},
        {"id": 3, "question": "Employee shows initiative and proactivity", "type": "rating"},
        {"id": 4, "question": "Areas for improvement", "type": "textarea"},
        {"id": 5, "question": "Employee development recommendations", "type": "textarea"},
        {"id": 6, "question": "Overall performance rating", "type": "rating"}
    ]'::jsonb,
    u.id
FROM users_hr_dash u 
WHERE u.email = 'admin@agency.com'
ON CONFLICT DO NOTHING;

-- Insert sample goals
INSERT INTO goals_hr_dash (employee_id, title, description, category, target_date, status, progress, priority, created_by)
SELECT 
    u.id,
    'Complete React Certification',
    'Obtain React certification to improve frontend development skills',
    'development',
    '2024-06-30',
    'active',
    65,
    'high',
    u.id
FROM users_hr_dash u 
WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

INSERT INTO goals_hr_dash (employee_id, title, description, category, target_date, status, progress, priority, created_by)
SELECT 
    u.id,
    'Improve Code Review Quality',
    'Provide more detailed and constructive code review feedback',
    'performance',
    '2024-04-30',
    'active',
    40,
    'medium',
    u.id
FROM users_hr_dash u 
WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

INSERT INTO goals_hr_dash (employee_id, title, description, category, target_date, status, progress, priority, created_by)
SELECT 
    u.id,
    'Lead Team Project',
    'Successfully lead a major project to demonstrate leadership skills',
    'behavioral',
    '2024-08-31',
    'active',
    20,
    'high',
    u.id
FROM users_hr_dash u 
WHERE u.email = 'john.doe@agency.com'
ON CONFLICT DO NOTHING;

-- Insert sample performance review
INSERT INTO performance_reviews_hr_dash (employee_id, reviewer_id, review_period_id, self_review, manager_review, overall_rating, status)
SELECT 
    emp.id,
    mgr.id,
    rp.id,
    '{
        "responses": [
            {"questionId": 1, "answer": "Successfully delivered 3 major features, improved code quality metrics by 25%"},
            {"questionId": 2, "rating": 4},
            {"questionId": 3, "answer": "Managing time across multiple projects, learning new technologies"},
            {"questionId": 4, "answer": "Focus on backend development, obtain AWS certification"},
            {"questionId": 5, "rating": 4},
            {"questionId": 6, "rating": 5}
        ],
        "completedAt": "2024-02-15T10:00:00Z"
    }'::jsonb,
    '{
        "responses": [
            {"questionId": 1, "rating": 4},
            {"questionId": 2, "rating": 4},
            {"questionId": 3, "rating": 4},
            {"questionId": 4, "answer": "Focus on time management and prioritization skills"},
            {"questionId": 5, "answer": "Consider leadership training, backend specialization"},
            {"questionId": 6, "rating": 4}
        ],
        "completedAt": "2024-02-20T14:30:00Z"
    }'::jsonb,
    4.0,
    'completed'
FROM users_hr_dash emp, users_hr_dash mgr, review_periods_hr_dash rp
WHERE emp.email = 'john.doe@agency.com' 
  AND mgr.email = 'admin@agency.com'
  AND rp.status = 'completed'
ON CONFLICT DO NOTHING;