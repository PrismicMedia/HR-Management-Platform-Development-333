import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { useTranslation } from '../utils/translations';

const LeaveCalendar = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Mock leave data
  const leaveData = [
    { date: '2024-02-05', type: 'approved', reason: 'Vacation' },
    { date: '2024-02-06', type: 'approved', reason: 'Vacation' },
    { date: '2024-02-15', type: 'pending', reason: 'Sick Leave' },
    { date: '2024-02-20', type: 'rejected', reason: 'Personal' }
  ];

  const getLeaveStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return leaveData.find(leave => leave.date === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Leave Calendar
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            ←
          </button>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const leaveStatus = getLeaveStatus(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              className={`
                relative p-2 text-center text-sm cursor-pointer rounded-lg
                ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                ${isDayToday ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : ''}
                ${leaveStatus ? 'ring-2 ring-offset-1' : ''}
                hover:bg-gray-100 dark:hover:bg-gray-700
              `}
            >
              {format(day, 'd')}
              {leaveStatus && (
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${getStatusColor(leaveStatus.type)}`} />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Approved</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Rejected</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;