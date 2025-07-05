import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiCalendar, FiTrendingUp, FiEdit3, FiClock } = FiIcons;

const GoalCard = ({ goal, index, onEdit }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'performance': return FiTrendingUp;
      case 'development': return FiTarget;
      case 'behavioral': return FiTarget;
      default: return FiTarget;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'performance': return 'bg-blue-500';
      case 'development': return 'bg-green-500';
      case 'behavioral': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isOverdue = new Date(goal.targetDate) < new Date() && goal.status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
            <SafeIcon icon={getCategoryIcon(goal.category)} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {goal.title}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {goal.category}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
            {goal.priority}
          </span>
          <button
            onClick={() => onEdit(goal)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <SafeIcon icon={FiEdit3} className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {goal.description}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {goal.progress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
            <span>
              {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
            </span>
            {isOverdue && (
              <div className="flex items-center space-x-1 text-red-500">
                <SafeIcon icon={FiClock} className="w-4 h-4" />
                <span className="text-xs">Overdue</span>
              </div>
            )}
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            goal.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            goal.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
          }`}>
            {goal.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalCard;