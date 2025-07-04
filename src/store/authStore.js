import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      
      login: async (credentials) => {
        set({ loading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data based on credentials
          const mockUser = {
            id: 1,
            email: credentials.email,
            name: credentials.email === 'admin@agency.com' ? 'Admin User' : 'John Doe',
            role: credentials.email === 'admin@agency.com' ? 'superadmin' : 'staff',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email === 'admin@agency.com' ? 'Admin User' : 'John Doe')}&background=0ea5e9&color=fff`,
            department: 'Engineering',
            joinDate: '2024-01-15',
            skills: ['React', 'JavaScript', 'Node.js'],
            leaveBalance: 25,
            kpis: [
              { id: 1, name: 'Code Quality', current: 85, target: 90, unit: '%' },
              { id: 2, name: 'Tasks Completed', current: 23, target: 25, unit: 'tasks' },
              { id: 3, name: 'Client Satisfaction', current: 4.2, target: 4.5, unit: '/5' }
            ]
          };
          
          set({ user: mockUser, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }
        }));
      },
      
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        
        const rolePermissions = {
          superadmin: ['all'],
          manager: ['approve_leave', 'manage_team', 'view_reports', 'assign_tasks'],
          team_leader: ['endorse_leave', 'assign_tasks', 'view_team'],
          staff: ['view_own', 'request_leave', 'update_tasks']
        };
        
        const userPermissions = rolePermissions[user.role] || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);