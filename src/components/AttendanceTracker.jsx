import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { useTranslation } from '../utils/translations';
import { useAuthStore } from '../store/authStore';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiClock, FiPlay, FiPause, FiStop, FiCalendar, FiTrendingUp, FiMapPin } = FiIcons;

const AttendanceTracker = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [todayHours, setTodayHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(32.5);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Mock attendance data
  const weeklyAttendance = [
    { date: '2024-01-22', checkIn: '09:00', checkOut: '17:30', hours: 8.5, status: 'present' },
    { date: '2024-01-23', checkIn: '09:15', checkOut: '17:45', hours: 8.5, status: 'present' },
    { date: '2024-01-24', checkIn: '09:00', checkOut: '17:00', hours: 8.0, status: 'present' },
    { date: '2024-01-25', checkIn: '09:30', checkOut: '18:00', hours: 8.5, status: 'present' },
    { date: '2024-01-26', checkIn: null, checkOut: null, hours: 0, status: 'absent' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isCheckedIn && checkInTime) {
        const elapsed = (new Date() - checkInTime) / (1000 * 60 * 60);
        setTodayHours(elapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isCheckedIn, checkInTime]);

  const handleCheckIn = async () => {
    try {
      const now = new Date();
      setIsCheckedIn(true);
      setCheckInTime(now);
      toast.success(`Checked in at ${format(now, 'HH:mm')}`);
      
      // Here you would typically save to database
      console.log('Check-in recorded:', { userId: user?.id, time: now });
    } catch (error) {
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const now = new Date();
      const totalHours = (now - checkInTime) / (1000 * 60 * 60);
      
      setIsCheckedIn(false);
      setIsOnBreak(false);
      setCheckInTime(null);
      setBreakStartTime(null);
      
      toast.success(`Checked out at ${format(now, 'HH:mm')} - Total: ${totalHours.toFixed(1)}h`);
      
      // Save to database
      console.log('Check-out recorded:', { 
        userId: user?.id, 
        checkOut: now, 
        totalHours: totalHours.toFixed(2)
      });
    } catch (error) {
      toast.error('Failed to check out');
    }
  };

  const handleBreak = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
      setBreakStartTime(null);
      toast.success('Break ended');
    } else {
      setIsOnBreak(true);
      setBreakStartTime(new Date());
      toast.success('Break started');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'half-day': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Time Tracker
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {format(currentTime, 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
              Office - Kuwait City
            </div>
          </div>
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isCheckedIn 
                  ? isOnBreak 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }`}>
                {isCheckedIn ? (isOnBreak ? 'On Break' : 'Working') : 'Not Checked In'}
              </span>
            </div>
            {checkInTime && (
              <div className="mt-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(checkInTime, 'HH:mm')}
                </p>
                <p className="text-xs text-gray-500">Check-in time</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
              <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {todayHours.toFixed(1)}h
            </p>
            <p className="text-xs text-gray-500">Hours worked</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {weeklyHours}h
            </p>
            <p className="text-xs text-gray-500">of 40h target</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!isCheckedIn ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckIn}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" />
              Check In
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBreak}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isOnBreak
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                <SafeIcon icon={isOnBreak ? FiPlay : FiPause} className="w-4 h-4 mr-2" />
                {isOnBreak ? 'End Break' : 'Start Break'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckOut}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <SafeIcon icon={FiStop} className="w-4 h-4 mr-2" />
                Check Out
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Weekly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Attendance
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              ←
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </span>
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayAttendance = weeklyAttendance.find(att => 
              isSameDay(new Date(att.date), day)
            );
            const isCurrentDay = isToday(day);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  isCurrentDay 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {format(day, 'EEE')}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {format(day, 'dd')}
                  </p>
                  
                  {dayAttendance ? (
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dayAttendance.status)}`}>
                        {dayAttendance.status}
                      </span>
                      {dayAttendance.checkIn && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {dayAttendance.checkIn} - {dayAttendance.checkOut || '...'}
                        </div>
                      )}
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {dayAttendance.hours}h
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className="text-xs text-gray-400">No data</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Weekly Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 dark:text-green-400">Present Days</span>
              <span className="text-xl font-bold text-green-700 dark:text-green-300">4</span>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600 dark:text-red-400">Absent Days</span>
              <span className="text-xl font-bold text-red-700 dark:text-red-300">1</span>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 dark:text-blue-400">Total Hours</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">32.5h</span>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-600 dark:text-purple-400">Avg Daily</span>
              <span className="text-xl font-bold text-purple-700 dark:text-purple-300">8.1h</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendanceTracker;