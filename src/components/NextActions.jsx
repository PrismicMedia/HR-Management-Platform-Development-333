import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiCalendar, FiTrendingUp, FiFileText } = FiIcons;

const NextActions = () => {
  const { t } = useTranslation();

  const actions = [
    {
      id: 1,
      title: 'Complete Q4 Review',
      description: 'Submit your quarterly performance review',
      dueDate: 'Due in 3 days',
      priority: 'high',
      icon: FiFileText,
      color: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Update Skills Matrix',
      description: 'Add new React skills to your profile',
      dueDate: 'Due in 1 week',
      priority: 'medium',
      icon: FiTrendingUp,
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      title: 'Book Annual Leave',
      description: 'Plan your vacation for next quarter',
      dueDate: 'No deadline',
      priority: 'low',
      icon: FiCalendar,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('nextActions')}
      </h2>
      
      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 rtl:space-x-reverse p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <SafeIcon icon={action.icon} className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {action.description}
              </p>
              <div className="flex items-center mt-2">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {action.dueDate}
                </span>
              </div>
            </div>
            
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              action.priority === 'high' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                : action.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>
              {action.priority}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NextActions;