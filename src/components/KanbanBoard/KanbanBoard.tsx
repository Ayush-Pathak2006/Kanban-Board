import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import type { KanbanTask, KanbanColumn as KanbanColumnType } from './KanbanBoard.types';

interface KanbanViewProps {
  columns: KanbanColumnType[];
  tasks: Record<string, KanbanTask>; 
  onTaskClick: (task: KanbanTask) => void;
}

export const KanbanBoard: React.FC<KanbanViewProps> = ({ columns, tasks, onTaskClick }) => {
  return (
    <div className="flex w-full space-x-4 overflow-x-auto p-4">
      {columns.map((column) => {
        const tasksForColumn = column.taskIds.map(taskId => tasks[taskId]);
        
        return (
          <KanbanColumn 
            key={column.id} 
            column={column} 
            tasks={tasksForColumn} 
            onTaskClick={onTaskClick}
          />
        );
      })}
    </div>
  );
};