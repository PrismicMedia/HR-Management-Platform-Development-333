import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit3, FiTrash2, FiSave, FiX, FiToggleLeft, FiToggleRight } = FiIcons;

const PermissionEditor = ({ role, permissions, onUpdatePermissions }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [newPermission, setNewPermission] = useState({ key: '', label: '', description: '', category: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  const categories = [
    'Profile & Personal',
    'Leave Management', 
    'Task Management',
    'Team & Users',
    'Reports & Analytics',
    'System Administration',
    'Custom'
  ];

  const handleTogglePermission = (permissionKey, enabled) => {
    const updatedPermissions = enabled 
      ? [...(permissions || []), permissionKey]
      : (permissions || []).filter(p => p !== permissionKey);
    
    onUpdatePermissions(role, updatedPermissions);
    toast.success(`Permission ${enabled ? 'enabled' : 'disabled'} for ${role}`);
  };

  const handleAddPermission = () => {
    if (!newPermission.key || !newPermission.label) {
      toast.error('Permission key and label are required');
      return;
    }

    // Add to global permissions list (this would normally be saved to database)
    const permissionData = {
      key: newPermission.key,
      label: newPermission.label,
      description: newPermission.description,
      category: newPermission.category || 'Custom',
      isCustom: true,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    // This would trigger a global permissions update
    onUpdatePermissions('ADD_GLOBAL_PERMISSION', permissionData);
    
    setNewPermission({ key: '', label: '', description: '', category: '' });
    setShowAddForm(false);
    toast.success('New permission added successfully');
  };

  const handleDeletePermission = (permissionKey) => {
    if (window.confirm('Are you sure you want to delete this permission? This will remove it from all roles.')) {
      onUpdatePermissions('DELETE_GLOBAL_PERMISSION', permissionKey);
      toast.success('Permission deleted successfully');
    }
  };

  const handleEditPermission = (permission) => {
    setEditingPermission({ ...permission });
  };

  const handleSaveEdit = () => {
    if (!editingPermission.key || !editingPermission.label) {
      toast.error('Permission key and label are required');
      return;
    }

    onUpdatePermissions('UPDATE_GLOBAL_PERMISSION', editingPermission);
    setEditingPermission(null);
    toast.success('Permission updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Permission Editor - {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage permissions for this role
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
            Add Permission
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
              isEditing 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <SafeIcon icon={isEditing ? FiX : FiEdit3} className="w-4 h-4 mr-1" />
            {isEditing ? 'Cancel' : 'Edit Mode'}
          </button>
        </div>
      </div>

      {/* Add Permission Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
          >
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-3">
              Add New Permission
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Permission Key *
                </label>
                <input
                  type="text"
                  value={newPermission.key}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="e.g., manage_custom_feature"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Label *
                </label>
                <input
                  type="text"
                  value={newPermission.label}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Manage Custom Feature"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newPermission.category}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newPermission.description}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what this permission allows"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPermission}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                Add Permission
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Permission Modal */}
      <AnimatePresence>
        {editingPermission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Permission
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Permission Key
                    </label>
                    <input
                      type="text"
                      value={editingPermission.key}
                      onChange={(e) => setEditingPermission(prev => ({ ...prev, key: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={!editingPermission.isCustom}
                    />
                    {!editingPermission.isCustom && (
                      <p className="text-xs text-gray-500 mt-1">System permissions cannot be renamed</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Label
                    </label>
                    <input
                      type="text"
                      value={editingPermission.label}
                      onChange={(e) => setEditingPermission(prev => ({ ...prev, label: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingPermission.description}
                      onChange={(e) => setEditingPermission(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setEditingPermission(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission Toggle Instructions */}
      {isEditing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Edit Mode Active
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Use the toggle switches to enable/disable permissions for this role. 
            Click the edit icon to modify permission details, or the trash icon to delete custom permissions.
          </p>
        </div>
      )}
    </div>
  );
};

export default PermissionEditor;