# 🌟 HuRai - HR Management Reimagined

A modern, Apple-inspired HR management platform built with React, Supabase, and cutting-edge web technologies.

## ✨ Brand Identity

**HuRai** represents the future of human resources management, combining the power of AI ("Hu" for Human + "Rai" for AI) with elegant, Apple-inspired design principles.

### 🎨 Design Philosophy
- **Apple-Inspired**: Clean, minimalist interface with premium feel
- **Green & Red Palette**: Professional yet vibrant color scheme
- **Glass Morphism**: Modern backdrop blur effects
- **Smooth Animations**: 60fps transitions and micro-interactions
- **Typography**: SF Pro Display system fonts

## 🚀 Features

### 🏢 Core HR Management
- **Employee Profiles** - Comprehensive user management
- **Leave Management** - Smart leave tracking and approval workflows
- **Attendance Tracking** - Real-time check-in/out with analytics
- **Performance Reviews** - 360-degree feedback system
- **Skills Matrix** - Dynamic skill tracking and development
- **Goal Setting** - OKR-style goal management
- **Team Collaboration** - Built-in messaging and project coordination

### 📊 Advanced Analytics
- **Performance Dashboards** - Real-time KPI monitoring
- **Attendance Analytics** - Detailed workforce insights
- **Skills Analysis** - Team competency mapping
- **Productivity Metrics** - Data-driven performance insights

### 📸 Employee Snapshots
- **Modular Snapshots** - Customizable employee information cards
- **Professional Export** - High-quality PNG downloads
- **Share & Collaborate** - Native sharing capabilities
- **Brand Consistency** - HuRai-branded templates

### 🛡️ Enterprise Security
- **Role-Based Access Control** - Granular permission system
- **Audit Logging** - Complete activity tracking
- **Data Encryption** - End-to-end security
- **Compliance Ready** - GDPR and privacy compliant

## 🎯 Design System

### Colors
- **Primary Green**: `#22c55e` - Growth, productivity, success
- **Secondary Red**: `#ef4444` - Urgency, alerts, important actions
- **Accent Grays**: Professional neutrals for balance

### Typography
- **Display**: SF Pro Display (Apple system font)
- **Body**: SF Pro Text
- **Code**: SF Mono

### Components
- **HuRai Cards**: Elevated surfaces with subtle shadows
- **Glass Panels**: Backdrop blur with transparency
- **Gradient Buttons**: Smooth color transitions
- **Smooth Animations**: Spring-based transitions

## 🔧 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management

### Backend
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Database-level security
- **Real-time Subscriptions** - Live data updates
- **Authentication** - Secure user management

### Additional Libraries
- **React Icons** - Comprehensive icon library
- **date-fns** - Modern date utilities
- **React DnD** - Drag and drop interactions
- **html2canvas** - Snapshot generation
- **React Hot Toast** - Beautiful notifications

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd hurai-hr-platform
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Update with your Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the migration files in order:
   - `migrations/001_create_tables.sql`
   - `migrations/002_default_permissions.sql`
   - `migrations/003_performance_reviews.sql`
   - `migrations/004_audit_enhancements.sql`
   - `migrations/005_sops.sql`

### 4. Launch Application
```bash
npm run dev
```

Visit `http://localhost:5173` to see HuRai in action!

## 🎨 Brand Guidelines

### Logo Usage
- **Primary Logo**: Green gradient "H" with red accent dot
- **Minimum Size**: 32px height
- **Clear Space**: 8px on all sides
- **Background**: Works on light and dark surfaces

### Color Applications
- **Primary Actions**: Green gradient buttons
- **Destructive Actions**: Red gradient buttons
- **Information**: Blue system colors
- **Success States**: Green indicators
- **Warning States**: Orange/yellow indicators

### Typography Scale
- **Display**: 48px+ for hero text
- **Headline**: 24-32px for section headers
- **Body**: 16px for main content
- **Caption**: 12-14px for supporting text

## 📱 Responsive Design

HuRai is designed mobile-first with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large**: 1440px+

## 🌍 Internationalization

Currently supports:
- **English** (Primary)
- **Arabic** (RTL support)

Easy to extend with additional languages through the translation system.

## 🔐 Security Features

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Role-based access control
- **Data Protection**: Row-level security policies
- **Audit Trail**: Comprehensive activity logging
- **Session Management**: Secure token handling

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: Sub-second initial load
- **Animation Performance**: 60fps smooth transitions

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

## 📈 Analytics & Monitoring

HuRai includes built-in analytics for:
- **User Activity**: Page views, feature usage
- **Performance Metrics**: Load times, error rates
- **Business Intelligence**: HR metrics and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apple Design Team** - Design inspiration
- **Supabase Team** - Amazing backend platform
- **React Team** - Powerful frontend framework
- **Tailwind CSS** - Utility-first styling

---

<div align="center">
  <p><strong>HuRai</strong> - Where Human Resources meets Artificial Intelligence</p>
  <p>Built with ❤️ by the HuRai team</p>
</div>