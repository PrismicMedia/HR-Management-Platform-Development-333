import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../utils/translations';
import LeaveCalendar from '../components/LeaveCalendar';
import LeaveRequestModal from '../components/LeaveRequestModal';
import LeaveHistory from '../components/LeaveHistory';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiPlus, FiClock, FiCheck, FiX } = FiIcons;

const Leave = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const leaveStats = [
    {
      label: 'Total Balance',
      value: `${user?.leaveBalance || 0} days`,
      icon: FiCalendar,
      color: 'bg-blue-500'
    },
    {
      label: 'Used This Year',
      value: '12 days',
      icon: FiCheck,
      color: 'bg-green-500'
    },
    {
      label: 'Pending Requests',
      value: '2 days',
      icon: FiClock,
      color: 'bg-yellow-500'
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('leave')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your leave requests and balance
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            {t('requestLeave')}
          </motion.button>
        </div>
      </motion.div>

      {/* Leave Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calendar and History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LeaveCalendar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LeaveHistory />
        </motion.div>
      </div>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Leave;