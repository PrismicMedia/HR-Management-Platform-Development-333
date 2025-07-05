import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import { useAuthStore } from '../store/authStore';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiUsers, FiMessageSquare, FiCalendar, FiVideo, FiPhone, FiMail, FiMoreVertical, FiPlus, FiSend } = FiIcons;

const TeamCollaboration = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('team');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Team Lead',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0ea5e9&color=fff',
      status: 'online',
      lastSeen: 'Active now',
      skills: ['Leadership', 'Project Management'],
      currentTask: 'Sprint Planning'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Senior Developer',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff',
      status: 'busy',
      lastSeen: '5 minutes ago',
      skills: ['React', 'Node.js', 'AWS'],
      currentTask: 'API Development'
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'UX Designer',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff',
      status: 'away',
      lastSeen: '1 hour ago',
      skills: ['Figma', 'User Research'],
      currentTask: 'Design System'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      role: 'Frontend Developer',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Rodriguez&background=8b5cf6&color=fff',
      status: 'offline',
      lastSeen: 'Yesterday',
      skills: ['Vue.js', 'TypeScript'],
      currentTask: 'Component Library'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0ea5e9&color=fff',
      message: 'Great job on the sprint! The new features look amazing 🚀',
      timestamp: '2024-01-26T10:30:00Z',
      isOwn: false
    },
    {
      id: 2,
      sender: user?.name,
      avatar: user?.avatar,
      message: 'Thanks! The team collaboration has been excellent',
      timestamp: '2024-01-26T10:32:00Z',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Mike Chen',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff',
      message: 'API endpoints are ready for testing. Let me know if you need anything!',
      timestamp: '2024-01-26T11:15:00Z',
      isOwn: false
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Daily Standup',
      time: '09:00 AM',
      duration: '15 min',
      attendees: 5,
      type: 'video',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Sprint Review',
      time: '02:00 PM',
      duration: '1 hour',
      attendees: 8,
      type: 'video',
      status: 'upcoming'
    },
    {
      id: 3,
      title: '1:1 with Manager',
      time: '04:00 PM',
      duration: '30 min',
      attendees: 2,
      type: 'video',
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast.success('Message sent!');
      setMessageText('');
      setShowNewMessage(false);
    }
  };

  const tabs = [
    { id: 'team', label: 'Team Directory', icon: FiUsers },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare },
    { id: 'meetings', label: 'Meetings', icon: FiCalendar }
  ];

  const renderTeamDirectory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Members ({teamMembers.length})
        </h3>
        <button className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-700`}></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {member.lastSeen}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                  <SafeIcon icon={FiMessageSquare} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                  <SafeIcon icon={FiVideo} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                  <SafeIcon icon={FiMoreVertical} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Current Task:</span>
                <span className="ml-1">{member.currentTask}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Chat
        </h3>
        <button
          onClick={() => setShowNewMessage(!showNewMessage)}
          className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
          New Message
        </button>
      </div>

      <AnimatePresence>
        {showNewMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex space-x-3">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setShowNewMessage(false)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiSend} className="w-3 h-3 mr-1" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.isOwn ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                <img
                  src={message.avatar}
                  alt={message.sender}
                  className="w-8 h-8 rounded-full"
                />
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {!message.isOwn && (
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {message.sender}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {format(new Date(message.timestamp), 'HH:mm')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMeetings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Today's Meetings
        </h3>
        <button className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
          Schedule Meeting
        </button>
      </div>

      <div className="space-y-3">
        {upcomingMeetings.map((meeting, index) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <SafeIcon icon={meeting.type === 'video' ? FiVideo : FiPhone} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {meeting.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{meeting.time}</span>
                    <span>{meeting.duration}</span>
                    <span>{meeting.attendees} attendees</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">
                  Join
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                  <SafeIcon icon={FiMoreVertical} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 dark:text-blue-400">Today's Meetings</span>
            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">3</span>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 dark:text-green-400">Meeting Hours</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-300">1.75h</span>
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-600 dark:text-purple-400">Participants</span>
            <span className="text-xl font-bold text-purple-700 dark:text-purple-300">15</span>
          </div>
        </div>
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
            Team Collaboration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect and collaborate with your team members
          </p>
        </div>
      </motion.div>

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
          {activeTab === 'team' && renderTeamDirectory()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'meetings' && renderMeetings()}
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;