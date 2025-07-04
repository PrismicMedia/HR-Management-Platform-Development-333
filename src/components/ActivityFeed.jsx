import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiCalendar, FiTrendingUp, FiUser, FiClock } = FiIcons;

const ActivityFeed = () => {
  const { t } = useTranslation();

  const activities = [
    {
      id: 1,
      type: 'kpi_update',
      title: 'KPI Updated',
      description: 'Code Quality score increased to 85%',
      time: '2 hours ago',
      icon: FiTrendingUp,
      color: 'bg-green-500'
    },
    {
      id: 2,
      type: 'leave_approved',
      title: 'Leave Approved',
      description: 'Your vacation request for Dec 20-25 was approved',
      time: '1 day ago',
      icon: FiCalendar,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'task_completed',
      title: 'Task Completed',
      description: 'Finished React component optimization',
      time: '2 days ago',
      icon: FiCheck,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'Added new skill: TypeScript',
      time: '3 days ago',
      icon: FiUser,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('recentActivity')}
      </h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 rtl:space-x-reverse"
          >
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <SafeIcon icon={activity.icon} className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
              <div className="flex items-center mt-2">
                <SafeIcon icon={FiClock} className="w-3 h-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
      >
        View All Activity
      </motion.button>
    </div>
  );
};

export default ActivityFeed;