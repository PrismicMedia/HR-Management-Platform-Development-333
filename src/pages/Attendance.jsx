import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import AttendanceTracker from '../components/AttendanceTracker';

const Attendance = () => {
  const { t } = useTranslation();

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
            Attendance Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your work hours and attendance
          </p>
        </div>
      </motion.div>

      {/* Attendance Tracker */}
      <AttendanceTracker />
    </div>
  );
};

export default Attendance;