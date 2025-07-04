import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/translations';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ onEditTask }) => {
  const { t } = useTranslation();
  
  const [tasks, setTasks] = useState({
    todo: [
      {
        id: 1,
        title: 'Learn TypeScript',
        description: 'Complete TypeScript fundamentals course',
        dueDate: '2024-02-15',
        priority: 'high',
        assignee: 'John Doe',
        tags: ['learning', 'frontend']
      },
      {
        id: 2,
        title: 'Code Review Best Practices',
        description: 'Research and document code review guidelines',
        dueDate: '2024-02-20',
        priority: 'medium',
        assignee: 'John Doe',
        tags: ['process', 'quality']
      }
    ],
    inProgress: [
      {
        id: 3,
        title: 'React Performance Optimization',
        description: 'Optimize main dashboard components',
        dueDate: '2024-02-10',
        priority: 'high',
        assignee: 'John Doe',
        tags: ['react', 'performance']
      }
    ],
    done: [
      {
        id: 4,
        title: 'API Documentation',
        description: 'Complete REST API documentation',
        dueDate: '2024-01-30',
        priority: 'medium',
        assignee: 'John Doe',
        tags: ['documentation', 'backend']
      }
    ]
  });

  const columns = [
    { id: 'todo', title: t('todo'), color: 'bg-gray-100 dark:bg-gray-700' },
    { id: 'inProgress', title: t('inProgress'), color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'done', title: t('done'), color: 'bg-green-100 dark:bg-green-900' }
  ];

  const moveTask = (taskId, fromColumn, toColumn) => {
    setTasks(prev => {
      const task = prev[fromColumn].find(t => t.id === taskId);
      if (!task) return prev;

      return {
        ...prev,
        [fromColumn]: prev[fromColumn].filter(t => t.id !== taskId),
        [toColumn]: [...prev[toColumn], task]
      };
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks[column.id]}
            onMoveTask={moveTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;