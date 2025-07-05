import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../utils/translations';
import { usePerformanceReviews } from '../hooks/useSupabase';
import PerformanceReviewModal from '../components/PerformanceReviewModal';
import GoalsModal from '../components/GoalsModal';
import GoalCard from '../components/GoalCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiStar, FiTarget, FiTrendingUp, FiCalendar, FiUser, FiPlus, FiEye, FiEdit3 } = FiIcons;

const PerformanceReviews = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { getReviews, getGoals, loading } = usePerformanceReviews();
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsData, goalsData] = await Promise.all([
        getReviews(),
        getGoals()
      ]);
      setReviews(reviewsData.data || []);
      setGoals(goalsData.data || []);
    } catch (error) {
      console.error('Error loading performance data:', error);
      // Load mock data as fallback
      setReviews(mockReviews);
      setGoals(mockGoals);
    }
  };

  const mockReviews = [
    {
      id: 1,
      period: 'Q1 2024',
      status: 'completed',
      overallRating: 4.2,
      selfReviewCompleted: true,
      managerReviewCompleted: true,
      finalReviewDate: '2024-03-31',
      reviewer: 'Sarah Johnson'
    },
    {
      id: 2,
      period: 'Annual 2023',
      status: 'completed',
      overallRating: 4.0,
      selfReviewCompleted: true,
      managerReviewCompleted: true,
      finalReviewDate: '2024-01-15',
      reviewer: 'Sarah Johnson'
    },
    {
      id: 3,
      period: 'Q4 2023',
      status: 'pending',
      overallRating: null,
      selfReviewCompleted: false,
      managerReviewCompleted: false,
      finalReviewDate: null,
      reviewer: 'Sarah Johnson'
    }
  ];

  const mockGoals = [
    {
      id: 1,
      title: 'Complete React Certification',
      description: 'Obtain React certification to improve frontend development skills',
      category: 'development',
      targetDate: '2024-06-30',
      status: 'active',
      progress: 65,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Improve Code Review Quality',
      description: 'Provide more detailed and constructive code review feedback',
      category: 'performance',
      targetDate: '2024-04-30',
      status: 'active',
      progress: 40,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Lead Team Project',
      description: 'Successfully led a major project to demonstrate leadership skills',
      category: 'behavioral',
      targetDate: '2024-08-31',
      status: 'active',
      progress: 20,
      priority: 'high'
    }
  ];

  const tabs = [
    { id: 'reviews', label: 'Performance Reviews', icon: FiStar },
    { id: 'goals', label: 'Goals & Development', icon: FiTarget }
  ];

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setIsGoalModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <SafeIcon
        key={i}
        icon={FiStar}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderReviewsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance Reviews
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsReviewModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Start Self Review
        </motion.button>
      </div>

      <div className="grid gap-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {review.period}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reviewer: {review.reviewer}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Self Review: {review.selfReviewCompleted ? 'Complete' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiStar} className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Manager Review: {review.managerReviewCompleted ? 'Complete' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {review.finalReviewDate || 'Not scheduled'}
                </span>
              </div>
            </div>

            {review.overallRating && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Rating:
                </span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {getRatingStars(review.overallRating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {review.overallRating}/5
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewReview(review)}
                className="flex items-center px-3 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                View Details
              </motion.button>
              {review.status === 'pending' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewReview(review)}
                  className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4 mr-1" />
                  Complete Review
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Goals & Development
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedGoal(null);
            setIsGoalModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Goal
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            index={index}
            onEdit={handleEditGoal}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your performance reviews and development goals
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <SafeIcon icon={FiStar} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Latest Rating
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                4.2/5
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <SafeIcon icon={FiTarget} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Goals
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.filter(g => g.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) || 0}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Reviews Done
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviews.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reviews' ? renderReviewsTab() : renderGoalsTab()}
        </div>
      </div>

      {/* Modals */}
      <PerformanceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
      />

      <GoalsModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />
    </div>
  );
};

export default PerformanceReviews;