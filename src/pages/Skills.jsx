import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SkillsMatrix from '../components/SkillsMatrix';
import SkillModal from '../components/SkillModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrendingUp, FiAward, FiTarget } = FiIcons;

const Skills = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const skillStats = [
    {
      label: 'Total Skills',
      value: '12',
      icon: FiAward,
      color: 'bg-blue-500'
    },
    {
      label: 'Advanced Skills',
      value: '5',
      icon: FiTrendingUp,
      color: 'bg-green-500'
    },
    {
      label: 'Learning Goals',
      value: '3',
      icon: FiTarget,
      color: 'bg-purple-500'
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
              {t('skills')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track and develop your professional skills
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            {t('addSkill')}
          </motion.button>
        </div>
      </motion.div>

      {/* Skills Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillStats.map((stat, index) => (
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

      {/* Skills Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SkillsMatrix />
      </motion.div>

      {/* Skill Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Skills;