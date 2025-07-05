import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (credentials) => {
        set({ loading: true })
        
        try {
          console.log('🔐 Attempting login...', credentials.email)
          
          // Try Supabase authentication first
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          })

          if (authError) {
            console.log('🔄 Supabase auth failed, trying demo login:', authError.message)
            
            // Demo login fallback
            const demoUsers = {
              'admin@agency.com': {
                id: '1',
                email: 'admin@agency.com',
                name: 'Admin User',
                role: 'superadmin',
                department: 'Management',
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff'
              },
              'john.doe@agency.com': {
                id: '2', 
                email: 'john.doe@agency.com',
                name: 'John Doe',
                role: 'staff',
                department: 'Engineering',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0ea5e9&color=fff'
              }
            }

            const demoUser = demoUsers[credentials.email]
            if (demoUser && credentials.password === 'password') {
              console.log('✅ Demo login successful')
              set({ 
                user: { ...demoUser, leaveBalance: 25 }, 
                isAuthenticated: true, 
                loading: false 
              })
              return { success: true }
            }

            throw new Error('Invalid email or password')
          }

          // Get user profile from database
          const { data: profile, error: profileError } = await supabase
            .from('users_hr_dash')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (profileError) {
            console.log('👤 Creating new user profile...')
            // Create new user profile
            const { data: newProfile, error: createError } = await supabase
              .from('users_hr_dash')
              .insert([{
                email: authData.user.email,
                name: authData.user.user_metadata?.full_name || authData.user.email.split('@')[0],
                role: 'staff',
                status: 'active'
              }])
              .select()
              .single()

            if (createError) throw createError

            const user = {
              ...authData.user,
              ...newProfile,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newProfile.name)}&background=0ea5e9&color=fff`
            }

            set({ user, isAuthenticated: true, loading: false })
            return { success: true }
          }

          const user = {
            ...authData.user,
            ...profile,
            avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0ea5e9&color=fff`
          }

          console.log('✅ Login successful:', user.name)
          set({ user, isAuthenticated: true, loading: false })
          return { success: true }

        } catch (error) {
          console.error('❌ Login error:', error)
          set({ loading: false })
          return { success: false, error: error.message }
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut()
        } catch (error) {
          console.error('Logout error:', error)
        }
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (userData) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },

      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false

        const rolePermissions = {
          superadmin: ['all'],
          manager: ['approve_leave', 'manage_team', 'view_reports'],
          team_leader: ['endorse_leave', 'assign_tasks', 'view_team'],
          staff: ['view_own', 'request_leave', 'update_tasks']
        }

        const userPermissions = rolePermissions[user.role] || []
        return userPermissions.includes('all') || userPermissions.includes(permission)
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
)