import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { 
  FiUser, FiTrendingUp, FiAward, FiCalendar, FiMail, FiPhone, 
  FiMapPin, FiDownload, FiShare2, FiCopy, FiSettings, FiEye,
  FiStar, FiClock, FiTarget, FiActivity, FiBarChart, FiFileText
} = FiIcons;

const EmployeeSnapshot = ({ employeeData, modules = [], theme = 'light', onClose }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const snapshotRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModules, setSelectedModules] = useState(modules);

  // Use provided employee data or fallback to current user
  const employee = employeeData || user;

  // Available modules that can be included in the snapshot
  const availableModules = [
    {
      id: 'basic_info',
      name: 'Basic Information',
      icon: FiUser,
      component: BasicInfoModule,
      enabled: true,
      required: true
    },
    {
      id: 'kpis',
      name: 'Key Performance Indicators',
      icon: FiTrendingUp,
      component: KPIModule,
      enabled: modules.includes('kpis')
    },
    {
      id: 'skills',
      name: 'Skills & Competencies',
      icon: FiAward,
      component: SkillsModule,
      enabled: modules.includes('skills')
    },
    {
      id: 'attendance',
      name: 'Attendance Summary',
      icon: FiClock,
      component: AttendanceModule,
      enabled: modules.includes('attendance')
    },
    {
      id: 'goals',
      name: 'Current Goals',
      icon: FiTarget,
      component: GoalsModule,
      enabled: modules.includes('goals')
    },
    {
      id: 'performance',
      name: 'Performance Rating',
      icon: FiStar,
      component: PerformanceModule,
      enabled: modules.includes('performance')
    },
    {
      id: 'projects',
      name: 'Active Projects',
      icon: FiActivity,
      component: ProjectsModule,
      enabled: modules.includes('projects')
    },
    {
      id: 'leave_balance',
      name: 'Leave Balance',
      icon: FiCalendar,
      component: LeaveBalanceModule,
      enabled: modules.includes('leave_balance')
    }
  ];

  const enabledModules = availableModules.filter(module => 
    module.required || selectedModules.includes(module.id)
  );

  const handleDownloadSnapshot = async () => {
    if (!snapshotRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(snapshotRef.current, {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `${employee.name.replace(/\s+/g, '_')}_snapshot_${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Snapshot downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate snapshot');
      console.error('Snapshot generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!snapshotRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(snapshotRef.current, {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success('Snapshot copied to clipboard!');
        } catch (error) {
          toast.error('Failed to copy to clipboard');
        }
        setIsGenerating(false);
      });
    } catch (error) {
      toast.error('Failed to generate snapshot');
      setIsGenerating(false);
    }
  };

  const handleShareSnapshot = async () => {
    if (!snapshotRef.current) return;
    
    try {
      const canvas = await html2canvas(snapshotRef.current, {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        scale: 2
      });
      
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${employee.name}_snapshot.png`, { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            title: `${employee.name} - Employee Snapshot`,
            text: `Employee snapshot for ${employee.name}`,
            files: [file]
          });
        } else {
          // Fallback to download
          handleDownloadSnapshot();
        }
      });
    } catch (error) {
      toast.error('Failed to share snapshot');
    }
  };

  const toggleModule = (moduleId) => {
    const module = availableModules.find(m => m.id === moduleId);
    if (module?.required) return; // Can't toggle required modules
    
    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Employee Snapshot
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate and share employee information snapshot
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyToClipboard}
            disabled={isGenerating}
            className="hurai-button hurai-button-ghost text-sm disabled:opacity-50"
          >
            <SafeIcon icon={FiCopy} className="w-4 h-4 mr-1" />
            Copy
          </button>
          <button
            onClick={handleShareSnapshot}
            disabled={isGenerating}
            className="hurai-button hurai-button-secondary text-sm disabled:opacity-50"
          >
            <SafeIcon icon={FiShare2} className="w-4 h-4 mr-1" />
            Share
          </button>
          <button
            onClick={handleDownloadSnapshot}
            disabled={isGenerating}
            className="hurai-button hurai-button-primary text-sm disabled:opacity-50"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
            {isGenerating ? 'Generating...' : 'Download'}
          </button>
        </div>
      </div>

      {/* Module Selection */}
      <div className="hurai-card p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select Modules to Include
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableModules.map(module => (
            <button
              key={module.id}
              onClick={() => toggleModule(module.id)}
              disabled={module.required}
              className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                module.required || selectedModules.includes(module.id)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
              } ${module.required ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <SafeIcon icon={module.icon} className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{module.name}</span>
              {module.required && (
                <span className="ml-1 text-xs text-gray-500">(Required)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Snapshot Preview */}
      <div 
        ref={snapshotRef}
        className={`hurai-card overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}
        style={{ width: '800px', margin: '0 auto' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-6">
          <div className="flex items-center space-x-4">
            <img
              src={employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=22c55e&color=fff`}
              alt={employee.name}
              className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <p className="text-green-100 text-lg">{employee.role}</p>
              <p className="text-green-200">{employee.department}</p>
            </div>
          </div>
          <div className="mt-4 text-right text-green-100 text-sm">
            Generated on {format(new Date(), 'MMMM dd, yyyy')}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enabledModules.map((module, index) => {
              const ModuleComponent = module.component;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModuleComponent employee={employee} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            HuRai HR Platform - Confidential Employee Information
          </p>
        </div>
      </div>
    </div>
  );
};

// Module Components (keeping the same implementations but with HuRai branding)
function BasicInfoModule({ employee }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiUser} className="w-5 h-5 text-primary-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Basic Information</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">{employee.email}</span>
        </div>
        <div className="flex items-center">
          <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">{employee.phone || '+1 (555) 123-4567'}</span>
        </div>
        <div className="flex items-center">
          <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Joined: {employee.joinDate || 'Jan 2023'}</span>
        </div>
        <div className="flex items-center">
          <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">{employee.address || 'Kuwait City, Kuwait'}</span>
        </div>
      </div>
    </div>
  );
}

function KPIModule({ employee }) {
  const kpis = [
    { name: 'Performance', value: 92, target: 90, unit: '%' },
    { name: 'Tasks Completed', value: 48, target: 50, unit: 'tasks' },
    { name: 'Efficiency', value: 87, target: 85, unit: '%' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-primary-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Key Performance Indicators</h3>
      </div>
      <div className="space-y-3">
        {kpis.map((kpi, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{kpi.name}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {kpi.value} / {kpi.target} {kpi.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsModule({ employee }) {
  const skills = [
    { name: 'React', level: 4, category: 'Frontend' },
    { name: 'Node.js', level: 3, category: 'Backend' },
    { name: 'Leadership', level: 3, category: 'Soft Skills' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiAward} className="w-5 h-5 text-secondary-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Skills & Competencies</h3>
      </div>
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
              <span className="text-xs text-gray-500 ml-2">{skill.category}</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(level => (
                <div
                  key={level}
                  className={`w-2 h-2 rounded-full ${
                    level <= skill.level ? 'bg-secondary-500' : 'bg-gray-300 dark:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendanceModule({ employee }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiClock} className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Attendance Summary</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-primary-600">95%</div>
          <div className="text-gray-600 dark:text-gray-300">Attendance Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary-600">168h</div>
          <div className="text-gray-600 dark:text-gray-300">This Month</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">8.2h</div>
          <div className="text-gray-600 dark:text-gray-300">Avg Daily</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">2</div>
          <div className="text-gray-600 dark:text-gray-300">Late Days</div>
        </div>
      </div>
    </div>
  );
}

function GoalsModule({ employee }) {
  const goals = [
    { title: 'Complete React Certification', progress: 75, priority: 'high' },
    { title: 'Lead Team Project', progress: 40, priority: 'medium' },
    { title: 'Improve Code Quality', progress: 60, priority: 'medium' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiTarget} className="w-5 h-5 text-indigo-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Current Goals</h3>
      </div>
      <div className="space-y-2">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-900 dark:text-white">{goal.title}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceModule({ employee }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Performance Rating</h3>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-yellow-600 mb-1">4.2</div>
        <div className="flex justify-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map(star => (
            <SafeIcon
              key={star}
              icon={FiStar}
              className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Excellent Performance</div>
        <div className="text-xs text-gray-500 mt-1">Last Review: Q4 2023</div>
      </div>
    </div>
  );
}

function ProjectsModule({ employee }) {
  const projects = [
    { name: 'HuRai Platform', role: 'Lead Developer', status: 'In Progress' },
    { name: 'Mobile App', role: 'Frontend Dev', status: 'Planning' },
    { name: 'API Gateway', role: 'Contributor', status: 'Completed' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiActivity} className="w-5 h-5 text-teal-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Active Projects</h3>
      </div>
      <div className="space-y-2">
        {projects.map((project, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
              <div className="text-gray-600 dark:text-gray-300">{project.role}</div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              project.status === 'Completed' ? 'bg-primary-100 text-primary-800' :
              project.status === 'In Progress' ? 'bg-secondary-100 text-secondary-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaveBalanceModule({ employee }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiCalendar} className="w-5 h-5 text-emerald-600 mr-2" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Leave Balance</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-primary-600">{employee.leaveBalance || 25}</div>
          <div className="text-gray-600 dark:text-gray-300">Days Remaining</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary-600">5</div>
          <div className="text-gray-600 dark:text-gray-300">Days Used</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">2</div>
          <div className="text-gray-600 dark:text-gray-300">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">30</div>
          <div className="text-gray-600 dark:text-gray-300">Total Annual</div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSnapshot;