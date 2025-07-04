import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSun, FiMoon, FiGlobe, FiBell, FiShield, FiHelpCircle } = FiIcons;

const Settings = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const settingsGroups = [
    {
      title: 'Appearance',
      settings: [
        {
          id: 'theme',
          title: 'Theme',
          description: 'Choose between light and dark mode',
          icon: theme === 'light' ? FiSun : FiMoon,
          action: (
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )
        },
        {
          id: 'language',
          title: 'Language',
          description: 'Choose your preferred language',
          icon: FiGlobe,
          action: (
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            >
              {language === 'en' ? 'English' : 'العربية'}
            </button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      settings: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          description: 'Receive notifications about important updates',
          icon: FiBell,
          action: (
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          )
        },
        {
          id: 'email-notifications',
          title: 'Email Notifications',
          description: 'Get email updates about your tasks and approvals',
          icon: FiBell,
          action: (
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          )
        }
      ]
    },
    {
      title: 'Security',
      settings: [
        {
          id: 'change-password',
          title: 'Change Password',
          description: 'Update your account password',
          icon: FiShield,
          action: (
            <button className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Change
            </button>
          )
        },
        {
          id: 'two-factor',
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          icon: FiShield,
          action: (
            <button className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
              Enable
            </button>
          )
        }
      ]
    },
    {
      title: 'Help & Support',
      settings: [
        {
          id: 'help-center',
          title: 'Help Center',
          description: 'Find answers to common questions',
          icon: FiHelpCircle,
          action: (
            <button className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
              Visit
            </button>
          )
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('settings')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account preferences and settings
          </p>
        </div>
      </motion.div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {group.title}
            </h2>
            
            <div className="space-y-4">
              {group.settings.map((setting, index) => (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <SafeIcon icon={setting.icon} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {setting.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  <div>
                    {setting.action}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">User ID:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{user?.id}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Role:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{user?.role}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Department:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{user?.department}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Join Date:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{user?.joinDate}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;