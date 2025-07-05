import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import { useAuthStore } from '../store/authStore';
import { useSops } from '../hooks/useSupabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiX } = FiIcons;

const SOPModal = ({ isOpen, onClose, sop, onSaved }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { createSop, updateSop, loading } = useSops();
  const [formData, setFormData] = useState({
    title: sop?.title || '',
    content: sop?.content || '',
    department: sop?.department || ''
  });

  useEffect(() => {
    setFormData({
      title: sop?.title || '',
      content: sop?.content || '',
      department: sop?.department || ''
    });
  }, [sop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      content: formData.content,
      department: formData.department,
      updated_by: user?.id,
      created_by: sop ? sop.created_by : user?.id
    };
    try {
      if (sop) {
        await updateSop(sop.id, data);
        toast.success('SOP updated');
      } else {
        await createSop(data);
        toast.success('SOP created');
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      toast.error('Failed to save SOP');
      console.error('SOP save error:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {sop ? t('editSop') : t('addSop')}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                <input type="text" value={formData.department} onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  {t('cancel')}
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
                  {loading ? t('loading') : t('save')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SOPModal;
