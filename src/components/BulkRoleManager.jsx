import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUsers, FiCheck, FiX, FiArrowRight, FiDownload, FiUpload, FiRefreshCw } = FiIcons;

const BulkRoleManager = ({ users, onBulkUpdate }) => {
  const { t } = useTranslation();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [newRole, setNewRole] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const roles = [
    { value: 'staff', label: 'Staff', color: 'bg-blue-500' },
    { value: 'team_leader', label: 'Team Leader', color: 'bg-green-500' },
    { value: 'manager', label: 'Manager', color: 'bg-purple-500' },
    { value: 'superadmin', label: 'Super Admin', color: 'bg-red-500' }
  ];

  const bulkActions = [
    { value: 'change_role', label: 'Change Role' },
    { value: 'activate', label: 'Activate Users' },
    { value: 'deactivate', label: 'Deactivate Users' },
    { value: 'reset_permissions', label: 'Reset to Default Permissions' },
    { value: 'export_users', label: 'Export Selected Users' }
  ];

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleBulkAction = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select an action');
      return;
    }

    if (bulkAction === 'change_role' && !newRole) {
      toast.error('Please select a new role');
      return;
    }

    setShowConfirmModal(true);
  };

  const executeBulkAction = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      const selectedUserData = users.filter(user => selectedUsers.includes(user.id));

      switch (bulkAction) {
        case 'change_role':
          await simulateRoleChange(selectedUserData, newRole);
          break;
        case 'activate':
          await simulateStatusChange(selectedUserData, 'active');
          break;
        case 'deactivate':
          await simulateStatusChange(selectedUserData, 'inactive');
          break;
        case 'reset_permissions':
          await simulatePermissionReset(selectedUserData);
          break;
        case 'export_users':
          exportUsers(selectedUserData);
          break;
      }

      if (onBulkUpdate) {
        onBulkUpdate();
      }

      setSelectedUsers([]);
      setBulkAction('');
      setNewRole('');
      toast.success(`Bulk action completed successfully!`);
    } catch (error) {
      toast.error('Bulk action failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateRoleChange = async (users, role) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Changing role to ${role} for users:`, users.map(u => u.name));
  };

  const simulateStatusChange = async (users, status) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Setting status to ${status} for users:`, users.map(u => u.name));
  };

  const simulatePermissionReset = async (users) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Resetting permissions for users:`, users.map(u => u.name));
  };

  const exportUsers = (users) => {
    const exportData = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      joinDate: user.joinDate,
      leaveBalance: user.leave_balance
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(user => Object.values(user).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importUsers = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const userData = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });

        console.log('Imported user data:', userData);
        toast.success(`Imported ${userData.length} users successfully!`);
      } catch (error) {
        toast.error('Invalid CSV file format');
      }
    };
    reader.readAsText(file);
  };

  const getRoleColor = (role) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.color || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bulk Role Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage multiple users simultaneously
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm cursor-pointer">
            <SafeIcon icon={FiUpload} className="w-4 h-4 mr-1" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={importUsers}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => exportUsers(users)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
            Export All
          </button>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Bulk Actions
          </h4>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedUsers.length} user(s) selected
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action
            </label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Action</option>
              {bulkActions.map(action => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
          </div>
          
          {bulkAction === 'change_role' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="md:col-span-2 flex items-end space-x-2">
            <button
              onClick={handleBulkAction}
              disabled={selectedUsers.length === 0 || !bulkAction || isProcessing}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-1" />
              )}
              {isProcessing ? 'Processing...' : 'Execute'}
            </button>
            
            <button
              onClick={() => setSelectedUsers([])}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* User Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All ({users.length})
              </span>
            </label>
            
            {selectedUsers.length > 0 && (
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {selectedUsers.length} selected
              </span>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedUsers.includes(user.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleUserSelect(user.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              
              <div className="ml-4 flex-1">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                
                <div className={`w-3 h-3 rounded-full ${getRoleColor(user.role)}`} title={user.role}></div>
                
                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-0">
                  {user.department}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
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
                  Confirm Bulk Action
                </h4>
                
                <div className="space-y-3 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You are about to perform the following action:
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Action: {bulkActions.find(a => a.value === bulkAction)?.label}
                    </p>
                    {bulkAction === 'change_role' && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        New Role: {roles.find(r => r.value === newRole)?.label}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Affected Users: {selectedUsers.length}
                    </p>
                  </div>
                  
                  <p className="text-sm text-red-600 dark:text-red-400">
                    This action cannot be undone. Are you sure you want to continue?
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeBulkAction}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkRoleManager;