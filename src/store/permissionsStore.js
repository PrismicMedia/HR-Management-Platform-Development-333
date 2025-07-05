import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const usePermissionsStore = create(
  persist(
    (set, get) => ({
      globalPermissions: {},
      rolePermissions: {},
      loading: false,
      error: null,

      // Load global permissions
      loadGlobalPermissions: async () => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('global_permissions')
            .select('*')
            .eq('is_active', true)
            .order('category', { ascending: true });

          if (error) throw error;

          // Group permissions by category
          const groupedPermissions = data.reduce((acc, permission) => {
            if (!acc[permission.category]) {
              acc[permission.category] = [];
            }
            acc[permission.category].push(permission);
            return acc;
          }, {});

          set({ 
            globalPermissions: groupedPermissions, 
            loading: false 
          });
          
          return { success: true, data: groupedPermissions };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Load role permissions
      loadRolePermissions: async () => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('role_permissions')
            .select(`
              role,
              enabled,
              global_permissions (
                key,
                label,
                description,
                category
              )
            `)
            .eq('enabled', true);

          if (error) throw error;

          // Group by role
          const rolePerms = data.reduce((acc, item) => {
            if (!acc[item.role]) {
              acc[item.role] = [];
            }
            if (item.enabled && item.global_permissions) {
              acc[item.role].push(item.global_permissions.key);
            }
            return acc;
          }, {});

          set({ 
            rolePermissions: rolePerms, 
            loading: false 
          });
          
          return { success: true, data: rolePerms };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Add global permission
      addGlobalPermission: async (permissionData) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('global_permissions')
            .insert([{
              ...permissionData,
              is_system: false,
              is_active: true
            }])
            .select()
            .single();

          if (error) throw error;

          // Update local state
          const { globalPermissions } = get();
          const category = data.category || 'Custom';
          const updatedPermissions = {
            ...globalPermissions,
            [category]: [...(globalPermissions[category] || []), data]
          };

          set({ 
            globalPermissions: updatedPermissions, 
            loading: false 
          });
          
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Update global permission
      updateGlobalPermission: async (permissionId, updates) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await supabase
            .from('global_permissions')
            .update(updates)
            .eq('id', permissionId)
            .select()
            .single();

          if (error) throw error;

          // Update local state
          const { globalPermissions } = get();
          const updatedPermissions = { ...globalPermissions };
          
          Object.keys(updatedPermissions).forEach(category => {
            const index = updatedPermissions[category].findIndex(p => p.id === permissionId);
            if (index !== -1) {
              updatedPermissions[category][index] = data;
            }
          });

          set({ 
            globalPermissions: updatedPermissions, 
            loading: false 
          });
          
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Delete global permission
      deleteGlobalPermission: async (permissionId) => {
        set({ loading: true, error: null });
        
        try {
          const { error } = await supabase
            .from('global_permissions')
            .delete()
            .eq('id', permissionId);

          if (error) throw error;

          // Update local state
          const { globalPermissions, rolePermissions } = get();
          const updatedPermissions = { ...globalPermissions };
          
          Object.keys(updatedPermissions).forEach(category => {
            updatedPermissions[category] = updatedPermissions[category].filter(p => p.id !== permissionId);
          });

          set({ 
            globalPermissions: updatedPermissions, 
            loading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Update role permission
      updateRolePermission: async (role, permissionKey, enabled) => {
        set({ loading: true, error: null });
        
        try {
          // Get permission ID
          const { data: permission, error: permError } = await supabase
            .from('global_permissions')
            .select('id')
            .eq('key', permissionKey)
            .single();

          if (permError) throw permError;

          // Upsert role permission
          const { data, error } = await supabase
            .from('role_permissions')
            .upsert({
              role: role,
              permission_id: permission.id,
              enabled: enabled
            }, {
              onConflict: 'role,permission_id'
            })
            .select();

          if (error) throw error;

          // Update local state
          const { rolePermissions } = get();
          const updatedRolePermissions = { ...rolePermissions };
          
          if (!updatedRolePermissions[role]) {
            updatedRolePermissions[role] = [];
          }

          if (enabled) {
            if (!updatedRolePermissions[role].includes(permissionKey)) {
              updatedRolePermissions[role].push(permissionKey);
            }
          } else {
            updatedRolePermissions[role] = updatedRolePermissions[role].filter(p => p !== permissionKey);
          }

          set({ 
            rolePermissions: updatedRolePermissions, 
            loading: false 
          });
          
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Check if role has permission
      hasPermission: (role, permissionKey) => {
        const { rolePermissions } = get();
        return rolePermissions[role]?.includes(permissionKey) || false;
      },

      // Get permissions for role
      getRolePermissions: (role) => {
        const { rolePermissions } = get();
        return rolePermissions[role] || [];
      },

      // Clear cache
      clearCache: () => {
        set({
          globalPermissions: {},
          rolePermissions: {},
          loading: false,
          error: null
        });
      }
    }),
    {
      name: 'permissions-storage',
      partialize: (state) => ({
        globalPermissions: state.globalPermissions,
        rolePermissions: state.rolePermissions
      })
    }
  )
);