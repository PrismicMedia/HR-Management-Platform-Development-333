import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export const usePermissions = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all global permissions
  const getGlobalPermissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('global_permissions')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  // Add new global permission
  const addGlobalPermission = async (permissionData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('global_permissions')
        .insert([{
          ...permissionData,
          created_by: user?.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  // Update global permission
  const updateGlobalPermission = async (permissionId, updates) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('global_permissions')
        .update({
          ...updates,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', permissionId)
        .select()
        .single();

      if (error) throw error;
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  // Delete global permission
  const deleteGlobalPermission = async (permissionId) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('global_permissions')
        .delete()
        .eq('id', permissionId);

      if (error) throw error;
      
      // Also remove from all role permissions
      await supabase
        .from('role_permissions')
        .delete()
        .eq('permission_id', permissionId);

      setLoading(false);
      return { error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { error: err };
    }
  };

  // Get role permissions
  const getRolePermissions = async (role) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          permission_id,
          enabled,
          global_permissions (
            key,
            label,
            description,
            category
          )
        `)
        .eq('role', role);

      if (error) throw error;
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  // Update role permission
  const updateRolePermission = async (role, permissionKey, enabled) => {
    setLoading(true);
    try {
      // First get the permission ID
      const { data: permission } = await supabase
        .from('global_permissions')
        .select('id')
        .eq('key', permissionKey)
        .single();

      if (!permission) throw new Error('Permission not found');

      // Upsert role permission
      const { data, error } = await supabase
        .from('role_permissions')
        .upsert({
          role: role,
          permission_id: permission.id,
          enabled: enabled,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  // Bulk update role permissions
  const bulkUpdateRolePermissions = async (role, permissions) => {
    setLoading(true);
    try {
      // Delete existing permissions for this role
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role', role);

      // Insert new permissions
      const permissionData = permissions.map(permKey => ({
        role: role,
        permission_key: permKey,
        enabled: true,
        updated_by: user?.id,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('role_permissions')
        .insert(permissionData)
        .select();

      if (error) throw error;
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err };
    }
  };

  // Check if user has specific permission
  const hasPermission = async (userId, permissionKey) => {
    try {
      const { data, error } = await supabase
        .from('users_hr_dash')
        .select(`
          role,
          role_permissions!inner (
            enabled,
            global_permissions!inner (key)
          )
        `)
        .eq('id', userId)
        .eq('role_permissions.global_permissions.key', permissionKey)
        .eq('role_permissions.enabled', true)
        .single();

      return { hasPermission: !!data, error };
    } catch (err) {
      return { hasPermission: false, error: err };
    }
  };

  return {
    loading,
    error,
    getGlobalPermissions,
    addGlobalPermission,
    updateGlobalPermission,
    deleteGlobalPermission,
    getRolePermissions,
    updateRolePermission,
    bulkUpdateRolePermissions,
    hasPermission
  };
};