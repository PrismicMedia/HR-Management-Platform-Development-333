-- Production Cleanup Script
-- Run this to remove all sample data from existing database

-- Clear all sample data from tables
DELETE FROM permission_audit_log;
DELETE FROM user_activity_log;
DELETE FROM system_config_log;
DELETE FROM permission_usage_stats;
DELETE FROM role_permissions;
DELETE FROM global_permissions;
DELETE FROM goals_hr_dash;
DELETE FROM review_templates_hr_dash;
DELETE FROM performance_reviews_hr_dash;
DELETE FROM review_periods_hr_dash;
DELETE FROM kpis_hr_dash;
DELETE FROM tasks_hr_dash;
DELETE FROM skills_hr_dash;
DELETE FROM leave_requests_hr_dash;
DELETE FROM users_hr_dash;

-- Reset sequences/counters if needed
-- (PostgreSQL with UUID doesn't need sequence resets)

-- Verify all tables are empty
SELECT 
  schemaname,
  tablename,
  n_tup_ins as "rows"
FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE '%_hr_dash'
ORDER BY tablename;

-- Show confirmation message
DO $$
BEGIN
  RAISE NOTICE 'Production cleanup completed successfully!';
  RAISE NOTICE 'All sample data has been removed.';
  RAISE NOTICE 'Database is ready for production use.';
END $$;