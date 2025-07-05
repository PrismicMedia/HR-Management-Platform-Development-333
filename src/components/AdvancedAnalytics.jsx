import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import { useAuthStore } from '../store/authStore';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const { FiTrendingUp, FiUsers, FiClock, FiTarget, FiCalendar, FiBarChart, FiPieChart, FiActivity } = FiIcons;

const AdvancedAnalytics = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [analyticsData, setAnalyticsData] = useState({});

  // Mock analytics data
  const mockAnalytics = {
    overview: {
      totalEmployees: 156,
      activeProjects: 23,
      completedTasks: 342,
      averageProductivity: 87.5,
      leaveRequests: 12,
      performanceScore: 4.2
    },
    productivity: {
      daily: [
        { date: '2024-01-22', hours: 8.5, tasks: 5, efficiency: 85 },
        { date: '2024-01-23', hours: 8.0, tasks: 6, efficiency: 90 },
        { date: '2024-01-24', hours: 7.5, tasks: 4, efficiency: 78 },
        { date: '2024-01-25', hours: 8.5, tasks: 7, efficiency: 92 },
        { date: '2024-01-26', hours: 8.0, tasks: 5, efficiency: 88 }
      ],
      weekly: [
        { week: 'Week 1', hours: 40, tasks: 25, efficiency: 85 },
        { week: 'Week 2', hours: 38, tasks: 28, efficiency: 88 },
        { week: 'Week 3', hours: 42, tasks: 30, efficiency: 90 },
        { week: 'Week 4', hours: 39, tasks: 26, efficiency: 87 }
      ]
    },
    teamPerformance: [
      { department: 'Engineering', employees: 45, productivity: 92, satisfaction: 4.5 },
      { department: 'Design', employees: 18, productivity: 88, satisfaction: 4.3 },
      { department: 'Marketing', employees: 25, productivity: 85, satisfaction: 4.1 },
      { department: 'Sales', employees: 32, productivity: 90, satisfaction: 4.4 },
      { department: 'HR', employees: 12, productivity: 87, satisfaction: 4.2 }
    ],
    skillsAnalysis: [
      { skill: 'React', proficiency: 4.2, employees: 25, growth: 15 },
      { skill: 'Node.js', proficiency: 3.8, employees: 20, growth: 22 },
      { skill: 'Python', proficiency: 3.5, employees: 18, growth: 18 },
      { skill: 'Design Systems', proficiency: 4.0, employees: 12, growth: 25 },
      { skill: 'Project Management', proficiency: 3.9, employees: 15, growth: 12 }
    ]
  };

  useEffect(() => {
    setAnalyticsData(mockAnalytics);
  }, []);

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' },
    { key: 'year', label: 'This Year' }
  ];

  const MetricCard = ({ title, value, subtitle, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <SafeIcon icon={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <SafeIcon 
            icon={trend > 0 ? FiTrendingUp : FiTrendingUp} 
            className={`w-4 h-4 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} 
          />
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
          </span>
        </div>
      )}
    </motion.div>
  );

  const ProductivityChart = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Productivity Trends
        </h3>
        <div className="flex space-x-2">
          {periods.map(period => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simple Bar Chart Representation */}
      <div className="space-y-4">
        {analyticsData.productivity?.daily?.map((day, index) => (
          <div key={day.date} className="flex items-center space-x-4">
            <div className="w-16 text-xs text-gray-600 dark:text-gray-400">
              {format(new Date(day.date), 'MMM dd')}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {day.hours}h worked, {day.tasks} tasks
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {day.efficiency}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${day.efficiency}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-primary-600 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const TeamPerformanceGrid = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Team Performance by Department
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsData.teamPerformance?.map((dept, index) => (
          <motion.div
            key={dept.department}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              {dept.department}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Employees:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dept.employees}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Productivity:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dept.productivity}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Satisfaction:</span>
                <span className="font-medium text-gray-900 dark:text-white">{dept.satisfaction}/5</span>
              </div>
              
              {/* Productivity Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Productivity</span>
                  <span>{dept.productivity}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.productivity}%` }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="bg-green-500 h-1.5 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const SkillsAnalysis = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Skills Analysis & Growth
      </h3>
      
      <div className="space-y-4">
        {analyticsData.skillsAnalysis?.map((skill, index) => (
          <motion.div
            key={skill.skill}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {skill.skill}
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {skill.employees} employees
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Avg. Proficiency</span>
                    <span>{skill.proficiency}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.proficiency / 5) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+{skill.growth}%</span>
                  </div>
                  <span className="text-xs text-gray-500">growth</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Employees"
          value={analyticsData.overview?.totalEmployees}
          icon={FiUsers}
          color="bg-blue-500"
          trend={8}
        />
        <MetricCard
          title="Active Projects"
          value={analyticsData.overview?.activeProjects}
          icon={FiTarget}
          color="bg-green-500"
          trend={12}
        />
        <MetricCard
          title="Completed Tasks"
          value={analyticsData.overview?.completedTasks}
          subtitle="This month"
          icon={FiActivity}
          color="bg-purple-500"
          trend={15}
        />
        <MetricCard
          title="Avg. Productivity"
          value={`${analyticsData.overview?.averageProductivity}%`}
          icon={FiTrendingUp}
          color="bg-orange-500"
          trend={5}
        />
        <MetricCard
          title="Leave Requests"
          value={analyticsData.overview?.leaveRequests}
          subtitle="Pending approval"
          icon={FiCalendar}
          color="bg-red-500"
        />
        <MetricCard
          title="Performance Score"
          value={`${analyticsData.overview?.performanceScore}/5`}
          subtitle="Company average"
          icon={FiBarChart}
          color="bg-indigo-500"
          trend={3}
        />
      </div>

      {/* Productivity Chart */}
      <ProductivityChart />

      {/* Team Performance and Skills Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TeamPerformanceGrid />
        <SkillsAnalysis />
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Insights & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">High Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Engineering team shows 92% productivity, 15% above company average
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <SafeIcon icon={FiTarget} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Skill Growth</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Design Systems skills growing 25% faster than other areas
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Attendance Trends</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average work hours slightly below target, consider workload analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <SafeIcon icon={FiPieChart} className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Department Balance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consider cross-training between high and low performing departments
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedAnalytics;