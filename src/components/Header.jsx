import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import SupabaseStatus from './SupabaseStatus';
import SetupWizard from './SetupWizard';
import ConnectionTroubleshooter from './ConnectionTroubleshooter';
import NotificationCenter from './NotificationCenter';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiSun, FiMoon, FiGlobe, FiBell, FiSettings, FiTool, FiSearch } = FiIcons;

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality
    }
  };

  return (
    <>
      <header className="hurai-nav sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden transition-colors"
            >
              <SafeIcon icon={FiMenu} className="w-5 h-5" />
            </motion.button>

            {/* Search bar - Desktop */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiSearch} className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search HuRai..."
                  className="hurai-input pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-xl text-sm"
                />
              </form>
            </div>

            {/* Page title - Mobile */}
            <div className="md:hidden">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                {t('dashboard')}
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Supabase Status */}
            <div className="hidden lg:block">
              <SupabaseStatus />
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-1">
              {/* Connection Troubleshooter */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTroubleshooter(true)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Connection Troubleshooter"
              >
                <SafeIcon icon={FiTool} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              {/* Setup Wizard */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSetupWizard(true)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Setup Guide"
              >
                <SafeIcon icon={FiSettings} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <SafeIcon 
                  icon={theme === 'light' ? FiMoon : FiSun} 
                  className="w-4 h-4 text-gray-600 dark:text-gray-400" 
                />
              </motion.button>

              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
              >
                <SafeIcon icon={FiGlobe} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Notifications"
              >
                <SafeIcon icon={FiBell} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg"
                >
                  3
                </motion.span>
              </motion.button>
            </div>

            {/* User Avatar */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 ml-4 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-xl object-cover shadow-md ring-2 ring-white dark:ring-gray-800"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-32">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SetupWizard 
        isOpen={showSetupWizard} 
        onClose={() => setShowSetupWizard(false)} 
      />
      <ConnectionTroubleshooter 
        isOpen={showTroubleshooter} 
        onClose={() => setShowTroubleshooter(false)} 
      />
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};

export default Header;