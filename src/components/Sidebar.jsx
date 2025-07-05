import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiTrendingUp, FiCalendar, FiAward, FiFileText, FiUser, FiSettings, FiShield, FiLogOut, FiStar } = FiIcons;

const Sidebar = ({ onClose }) => {
  const { user, logout, hasPermission } = useAuthStore();
  const { t } = useTranslation();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: FiHome },
    { name: 'Performance', href: '/performance', icon: FiStar },
    { name: t('growthPlan'), href: '/growth-plan', icon: FiTrendingUp },
    { name: t('leave'), href: '/leave', icon: FiCalendar },
    { name: t('skills'), href: '/skills', icon: FiAward },
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
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Agency HR
        </h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.department}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
          {t('logout')}
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;