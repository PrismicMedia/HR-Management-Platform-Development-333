# 🚀 Production Setup Guide

## 📋 Pre-Deployment Checklist

### 1. Database Reset for Production

#### Option A: Fresh Database Setup
If you're setting up a completely new database:
```sql
-- Run this in your Supabase SQL Editor
-- Copy and paste the contents of migrations/001_create_tables_production.sql
-- Then run migrations/002_default_permissions_production.sql
```

#### Option B: Clean Existing Database
If you need to clean an existing database with sample data:
```sql
-- First run: migrations/999_cleanup_sample_data.sql
-- Then run: migrations/002_default_permissions_production.sql
```

### 2. Environment Configuration

#### Update Supabase Configuration
1. **src/lib/supabase.js** - Update with production credentials:
```javascript
const SUPABASE_URL = 'https://your-production-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-production-anon-key'
```

#### Environment Variables (Recommended)
Create production environment variables:
```bash
# .env.production
VITE_SUPABASE_URL=https://your-production-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 3. Supabase Production Settings

#### Authentication Settings
1. **Site URL**: Update to your production domain
2. **Redirect URLs**: Add production domain patterns
3. **Email Templates**: Customize for your organization
4. **Email Confirmation**: Enable for production security

#### Security Settings
1. **RLS Policies**: ✅ Already configured
2. **API Rate Limiting**: Configure in Supabase dashboard
3. **Database Backups**: Enable automatic backups
4. **SSL Enforcement**: Ensure enabled

### 4. Application Configuration

#### Remove Development Features
- Demo login credentials
- Sample data generation
- Debug logging
- Development-only features

#### Update App Settings
```javascript
// src/store/authStore.js
// Remove mock login fallback for production
// Ensure only real Supabase authentication
```

### 5. Performance Optimizations

#### Database Indexes
All necessary indexes are included in the production migration:
- User email lookup
- Leave request filtering
- Permission checking
- Audit log queries

#### Caching Strategy
- Enable Supabase Edge caching
- Configure browser caching for static assets
- Implement query result caching where appropriate

### 6. Monitoring & Analytics

#### Error Tracking
- Set up error monitoring (Sentry, etc.)
- Configure logging for production issues
- Monitor performance metrics

#### Usage Analytics
- User activity tracking (built-in)
- Permission usage statistics (built-in)
- System performance monitoring

### 7. Security Checklist

#### Data Protection
- ✅ Row Level Security (RLS) enabled
- ✅ Proper permission policies
- ✅ Input validation and sanitization
- ✅ Secure password handling

#### Access Control
- ✅ Role-based permissions
- ✅ Audit logging
- ✅ Session management
- ✅ API security

### 8. Testing Before Go-Live

#### Functionality Testing
- [ ] User registration/login
- [ ] Role assignment and permissions
- [ ] Leave request workflow
- [ ] Performance reviews
- [ ] Data export/import
- [ ] Admin console operations

#### Security Testing
- [ ] Permission boundaries
- [ ] Data access restrictions
- [ ] SQL injection protection
- [ ] XSS protection

#### Performance Testing
- [ ] Page load times
- [ ] Database query performance
- [ ] Large dataset handling
- [ ] Concurrent user testing

### 9. Deployment Steps

#### Build for Production
```bash
npm run build
```

#### Deploy to Your Platform
- Vercel, Netlify, or your preferred hosting
- Configure environment variables
- Set up custom domain
- Enable HTTPS

#### Post-Deployment Verification
1. Test all critical workflows
2. Verify database connections
3. Check authentication flows
4. Validate permission systems
5. Test admin functionality

### 10. Initial Admin Setup

#### Create First Admin User
After deployment, create your first admin user:
1. Register through the normal signup process
2. Manually update their role in Supabase:
```sql
UPDATE users_hr_dash 
SET role = 'superadmin' 
WHERE email = 'your-admin-email@company.com';
```

#### Configure Organization Settings
1. Set up departments
2. Configure leave policies
3. Create performance review templates
4. Set up permission templates

### 11. User Onboarding

#### Bulk User Import
Use the admin console bulk import feature:
1. Prepare CSV with user data
2. Import through admin interface
3. Assign appropriate roles
4. Send welcome emails

#### Training Materials
- Create user guides
- Set up help documentation
- Prepare training sessions
- Establish support processes

### 12. Maintenance Plan

#### Regular Tasks
- Monitor system performance
- Review audit logs
- Update permissions as needed
- Backup verification
- Security updates

#### Scheduled Maintenance
- Database optimization
- Log cleanup
- Performance tuning
- Feature updates

## 🎯 Production-Ready Features

### ✅ What's Included
- **Clean Database Schema**: No sample data
- **Security**: Full RLS implementation
- **Permissions**: Role-based access control
- **Audit Trail**: Complete activity logging
- **Performance**: Optimized queries and indexes
- **Scalability**: Designed for growth

### 🔧 What to Customize
- **Branding**: Update colors, logos, company name
- **Email Templates**: Customize for your organization
- **Permissions**: Adjust role permissions as needed
- **Workflows**: Adapt approval processes
- **Reports**: Add custom analytics

## 📞 Support

For production deployment assistance:
1. Review the troubleshooting guide
2. Check Supabase documentation
3. Test in staging environment first
4. Have rollback plan ready

Your HR Dashboard is now ready for production! 🚀