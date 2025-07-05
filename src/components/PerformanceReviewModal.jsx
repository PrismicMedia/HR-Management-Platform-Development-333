import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiX, FiStar, FiSend, FiEye } = FiIcons;

const PerformanceReviewModal = ({ isOpen, onClose, review }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('self');
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  const selfReviewQuestions = [
    { id: 1, question: "What were your key accomplishments this period?", type: "textarea" },
    { id: 2, question: "Rate your overall performance", type: "rating" },
    { id: 3, question: "What challenges did you face?", type: "textarea" },
    { id: 4, question: "What are your goals for next period?", type: "textarea" },
    { id: 5, question: "Rate your communication skills", type: "rating" },
    { id: 6, question: "Rate your teamwork", type: "rating" }
  ];

  const managerReviewQuestions = [
    { id: 1, question: "Employee demonstrates strong technical skills", type: "rating" },
    { id: 2, question: "Employee meets deadlines consistently", type: "rating" },
    { id: 3, question: "Employee shows initiative and proactivity", type: "rating" },
    { id: 4, question: "Areas for improvement", type: "textarea" },
    { id: 5, question: "Employee development recommendations", type: "textarea" },
    { id: 6, question: "Overall performance rating", type: "rating" }
  ];

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Review submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingInput = (questionId, currentValue) => (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map(rating => (
        <button
          key={rating}
          onClick={() => handleResponseChange(questionId, rating)}
          className={`p-1 rounded transition-colors ${
            currentValue >= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
          }`}
        >
          <SafeIcon icon={FiStar} className="w-5 h-5" />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {currentValue ? `${currentValue}/5` : 'Not rated'}
      </span>
    </div>
  );

  const renderTextareaInput = (questionId, currentValue) => (
    <textarea
      value={currentValue || ''}
      onChange={(e) => handleResponseChange(questionId, e.target.value)}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      placeholder="Enter your response..."
    />
  );

  const renderSelfReview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Self Assessment
        </h3>
        {review?.selfReviewCompleted && (
          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
            Completed
          </span>
        )}
      </div>

      {selfReviewQuestions.map((question) => (
        <div key={question.id} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {question.question}
          </label>
          {question.type === 'rating' ? 
            renderRatingInput(question.id, responses[question.id]) :
            renderTextareaInput(question.id, responses[question.id])
          }
        </div>
      ))}

      {!review?.selfReviewCompleted && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit Self Review'}
          </button>
        </div>
      )}
    </div>
  );

  const renderManagerReview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manager Assessment
        </h3>
        {review?.managerReviewCompleted ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
            Completed
          </span>
        ) : (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm">
            Pending
          </span>
        )}
      </div>

      {review?.managerReviewCompleted ? (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Manager Feedback</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your manager has completed the review. The feedback shows strong performance 
              across technical skills and teamwork, with recommendations for continued growth 
              in leadership areas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Strengths</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Excellent technical execution</li>
                <li>• Strong collaboration skills</li>
                <li>• Consistent delivery quality</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Development Areas</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Leadership opportunities</li>
                <li>• Cross-team communication</li>
                <li>• Strategic thinking</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <SafeIcon icon={FiEye} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Manager review is pending. You'll be notified when it's completed.
          </p>
        </div>
      )}
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Review Summary
      </h3>

      {review?.overallRating ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Overall Rating
            </h4>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <SafeIcon
                    key={star}
                    icon={FiStar}
                    className={`w-6 h-6 ${
                      star <= review.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {review.overallRating}/5
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Excellent performance with room for continued growth
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Summary will be available after both reviews are completed.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Achievements</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Delivered 3 major features ahead of schedule</li>
            <li>• Improved code quality metrics by 25%</li>
            <li>• Mentored 2 junior developers</li>
            <li>• Led cross-functional collaboration</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Development Plan</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Complete AWS certification</li>
            <li>• Lead next quarter's major project</li>
            <li>• Attend leadership workshop</li>
            <li>• Expand backend expertise</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'self', label: 'Self Review', completed: review?.selfReviewCompleted },
    { id: 'manager', label: 'Manager Review', completed: review?.managerReviewCompleted },
    { id: 'summary', label: 'Summary', completed: review?.status === 'completed' }
  ];

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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Performance Review - {review?.period || 'Q1 2024'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
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
                    <span>{tab.label}</span>
                    {tab.completed && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              {activeTab === 'self' && renderSelfReview()}
              {activeTab === 'manager' && renderManagerReview()}
              {activeTab === 'summary' && renderSummary()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceReviewModal;