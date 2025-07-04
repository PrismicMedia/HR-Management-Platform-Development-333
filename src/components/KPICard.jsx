import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ kpi, index }) => {
  const percentage = (kpi.current / kpi.target) * 100;
  const isOnTrack = percentage >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {kpi.name}
        </h3>
        <span className={`text-sm px-2 py-1 rounded-full ${
          isOnTrack 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {isOnTrack ? 'On Track' : 'Behind'}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span>{kpi.current} / {kpi.target} {kpi.unit}</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`h-2 rounded-full ${
              isOnTrack ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
        </div>
        
        <div className="text-right">
          <span className={`text-sm font-medium ${
            isOnTrack ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
          }`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;