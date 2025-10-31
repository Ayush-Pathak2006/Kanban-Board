import React from 'react';
import type { KanbanTask } from './KanbanBoard.types';

const getInitials = (name: string) => name.substring(0, 2).toUpperCase(); 
const isOverdue = (date: Date) => date < new Date(); 
const formatDate = (date: Date) => date.toLocaleDateString();

interface KanbanCardProps {
  task: KanbanTask; 
}

const priorityColors = {
  low: 'border-l-blue-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const priorityColor = task.priority ? priorityColors[task.priority] : 'border-l-gray-300';
  const overdue = task.dueDate && isOverdue(task.dueDate);

  return (
    <div 
      className={`bg-white border border-neutral-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4 ${priorityColor}`}
    >
      <div className="flex items-start justify-between mb-2"> 
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2"> 
          {task.title} 
        </h4>
        {task.priority && ( 
          <span className="text-xs px-2 py-0.5 rounded font-medium">
            {task.priority}
          </span>
        )}
      </div>
      
      {task.description && ( 
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2"> 
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1"> 
          {task.tags?.slice(0, 3).map(tag => ( 
            <span key={tag} className="text-xs bg-neutral-100 px-2 py-0.5 rounded"> 
              {tag} 
            </span>
          ))}
        </div>
        
        {task.assignee && ( 
          <div className="w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center font-semibold"> 
            {getInitials(task.assignee)} 
          </div>
        )}
      </div>

      {task.dueDate && ( 
        <div className={`text-xs mt-2 ${overdue ? 'text-red-600' : 'text-neutral-500'}`}> 
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};