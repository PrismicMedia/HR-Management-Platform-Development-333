import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import { useSkills } from '../hooks/useSupabase';
import { useAuthStore } from '../store/authStore';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiX, FiCode, FiDatabase, FiLayers, FiTrendingUp } = FiIcons;

const SkillModal = ({ isOpen, onClose, skill }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { createSkill, updateSkill, loading } = useSkills();
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || 'Frontend',
    proficiency: skill?.proficiency || 1,
    icon: skill?.icon || 'FiCode',
    notes: skill?.notes || ''
  });

  const categories = [
    { value: 'Frontend', label: 'Frontend', icon: FiCode },
    { value: 'Backend', label: 'Backend', icon: FiDatabase },
    { value: 'Database', label: 'Database', icon: FiDatabase },
    { value: 'DevOps', label: 'DevOps', icon: FiLayers },
    { value: 'Cloud', label: 'Cloud', icon: FiLayers },
    { value: 'Other', label: 'Other', icon: FiTrendingUp }
  ];

  const proficiencyLevels = [
    { value: 1, label: t('beginner'), description: 'Basic understanding' },
    { value: 2, label: t('intermediate'), description: 'Can work with guidance' },
    { value: 3, label: t('advanced'), description: 'Can work independently' },
    { value: 4, label: t('expert'), description: 'Can teach others' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const skillData = {
      user_id: user?.id,
      name: formData.name,
      category: formData.category,
      proficiency: formData.proficiency,
      icon: formData.icon,
      notes: formData.notes
    };

    try {
      if (skill) {
        await updateSkill(skill.id, skillData);
        toast.success('Skill updated successfully!');
      } else {
        await createSkill(skillData);
        toast.success('Skill added successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save skill');
      console.error('Skill save error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {skill ? 'Edit Skill' : t('addSkill')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., React, Node.js, Docker"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('proficiency')}
                </label>
                <div className="space-y-2">
                  {proficiencyLevels.map(level => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="proficiency"
                        value={level.value}
                        checked={formData.proficiency === level.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                        className="mr-3 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {level.label}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {level.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Additional notes about your experience with this skill..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (skill ? t('save') : 'Add Skill')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkillModal;