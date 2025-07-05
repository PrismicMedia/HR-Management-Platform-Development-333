import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../utils/translations';
import KPICard from '../components/KPICard';
import ActivityFeed from '../components/ActivityFeed';
import NextActions from '../components/NextActions';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiTrendingUp, FiUsers, FiAward, FiStar, FiZap } = FiIcons;

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const stats = [
    {
      name: t('leaveBalance'),
      value: `${user?.leaveBalance || 0} days`,
      icon: FiCalendar,
      color: 'from-blue-500 to-blue-600',
      change: '+2 days',
      changeType: 'positive'
    },
    {
      name: 'Tasks Completed',
      value: '23/25',
      icon: FiTrendingUp,
      color: 'from-primary-500 to-primary-600',
      change: '+3 this week',
      changeType: 'positive'
    },
    {
      name: 'Team Members',
      value: '8',
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      change: '+1 new hire',
      changeType: 'positive'
    },
    {
      name: 'Skills Gained',
      value: '3',
      icon: FiAward,
      color: 'from-secondary-500 to-secondary-600',
      change: '+1 this month',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="hurai-card p-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-0 shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-4 mb-4"
              >
                <div className="relative">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-4 ring-white dark:ring-gray-800"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <SafeIcon icon={FiZap} className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('welcome')}, {user?.name}! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                    {t('allSet')} Ready to make today productive?
                  </p>
                </div>
              </motion.div>
              
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.department}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    4.8 Performance
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="hurai-card p-6 relative overflow-hidden group"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* KPIs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="hurai-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full mr-3"></div>
            {t('kpiProgress')}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            This Quarter
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user?.kpis?.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <KPICard kpi={kpi} index={index} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <NextActions />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ActivityFeed />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;