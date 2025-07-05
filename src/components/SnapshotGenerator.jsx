import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import EmployeeSnapshot from './EmployeeSnapshot';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCamera, FiX, FiUser, FiUsers, FiSettings } = FiIcons;

const SnapshotGenerator = ({ isOpen, onClose, targetEmployee = null }) => {
  const { user, hasPermission } = useAuthStore();
  const { theme } = useThemeStore();
  const [selectedEmployee, setSelectedEmployee] = useState(targetEmployee || user);
  const [selectedModules, setSelectedModules] = useState([
    'kpis', 'skills', 'attendance', 'performance', 'leave_balance'
  ]);

  // Mock employees list for admin users
  const employees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@agency.com',
      role: 'Senior Developer',
      department: 'Engineering',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0ea5e9&color=fff',
      joinDate: 'Jan 2023',
      leaveBalance: 25
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@agency.com',
      role: 'Lead Designer',
      department: 'Design',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff',
      joinDate: 'Mar 2023',
      leaveBalance: 28
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@agency.com',
      role: 'Marketing Manager',
      department: 'Marketing',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff',
      joinDate: 'Aug 2022',
      leaveBalance: 30
    }
  ];

  const availableModules = [
    { id: 'kpis', name: 'Key Performance Indicators', description: 'Performance metrics and targets' },
    { id: 'skills', name: 'Skills & Competencies', description: 'Technical and soft skills assessment' },
    { id: 'attendance', name: 'Attendance Summary', description: 'Attendance rate and hours worked' },
    { id: 'goals', name: 'Current Goals', description: 'Active goals and progress tracking' },
    { id: 'performance', name: 'Performance Rating', description: 'Latest performance review score' },
    { id: 'projects', name: 'Active Projects', description: 'Current project assignments' },
    { id: 'leave_balance', name: 'Leave Balance', description: 'Vacation days and leave status' }
  ];

  const handleModuleToggle = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto"
      >
        <div className="min-h-screen px-4 py-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiCamera} className="w-6 h-6 text-primary-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Employee Snapshot Generator
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create professional employee information snapshots
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Selection */}
              {hasPermission('manage_team') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Select Employee
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[user, ...employees].map((employee) => (
                      <motion.div
                        key={employee.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedEmployee(employee)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedEmployee?.id === employee.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {employee.name}
                              {employee.id === user?.id && (
                                <span className="text-sm text-primary-600 ml-1">(You)</span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {employee.role}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Module Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Select Information Modules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableModules.map((module) => (
                    <motion.div
                      key={module.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModuleToggle(module.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedModules.includes(module.id)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {module.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {module.description}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedModules.includes(module.id)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedModules.includes(module.id) && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Snapshot Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Snapshot Preview
                </h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <EmployeeSnapshot
                    employeeData={selectedEmployee}
                    modules={selectedModules}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SnapshotGenerator;