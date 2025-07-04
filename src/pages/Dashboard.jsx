import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../utils/translations';
import KPICard from '../components/KPICard';
import ActivityFeed from '../components/ActivityFeed';
import NextActions from '../components/NextActions';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiTrendingUp, FiUsers, FiAward } = FiIcons;

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const stats = [
    {
      name: t('leaveBalance'),
      value: `${user?.leaveBalance || 0} days`,
      icon: FiCalendar,
      color: 'bg-blue-500',
      change: '+2 days',
      changeType: 'positive'
    },
    {
      name: 'Tasks Completed',
      value: '23/25',
      icon: FiTrendingUp,
      color: 'bg-green-500',
      change: '+3 this week',
      changeType: 'positive'
    },
    {
      name: 'Team Members',
      value: '8',
      icon: FiUsers,
      color: 'bg-purple-500',
      change: '+1 new hire',
      changeType: 'positive'
    },
    {
      name: 'Skills Gained',
      value: '3',
      icon: FiAward,
      color: 'bg-orange-500',
      change: '+1 this month',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('welcome')}, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('allSet')}
            </p>
          </div>
          <div className="hidden md:block">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 rtl:ml-0 rtl:mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPIs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('kpiProgress')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user?.kpis?.map((kpi, index) => (
            <KPICard key={kpi.id} kpi={kpi} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <NextActions />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActivityFeed />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;