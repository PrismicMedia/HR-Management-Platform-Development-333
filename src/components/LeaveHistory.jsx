import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiClock, FiX, FiCalendar } = FiIcons;

const LeaveHistory = () => {
  const { t } = useTranslation();

  const leaveRequests = [
    {
      id: 1,
      startDate: '2024-02-05',
      endDate: '2024-02-06',
      days: 2,
      type: 'Vacation',
      status: 'approved',
      reason: 'Family vacation',
      appliedOn: '2024-01-20'
    },
    {
      id: 2,
      startDate: '2024-02-15',
      endDate: '2024-02-15',
      days: 1,
      type: 'Sick Leave',
      status: 'pending',
      reason: 'Medical appointment',
      appliedOn: '2024-02-10'
    },
    {
      id: 3,
      startDate: '2024-02-20',
      endDate: '2024-02-20',
      days: 1,
      type: 'Personal',
      status: 'rejected',
      reason: 'Personal matter',
      appliedOn: '2024-02-08'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return FiCheck;
      case 'pending': return FiClock;
      case 'rejected': return FiX;
      default: return FiClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t('leaveHistory')}
      </h2>

      <div className="space-y-4">
        {leaveRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {request.type}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    <SafeIcon icon={getStatusIcon(request.status)} className="w-3 h-3 mr-1" />
                    {request.status}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                  {format(new Date(request.startDate), 'MMM dd')} - {format(new Date(request.endDate), 'MMM dd')}
                  <span className="ml-2">({request.days} day{request.days > 1 ? 's' : ''})</span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {request.reason}
                </p>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Applied on {format(new Date(request.appliedOn), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeaveHistory;