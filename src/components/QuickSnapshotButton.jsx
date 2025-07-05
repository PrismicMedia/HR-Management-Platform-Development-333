import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import SnapshotGenerator from './SnapshotGenerator';
import * as FiIcons from 'react-icons/fi';

const { FiCamera, FiDownload } = FiIcons;

const QuickSnapshotButton = ({ 
  employee = null, 
  modules = ['kpis', 'skills', 'performance'], 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [showGenerator, setShowGenerator] = useState(false);

  const variants = {
    default: 'bg-primary-600 hover:bg-primary-700 text-white',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowGenerator(true)}
        className={`
          inline-flex items-center rounded-lg font-medium transition-all duration-200
          ${variants[variant]} ${sizes[size]} ${className}
        `}
      >
        <SafeIcon icon={FiCamera} className="w-4 h-4 mr-2" />
        Generate Snapshot
      </motion.button>

      <SnapshotGenerator
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        targetEmployee={employee}
        defaultModules={modules}
      />
    </>
  );
};

export default QuickSnapshotButton;