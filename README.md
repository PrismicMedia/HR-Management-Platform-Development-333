# Agency HR Dashboard

A comprehensive HR management system built with React, Supabase, and modern web technologies.

## 🚀 Features

- **Authentication System** - Secure login with role-based access
- **Dashboard** - Overview of KPIs, tasks, and activities
- **Leave Management** - Request, track, and manage employee leave
- **Skills Matrix** - Track and develop employee skills
- **Growth Planning** - Kanban-style task management
- **Payslip Management** - View and download salary statements
- **Admin Console** - User management and system administration
- **Multilingual Support** - English and Arabic (RTL) support
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Drag & Drop**: React DnD
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd employee-dashboard
npm install
```

### 2. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Configure Credentials**
   - Update `src/lib/supabase.js` with your credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project-id.supabase.co'
   const SUPABASE_ANON_KEY = 'your-anon-key'
   ```

3. **Run Database Migration**
   - Copy the contents of `migrations/001_create_tables.sql`
   - Run it in your Supabase SQL editor
   - This creates all necessary tables and sample data

### 3. Run the Application

```bash
npm run dev
```

## 📊 Database Schema

The application uses the following main tables:

- **users_hr_dash** - Employee profiles and information
- **leave_requests_hr_dash** - Leave requests and approvals
- **skills_hr_dash** - Employee skills and proficiency levels
- **tasks_hr_dash** - Growth plan tasks and assignments
- **kpis_hr_dash** - Key Performance Indicators

## 🔐 Demo Credentials

- **Admin**: admin@agency.com / password
- **Staff**: staff@agency.com / password

## 🌟 Key Features Explained

### Authentication & Authorization
- Supabase Auth integration with fallback to mock login
- Role-based access control (superadmin, manager, team_leader, staff)
- Secure session management

### Leave Management
- Calendar view of leave requests
- Real-time status updates
- Approval workflow
- Leave balance tracking

### Skills Matrix
- Proficiency levels (Beginner to Expert)
- Category-based organization
- Progress tracking
- Skill development planning

### Growth Planning
- Kanban-style task board
- Drag & drop functionality
- Priority management
- Progress tracking

### Admin Console
- User management
- System analytics
- Template management
- Role-based access

## 🎨 Customization

### Themes
- Light/Dark mode toggle
- Customizable color schemes in `tailwind.config.js`
- CSS variables for easy theming

### Localization
- English/Arabic support
- RTL layout support
- Easy to add new languages in `src/utils/translations.js`

### Styling
- Tailwind CSS utility classes
- Custom animations with Framer Motion
- Responsive design principles

## 🔄 State Management

The application uses Zustand for state management with the following stores:

- **authStore** - User authentication and profile data
- **themeStore** - Theme preferences
- **languageStore** - Language preferences

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚨 Error Handling

- Graceful fallbacks for Supabase connection issues
- User-friendly error messages
- Offline functionality considerations
- Loading states and error boundaries

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── store/         # Zustand stores
├── services/      # API services
├── utils/         # Utility functions
├── lib/           # Third-party configurations
└── common/        # Common components
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.