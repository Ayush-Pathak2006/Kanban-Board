import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import type { KanbanTask, KanbanColumn as KanbanColumnType } from './KanbanBoard.types';

interface KanbanViewProps {
  columns: KanbanColumnType[];
  tasks: Record<string, KanbanTask>;
  onTaskClick: (task: KanbanTask) => void;
  onTaskCreate: (columnId: string) => void; 
}

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskClick,
  onTaskCreate 
}) => {
  return (
    <div className="flex w-full space-x-4 overflow-x-auto p-4">
      {columns.map((column) => {
        const tasksForColumn = column.taskIds
          .map(taskId => tasks[taskId])
          .filter(task => task); 

        return (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksForColumn}
            onTaskClick={onTaskClick}
            onTaskCreate={() => onTaskCreate(column.id)} 
          />
        );
      })}
    </div>
  );
};