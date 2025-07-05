import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import AdvancedAnalytics from '../components/AdvancedAnalytics';

const Analytics = () => {
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
            Advanced Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into team performance, productivity, and growth
          </p>
        </div>
      </motion.div>

      {/* Analytics Component */}
      <AdvancedAnalytics />
    </div>
  );
};

export default Analytics;