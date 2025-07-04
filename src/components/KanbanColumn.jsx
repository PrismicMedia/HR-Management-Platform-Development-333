import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';

const KanbanColumn = ({ column, tasks, onMoveTask, onEditTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.column !== column.id) {
        onMoveTask(item.id, item.column, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div
      ref={drop}
      className={`${column.color} rounded-lg p-4 min-h-[400px] ${
        isOver ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {column.title}
        </h3>
        <span className="bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TaskCard
              task={task}
              column={column.id}
              onEdit={onEditTask}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;