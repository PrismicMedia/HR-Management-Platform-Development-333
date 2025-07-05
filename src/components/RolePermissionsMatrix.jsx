import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import PermissionEditor from './PermissionEditor';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiShield, FiCheck, FiX, FiEdit3, FiTrash2, FiToggleLeft, FiToggleRight, FiSettings } = FiIcons;

const RolePermissionsMatrix = () => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState('staff');
  const [showPermissionEditor, setShowPermissionEditor] = useState(false);
  const [globalPermissions, setGlobalPermissions] = useState({
    'Profile & Personal': [
      { key: 'view_own_profile', label: 'View Own Profile', description: 'Access personal profile information', isCustom: false },
      { key: 'edit_own_profile', label: 'Edit Own Profile', description: 'Modify personal information', isCustom: false },
      { key: 'view_own_data', label: 'View Own Data', description: 'Access personal records and data', isCustom: false }
    ],
    'Leave Management': [
      { key: 'request_leave', label: 'Request Leave', description: 'Submit leave requests', isCustom: false },
      { key: 'view_own_leave', label: 'View Own Leave', description: 'View personal leave history', isCustom: false },
      { key: 'endorse_leave', label: 'Endorse Leave', description: 'Recommend leave approvals', isCustom: false },
      { key: 'approve_leave', label: 'Approve Leave', description: 'Final leave approval authority', isCustom: false }
    ],
    'Task Management': [
      { key: 'view_own_tasks', label: 'View Own Tasks', description: 'Access assigned tasks', isCustom: false },
      { key: 'update_tasks', label: 'Update Tasks', description: 'Modify task status and details', isCustom: false },
      { key: 'assign_tasks', label: 'Assign Tasks', description: 'Assign tasks to team members', isCustom: false },
      { key: 'manage_all_tasks', label: 'Manage All Tasks', description: 'Full task management access', isCustom: false }
    ],
    'Team & Users': [
      { key: 'view_team', label: 'View Team', description: 'Access team member information', isCustom: false },
      { key: 'manage_team', label: 'Manage Team', description: 'Add, edit, remove team members', isCustom: false },
      { key: 'view_all_users', label: 'View All Users', description: 'Access all user profiles', isCustom: false },
      { key: 'manage_users', label: 'Manage Users', description: 'Full user management capabilities', isCustom: false }
    ],
    'Reports & Analytics': [
      { key: 'view_reports', label: 'View Reports', description: 'Access reporting dashboard', isCustom: false },
      { key: 'generate_reports', label: 'Generate Reports', description: 'Create custom reports', isCustom: false },
      { key: 'view_analytics', label: 'View Analytics', description: 'Access system analytics', isCustom: false },
      { key: 'export_data', label: 'Export Data', description: 'Export system data', isCustom: false }
    ],
    'System Administration': [
      { key: 'system_settings', label: 'System Settings', description: 'Modify system configuration', isCustom: false },
      { key: 'user_roles', label: 'User Roles', description: 'Manage user roles and permissions', isCustom: false },
      { key: 'audit_logs', label: 'Audit Logs', description: 'View system audit trails', isCustom: false },
      { key: 'backup_restore', label: 'Backup & Restore', description: 'System backup operations', isCustom: false }
    ],
    'Custom': []
  });

  const [rolePermissions, setRolePermissions] = useState({
    staff: [
      'view_own_profile', 'edit_own_profile', 'view_own_data',
      'request_leave', 'view_own_leave',
      'view_own_tasks', 'update_tasks'
    ],
    team_leader: [
      'view_own_profile', 'edit_own_profile', 'view_own_data',
      'request_leave', 'view_own_leave', 'endorse_leave',
      'view_own_tasks', 'update_tasks', 'assign_tasks',
      'view_team'
    ],
    manager: [
      'view_own_profile', 'edit_own_profile', 'view_own_data',
      'request_leave', 'view_own_leave', 'endorse_leave', 'approve_leave',
      'view_own_tasks', 'update_tasks', 'assign_tasks', 'manage_all_tasks',
      'view_team', 'manage_team',
      'view_reports', 'generate_reports', 'view_analytics'
    ],
    superadmin: [
      'view_own_profile', 'edit_own_profile', 'view_own_data',
      'request_leave', 'view_own_leave', 'endorse_leave', 'approve_leave',
      'view_own_tasks', 'update_tasks', 'assign_tasks', 'manage_all_tasks',
      'view_team', 'manage_team', 'view_all_users', 'manage_users',
      'view_reports', 'generate_reports', 'view_analytics', 'export_data',
      'system_settings', 'user_roles', 'audit_logs', 'backup_restore'
    ]
  });

  const roles = [
    {
      value: 'staff',
      label: 'Staff',
      description: 'Basic employee access',
      color: 'bg-blue-500',
      users: 45
    },
    {
      value: 'team_leader',
      label: 'Team Leader',
      description: 'Lead team members',
      color: 'bg-green-500',
      users: 12
    },
    {
      value: 'manager',
      label: 'Manager',
      description: 'Department management',
      color: 'bg-purple-500',
      users: 8
    },
    {
      value: 'superadmin',
      label: 'Super Admin',
      description: 'Full system access',
      color: 'bg-red-500',
      users: 3
    }
  ];

  const hasPermission = (roleValue, permissionKey) => {
    return rolePermissions[roleValue]?.includes(permissionKey) || false;
  };

  const handleTogglePermission = (roleValue, permissionKey, enabled) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleValue]: enabled 
        ? [...(prev[roleValue] || []), permissionKey]
        : (prev[roleValue] || []).filter(p => p !== permissionKey)
    }));

    // Save to backend here
    toast.success(`Permission ${enabled ? 'enabled' : 'disabled'} for ${roleValue}`);
  };

  const handleUpdatePermissions = (action, data) => {
    if (action === 'ADD_GLOBAL_PERMISSION') {
      const category = data.category || 'Custom';
      setGlobalPermissions(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), data]
      }));
    } else if (action === 'DELETE_GLOBAL_PERMISSION') {
      setGlobalPermissions(prev => {
        const newPerms = { ...prev };
        Object.keys(newPerms).forEach(category => {
          newPerms[category] = newPerms[category].filter(p => p.key !== data);
        });
        return newPerms;
      });
      
      // Remove from all roles
      setRolePermissions(prev => {
        const newRolePerms = { ...prev };
        Object.keys(newRolePerms).forEach(role => {
          newRolePerms[role] = newRolePerms[role].filter(p => p !== data);
        });
        return newRolePerms;
      });
    } else if (action === 'UPDATE_GLOBAL_PERMISSION') {
      setGlobalPermissions(prev => {
        const newPerms = { ...prev };
        Object.keys(newPerms).forEach(category => {
          const index = newPerms[category].findIndex(p => p.key === data.key);
          if (index !== -1) {
            newPerms[category][index] = data;
          }
        });
        return newPerms;
      });
    } else {
      // Regular role permission update
      handleTogglePermission(action, data, true);
    }
  };

  const selectedRoleData = roles.find(role => role.value === selectedRole);
  const allPermissions = Object.values(globalPermissions).flat();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Role Permissions Matrix
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage roles and their permissions dynamically
          </p>
        </div>
        
        <button
          onClick={() => setShowPermissionEditor(!showPermissionEditor)}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            showPermissionEditor 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <SafeIcon icon={FiSettings} className="w-4 h-4 mr-2" />
          {showPermissionEditor ? 'Close Editor' : 'Permission Editor'}
        </button>
      </div>

      {/* Permission Editor */}
      {showPermissionEditor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-2 border-blue-200 dark:border-blue-800"
        >
          <PermissionEditor
            role={selectedRole}
            permissions={rolePermissions[selectedRole]}
            onUpdatePermissions={handleUpdatePermissions}
          />
        </motion.div>
      )}

      {/* Role Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <motion.div
              key={role.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === role.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
              }`}
              onClick={() => setSelectedRole(role.value)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${role.color}`}>
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {role.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rolePermissions[role.value]?.length || 0} permissions
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Permissions Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Interactive Permissions for {selectedRoleData?.label}
        </h3>

        <div className="space-y-6">
          {Object.entries(globalPermissions).map(([category, permissions]) => (
            <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                {category}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({permissions.length} permissions)
                </span>
              </h4>
              
              <div className="grid gap-3">
                {permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleTogglePermission(
                            selectedRole, 
                            permission.key, 
                            !hasPermission(selectedRole, permission.key)
                          )}
                          className={`p-1 rounded transition-colors ${
                            hasPermission(selectedRole, permission.key)
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <SafeIcon
                            icon={hasPermission(selectedRole, permission.key) ? FiToggleRight : FiToggleLeft}
                            className="w-6 h-6"
                          />
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {permission.label}
                            </h5>
                            {permission.isCustom && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-xs">
                                Custom
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hasPermission(selectedRole, permission.key)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {hasPermission(selectedRole, permission.key) ? 'Enabled' : 'Disabled'}
                      </span>
                      
                      {showPermissionEditor && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleUpdatePermissions('UPDATE_GLOBAL_PERMISSION', permission)}
                            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Edit Permission"
                          >
                            <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                          </button>
                          
                          {permission.isCustom && (
                            <button
                              onClick={() => handleUpdatePermissions('DELETE_GLOBAL_PERMISSION', permission.key)}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete Permission"
                            >
                              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Permission Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div key={role.value} className="text-center">
              <div className={`p-3 rounded-lg ${role.color} mx-auto w-12 h-12 flex items-center justify-center mb-2`}>
                <SafeIcon icon={FiShield} className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {role.label}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {rolePermissions[role.value]?.length || 0} permissions
              </p>
              <div className="mt-2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${role.color}`}
                    style={{ 
                      width: `${((rolePermissions[role.value]?.length || 0) / allPermissions.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsMatrix;