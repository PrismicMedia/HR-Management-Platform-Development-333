import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import { useAuthStore } from '../store/authStore';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

// Feather icons library doesn't include a dedicated "MarkAsRead" icon.
// Use FiCheckSquare to represent the "mark all read" action instead.
const { FiBell, FiX, FiCheck, FiCheckCircle, FiCheckSquare, FiAlertTriangle, FiInfo, FiCalendar, FiUser, FiSettings, FiFilter } = FiIcons;

const NotificationCenter = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'leave_approved',
      title: 'Leave Request Approved',
      message: 'Your vacation request for Dec 20-25 has been approved by Sarah Johnson',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      priority: 'high',
      actionUrl: '/leave',
      icon: FiCheck,
      color: 'bg-green-500'
    },
    {
      id: 2,
      type: 'performance_review',
      title: 'Performance Review Due',
      message: 'Your Q4 performance review is due in 3 days. Please complete your self-assessment.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: false,
      priority: 'medium',
      actionUrl: '/performance',
      icon: FiUser,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'meeting_reminder',
      title: 'Upcoming Meeting',
      message: 'Daily standup meeting starts in 15 minutes',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: true,
      priority: 'medium',
      actionUrl: '/team',
      icon: FiCalendar,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      type: 'system_update',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      priority: 'low',
      actionUrl: null,
      icon: FiSettings,
      color: 'bg-orange-500'
    },
    {
      id: 5,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Complete React Dashboard" task',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: false,
      priority: 'high',
      actionUrl: '/growth-plan',
      icon: FiInfo,
      color: 'bg-indigo-500'
    },
    {
      id: 6,
      type: 'skill_milestone',
      title: 'Skill Milestone Achieved',
      message: 'Congratulations! You have reached Advanced level in React',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
      priority: 'low',
      actionUrl: '/skills',
      icon: FiCheckCircle,
      color: 'bg-green-500'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'high') return notification.priority === 'high';
    return true;
  });

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => 
      ({ ...notification, isRead: true })
    ));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      // Navigate to the action URL
      window.location.hash = notification.actionUrl;
      onClose();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTimeAgo = (timestamp) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBell} className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('notifications')}
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiCheckSquare} className="w-4 h-4 mr-1" />
                  {t('markAllRead')}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700">
              <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: t('all') },
                  { key: 'unread', label: t('unread') },
                  { key: 'high', label: t('highPriority') }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filter === filterOption.key
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiBell} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">{t('noNotifications')}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${notification.color}`}>
                          <SafeIcon icon={notification.icon} className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                notification.priority === 'high'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                  : notification.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              }`}>
                                {notification.priority}
                              </span>
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  title={t('markAsRead')}
                                >
                                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{filteredNotifications.length} {t('notifications')}</span>
                <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                  {t('notificationSettings')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
