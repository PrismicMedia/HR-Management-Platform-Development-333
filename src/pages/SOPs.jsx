import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSops } from '../hooks/useSupabase';
import { useTranslation } from '../utils/translations';
import SOPModal from '../components/SOPModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit, FiTrash } = FiIcons;

const SOPs = () => {
  const { t } = useTranslation();
  const { getSops, deleteSop } = useSops();
  const [sops, setSops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSop, setSelectedSop] = useState(null);

  const fetchSops = async () => {
    const { data } = await getSops();
    if (data) setSops(data);
  };

  useEffect(() => {
    fetchSops();
  }, []);

  const handleEdit = (sop) => {
    setSelectedSop(sop);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSop(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteSop(id);
    fetchSops();
  };

  const handleSaved = () => {
    fetchSops();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sops')}</h1>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCreate} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            {t('addSop')}
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ul className="space-y-4">
          {sops.map((sop) => (
            <li key={sop.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sop.title}</h3>
                {sop.department && <p className="text-sm text-gray-500 dark:text-gray-400">{sop.department}</p>}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(sop)} className="text-primary-600 hover:text-primary-800">
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(sop.id)} className="text-red-600 hover:text-red-800">
                  <SafeIcon icon={FiTrash} className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <SOPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} sop={selectedSop} onSaved={handleSaved} />
    </div>
  );
};

export default SOPs;
