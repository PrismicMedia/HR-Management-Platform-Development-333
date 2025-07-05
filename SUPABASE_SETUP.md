# 🚀 Supabase Setup Guide for HR Dashboard

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email if needed

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Project Name**: `hr-dashboard` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project"
5. Wait 2-3 minutes for project initialization

## Step 2: Get Your Project Credentials

### 2.1 Find Your Project Settings
1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (this is safe for frontend)
     - `service_role` `secret` key (keep this private!)

### 2.2 Copy Your Credentials
```
Project URL: https://abcdefghijklmnop.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU4ODcxMywiZXhwIjoxOTUyMTY0NzEzfQ.example
```

## Step 3: Configure Your Application

### 3.1 Update Supabase Configuration
Open `src/lib/supabase.js` and replace the placeholders:

```javascript
import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co'  // ← Your Project URL
const SUPABASE_ANON_KEY = 'your-anon-key'                   // ← Your Anon Key

// ... rest of the file stays the same
```

**Example:**
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU4ODcxMywiZXhwIjoxOTUyMTY0NzEzfQ.example'
```

## Step 4: Set Up Database Tables

### 4.1 Access SQL Editor
1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"

### 4.2 Run Database Migration
1. Copy the entire contents of `migrations/001_create_tables.sql`
2. Paste it into the SQL Editor
3. Click "Run" (or press Ctrl+Enter)
4. You should see "Success. No rows returned" message

### 4.3 Verify Tables Created
1. Go to **Table Editor** in the sidebar
2. You should see these tables:
   - `users_hr_dash`
   - `leave_requests_hr_dash`
   - `skills_hr_dash`
   - `tasks_hr_dash`
   - `kpis_hr_dash`

## Step 5: Configure Authentication

### 5.1 Set Up Auth Settings
1. Go to **Authentication** → **Settings**
2. Configure these settings:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/**`
3. Under **Email Auth**:
   - Enable "Enable email confirmations" → **Disable** (for easier development)
   - Enable "Enable email signup" → **Enable**

### 5.2 Create Test Users (Optional)
1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Create test accounts:
   - Email: `admin@agency.com`, Password: `password`
   - Email: `john.doe@agency.com`, Password: `password`

## Step 6: Test Your Setup

### 6.1 Start Your Application
```bash
npm run dev
```

### 6.2 Check Connection Status
1. Open your app in browser (`http://localhost:5173`)
2. Look for the Supabase status indicator in the header
3. It should show: "✅ Supabase connected and database ready!"

### 6.3 Test Login
1. Try logging in with:
   - Email: `admin@agency.com`
   - Password: `password`
2. Or create a new account

### 6.4 Test Features
1. **Leave Requests**: Try submitting a leave request
2. **Skills**: Add a new skill
3. **Profile**: Update your profile information

## Step 7: Production Setup (Later)

When you're ready to deploy:

### 7.1 Update Site URL
1. In Supabase **Authentication** → **Settings**
2. Update **Site URL** to your production domain
3. Add production domain to **Redirect URLs**

### 7.2 Environment Variables
For production, use environment variables:

```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
```

Create `.env` file:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🔧 Troubleshooting

### Connection Issues
- **"Supabase not configured"**: Check if you updated the credentials correctly
- **"Connected but tables missing"**: Run the SQL migration again
- **"Connection failed"**: Verify your project URL and anon key

### Authentication Issues
- **Login fails**: Check if email confirmation is disabled
- **User not found**: Create test users manually or sign up

### Database Issues
- **Tables not found**: Re-run the migration SQL
- **Permission denied**: Check RLS policies are set correctly

## 📊 Sample Data

The migration includes sample data:
- **Users**: Admin and staff accounts
- **Leave Requests**: Example leave requests
- **Skills**: Sample React and Node.js skills
- **Tasks**: Development tasks
- **KPIs**: Performance metrics

## 🎉 You're All Set!

Once you see the green "✅ Supabase connected and database ready!" message, your HR dashboard is fully functional with:

- ✅ Real-time database
- ✅ User authentication
- ✅ Leave management
- ✅ Skills tracking
- ✅ Task management
- ✅ Profile management

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase credentials
3. Ensure the SQL migration ran successfully
4. Check the Supabase status indicator in the app header

Your HR dashboard is now powered by a real database! 🚀