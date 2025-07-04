import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiTrendingUp, FiCode, FiDatabase, FiLayers } = FiIcons;

const SkillsMatrix = () => {
  const { t } = useTranslation();
  
  const [skills, setSkills] = useState([
    {
      id: 1,
      name: 'React',
      category: 'Frontend',
      proficiency: 4,
      icon: FiCode,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Node.js',
      category: 'Backend',
      proficiency: 3,
      icon: FiDatabase,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'TypeScript',
      category: 'Frontend',
      proficiency: 3,
      icon: FiCode,
      color: 'bg-blue-600'
    },
    {
      id: 4,
      name: 'MongoDB',
      category: 'Database',
      proficiency: 2,
      icon: FiDatabase,
      color: 'bg-green-600'
    },
    {
      id: 5,
      name: 'Docker',
      category: 'DevOps',
      proficiency: 2,
      icon: FiLayers,
      color: 'bg-purple-500'
    },
    {
      id: 6,
      name: 'AWS',
      category: 'Cloud',
      proficiency: 3,
      icon: FiLayers,
      color: 'bg-orange-500'
    }
  ]);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const getProficiencyLabel = (level) => {
    switch (level) {
      case 1: return t('beginner');
      case 2: return t('intermediate');
      case 3: return t('advanced');
      case 4: return t('expert');
      default: return t('beginner');
    }
  };

  const getProficiencyColor = (level) => {
    switch (level) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('skillsMatrix')}
        </h2>
        
        {/* Category Filter */}
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${skill.color}`}>
                  <SafeIcon icon={skill.icon} className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {skill.category}
                  </p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                <SafeIcon icon={FiEdit3} className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('proficiency')}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getProficiencyLabel(skill.proficiency)}
                </span>
              </div>
              
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full ${
                      level <= skill.proficiency 
                        ? getProficiencyColor(skill.proficiency)
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No skills found in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsMatrix;