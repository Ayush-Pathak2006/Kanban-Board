import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import type { KanbanTask, KanbanColumn as KanbanColumnType } from './KanbanBoard.types';
interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[]; 
  onTaskClick: (task: KanbanTask) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks, onTaskClick }) => {
  const taskCount = tasks.length;
  const { setNodeRef } = useDroppable({
    id: column.id, 
    data: {
      type: 'Column',
      column,
    }
  });

  return (
    <div 
    ref={setNodeRef}
    className="flex w-[280px] flex-shrink-0 flex-col rounded-lg bg-neutral-100">
      <div className="flex items-center justify-between p-3">
        <h3 className="text-sm font-semibold text-neutral-700">
          {column.title}
          <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-xs">
            {taskCount}
          </span>
        </h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        {taskCount === 0 && (
          <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-sm text-neutral-500">
            Drag cards here
          </div>
        )}
      </div>

      <button className="flex w-full items-center justify-center p-3 text-sm font-medium text-neutral-500 hover:bg-neutral-200">
        + Add a card
      </button>
    </div>
  );
};