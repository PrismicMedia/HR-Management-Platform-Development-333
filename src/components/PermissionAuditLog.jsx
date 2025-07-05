import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiEye, FiFilter, FiDownload, FiRefreshCw, FiCalendar, FiUser, FiShield, FiActivity, FiEdit3, FiTrash2, FiCheck, FiX } = FiIcons;

const PermissionAuditLog = () => {
  const { t } = useTranslation();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateFrom: '',
    dateTo: '',
    role: ''
  });

  // Mock audit log data
  const mockAuditLogs = [
    {
      id: 1,
      action: 'ENABLE',
      permissionKey: 'approve_leave',
      role: 'manager',
      oldValue: { enabled: false },
      newValue: { enabled: true },
      changedBy: 'Admin User',
      changedAt: '2024-02-03T10:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      action: 'CREATE',
      permissionKey: 'custom_feature_access',
      role: null,
      oldValue: null,
      newValue: {
        key: 'custom_feature_access',
        label: 'Custom Feature Access',
        description: 'Access to custom features',
        category: 'Custom'
      },
      changedBy: 'Admin User',
      changedAt: '2024-02-03T09:15:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 3,
      action: 'DISABLE',
      permissionKey: 'export_data',
      role: 'team_leader',
      oldValue: { enabled: true },
      newValue: { enabled: false },
      changedBy: 'Admin User',
      changedAt: '2024-02-02T16:45:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 4,
      action: 'UPDATE',
      permissionKey: 'manage_team',
      role: null,
      oldValue: { description: 'Basic team management' },
      newValue: { description: 'Advanced team management with reporting' },
      changedBy: 'Admin User',
      changedAt: '2024-02-02T14:20:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 5,
      action: 'DELETE',
      permissionKey: 'old_feature_access',
      role: null,
      oldValue: {
        key: 'old_feature_access',
        label: 'Old Feature Access',
        description: 'Access to deprecated features'
      },
      newValue: null,
      changedBy: 'Admin User',
      changedAt: '2024-02-01T11:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ];

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAuditLogs(mockAuditLogs);
    setLoading(false);
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filters.action && log.action !== filters.action) return false;
    if (filters.user && !log.changedBy.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.role && log.role !== filters.role) return false;
    if (filters.dateFrom && new Date(log.changedAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(log.changedAt) > new Date(filters.dateTo)) return false;
    return true;
  });

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE': return FiShield;
      case 'UPDATE': return FiEdit3;
      case 'DELETE': return FiTrash2;
      case 'ENABLE': return FiCheck;
      case 'DISABLE': return FiX;
      default: return FiActivity;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'ENABLE': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'DISABLE': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const exportAuditLog = () => {
    const exportData = filteredLogs.map(log => ({
      timestamp: format(new Date(log.changedAt), 'yyyy-MM-dd HH:mm:ss'),
      action: log.action,
      permission: log.permissionKey,
      role: log.role || 'Global',
      changedBy: log.changedBy,
      ipAddress: log.ipAddress,
      details: JSON.stringify({ oldValue: log.oldValue, newValue: log.newValue })
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permission_audit_log_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setFilters({
      action: '',
      user: '',
      dateFrom: '',
      dateTo: '',
      role: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Permission Audit Log
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track all permission-related changes and activities
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={loadAuditLogs}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <SafeIcon icon={FiRefreshCw} className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={exportAuditLog}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Filters</h4>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Reset
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="ENABLE">Enable</option>
              <option value="DISABLE">Disable</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User
            </label>
            <input
              type="text"
              value={filters.user}
              onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
              placeholder="Search by user..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Roles</option>
              <option value="staff">Staff</option>
              <option value="team_leader">Team Leader</option>
              <option value="manager">Manager</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredLogs.length} of {auditLogs.length} records
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Changed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2 text-gray-400" />
                      {format(new Date(log.changedAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SafeIcon icon={getActionIcon(log.action)} className="w-4 h-4 mr-2" />
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                      {log.permissionKey}
                    </code>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.role ? (
                      <span className="capitalize">{log.role.replace('_', ' ')}</span>
                    ) : (
                      <span className="text-gray-500 italic">Global</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-2 text-gray-400" />
                      {log.changedBy}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        const details = {
                          oldValue: log.oldValue,
                          newValue: log.newValue,
                          ipAddress: log.ipAddress,
                          userAgent: log.userAgent
                        };
                        alert(JSON.stringify(details, null, 2));
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <SafeIcon icon={FiEye} className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No audit records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['CREATE', 'UPDATE', 'DELETE', 'ENABLE', 'DISABLE'].map(action => {
          const count = filteredLogs.filter(log => log.action === action).length;
          return (
            <div key={action} className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${getActionColor(action)}`}>
                <SafeIcon icon={getActionIcon(action)} className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{action.toLowerCase()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionAuditLog;