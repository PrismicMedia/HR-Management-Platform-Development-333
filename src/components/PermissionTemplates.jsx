import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiTemplate, FiPlus, FiEdit3, FiTrash2, FiCopy, FiDownload, FiUpload, FiSave, FiX } = FiIcons;

const PermissionTemplates = ({ onApplyTemplate }) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Basic Employee',
      description: 'Standard permissions for regular employees',
      permissions: ['view_own_profile', 'edit_own_profile', 'request_leave', 'view_own_tasks'],
      category: 'Standard',
      isSystem: true,
      createdBy: 'System',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Team Lead Plus',
      description: 'Enhanced permissions for senior team leaders',
      permissions: ['view_own_profile', 'edit_own_profile', 'request_leave', 'endorse_leave', 'view_team', 'assign_tasks'],
      category: 'Leadership',
      isSystem: true,
      createdBy: 'System',
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Department Manager',
      description: 'Full departmental management permissions',
      permissions: ['approve_leave', 'manage_team', 'view_reports', 'generate_reports'],
      category: 'Management',
      isSystem: true,
      createdBy: 'System',
      createdAt: '2024-01-01'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    permissions: [],
    category: 'Custom'
  });

  const categories = ['Standard', 'Leadership', 'Management', 'Custom', 'Temporary'];

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    const template = {
      id: Date.now(),
      ...newTemplate,
      isSystem: false,
      createdBy: 'Admin User',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', description: '', permissions: [], category: 'Custom' });
    setShowCreateModal(false);
    toast.success('Template created successfully!');
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate({ ...template });
  };

  const handleSaveEdit = () => {
    setTemplates(prev => prev.map(t => 
      t.id === editingTemplate.id ? editingTemplate : t
    ));
    setEditingTemplate(null);
    toast.success('Template updated successfully!');
  };

  const handleDeleteTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isSystem) {
      toast.error('System templates cannot be deleted');
      return;
    }

    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully!');
    }
  };

  const handleDuplicateTemplate = (template) => {
    const duplicate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      isSystem: false,
      createdBy: 'Admin User',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTemplates(prev => [...prev, duplicate]);
    toast.success('Template duplicated successfully!');
  };

  const handleExportTemplate = (template) => {
    const exportData = {
      name: template.name,
      description: template.description,
      permissions: template.permissions,
      category: template.category,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template exported successfully!');
  };

  const handleImportTemplate = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        const template = {
          id: Date.now(),
          name: importData.name || 'Imported Template',
          description: importData.description || '',
          permissions: importData.permissions || [],
          category: importData.category || 'Custom',
          isSystem: false,
          createdBy: 'Admin User',
          createdAt: new Date().toISOString().split('T')[0]
        };

        setTemplates(prev => [...prev, template]);
        toast.success('Template imported successfully!');
      } catch (error) {
        toast.error('Invalid template file format');
      }
    };
    reader.readAsText(file);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Standard': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Leadership': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Management': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Custom': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Temporary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Permission Templates
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create and manage reusable permission sets
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm cursor-pointer">
            <SafeIcon icon={FiUpload} className="w-4 h-4 mr-1" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportTemplate}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
            Create Template
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTemplate} className="w-5 h-5 text-primary-600" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>
              
              {template.isSystem && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">
                  System
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {template.description}
            </p>

            <div className="mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Permissions ({template.permissions.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {template.permissions.slice(0, 3).map(perm => (
                  <span key={perm} className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded text-xs">
                    {perm.replace('_', ' ')}
                  </span>
                ))}
                {template.permissions.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs">
                    +{template.permissions.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>By {template.createdBy}</span>
              <span>{template.createdAt}</span>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => onApplyTemplate(template)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Apply
              </button>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Duplicate"
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleExportTemplate(template)}
                  className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                  title="Export"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-1 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded transition-colors"
                  title="Edit"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                </button>
                
                {!template.isSystem && (
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Template Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Create Permission Template
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Describe this template's purpose..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Create Template
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Template Modal */}
      <AnimatePresence>
        {editingTemplate && (
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Template
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={editingTemplate.isSystem}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingTemplate.description}
                      onChange={(e) => setEditingTemplate(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PermissionTemplates;