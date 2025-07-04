import React from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUser, FiEdit3 } = FiIcons;

const TaskCard = ({ task, column, onEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
          {task.title}
        </h4>
        <button
          onClick={() => onEdit(task)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
        >
          <SafeIcon icon={FiEdit3} className="w-3 h-3 text-gray-500" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
          {format(new Date(task.dueDate), 'MMM dd')}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <SafeIcon icon={FiUser} className="w-3 h-3 mr-1" />
          {task.assignee}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;