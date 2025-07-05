import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useLanguageStore } from './store/languageStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import PerformanceReviews from './pages/PerformanceReviews';
import GrowthPlan from './pages/GrowthPlan';
import Leave from './pages/Leave';
import Skills from './pages/Skills';
import TeamCollaborationPage from './pages/TeamCollaboration';
import Analytics from './pages/Analytics';
import Payslips from './pages/Payslips';
import AdminConsole from './pages/AdminConsole';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [theme, language]);

  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <div className={`hurai-app ${theme} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
          <Router>
            {!isAuthenticated ? (
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            ) : (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/performance" element={<PerformanceReviews />} />
                  <Route path="/growth-plan" element={<GrowthPlan />} />
                  <Route path="/leave" element={<Leave />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/team" element={<TeamCollaborationPage />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/payslips" element={<Payslips />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  {(user?.role === 'superadmin' || user?.role === 'manager') && (
                    <Route path="/admin" element={<AdminConsole />} />
                  )}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            )}
          </Router>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#1f2937',
                border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb',
                borderRadius: '0.875rem',
                boxShadow: theme === 'dark' 
                  ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                  : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;