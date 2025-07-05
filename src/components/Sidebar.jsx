import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, FiTrendingUp, FiCalendar, FiAward, FiFileText, 
  FiUser, FiSettings, FiShield, FiLogOut, FiStar, FiClock, 
  FiUsers, FiBarChart 
} = FiIcons;

const Sidebar = ({ onClose }) => {
  const { user, logout, hasPermission } = useAuthStore();
  const { t } = useTranslation();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: FiHome },
    { name: 'Attendance', href: '/attendance', icon: FiClock },
    { name: 'Performance', href: '/performance', icon: FiStar },
    { name: t('growthPlan'), href: '/growth-plan', icon: FiTrendingUp },
    { name: t('leave'), href: '/leave', icon: FiCalendar },
    { name: t('skills'), href: '/skills', icon: FiAward },
    { name: 'Team Collaboration', href: '/team', icon: FiUsers },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart },
    { name: t('payslips'), href: '/payslips', icon: FiFileText },
    { name: t('profile'), href: '/profile', icon: FiUser },
    { name: t('settings'), href: '/settings', icon: FiSettings },
  ];

  if (hasPermission('manage_team')) {
    navigation.push({ name: t('admin'), href: '/admin', icon: FiShield });
  }

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col w-64 hurai-sidebar h-full">
      {/* HuRai Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3">
          {/* HuRai Logo Icon */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              HuRai
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">HR Reimagined</p>
          </div>
        </div>
      </motion.div>

      {/* User Info Card */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="hurai-card p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 border-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-10 h-10 rounded-xl object-cover shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {user?.department}
              </p>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <NavLink
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <SafeIcon 
                    icon={item.icon} 
                    className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                      isActive ? 'text-white scale-110' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }`} 
                  />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Logout Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
        >
          <SafeIcon 
            icon={FiLogOut} 
            className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" 
          />
          <span>{t('logout')}</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Sidebar;