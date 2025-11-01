import React, { memo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import type { KanbanTask, KanbanColumn as KanbanColumnType } from './KanbanBoard.types';

const VIRTUALIZATION_THRESHOLD = 50; 
const AVG_CARD_HEIGHT = 120;
const VISIBLE_BUFFER = 10; 

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onTaskClick: (task: KanbanTask) => void;
  onTaskCreate: () => void; 
}


export const KanbanColumn: React.FC<KanbanColumnProps> = memo(({ column, tasks, onTaskClick, onTaskCreate }) => { 
  const taskCount = tasks.length;
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    }
  });

  const isOverWipLimit = column.maxTasks ? taskCount > column.maxTasks : false;
  const [scrollTop, setScrollTop] = useState(0);

  const isVirtualizationEnabled = taskCount > VIRTUALIZATION_THRESHOLD;

  const getVisibleRange = () => {
    if (!isVirtualizationEnabled) {
      return { start: 0, end: taskCount };
    }
    const startIndex = Math.max(0, Math.floor(scrollTop / AVG_CARD_HEIGHT) - VISIBLE_BUFFER);
    const visibleItems = Math.ceil(700 / AVG_CARD_HEIGHT);
    const endIndex = Math.min(taskCount, startIndex + visibleItems + (VISIBLE_BUFFER * 2));

    return { start: startIndex, end: endIndex };
  };

  const visibleRange = getVisibleRange();
  const visibleTasks = isVirtualizationEnabled
    ? tasks.slice(visibleRange.start, visibleRange.end)
    : tasks;
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isVirtualizationEnabled) {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex w-[280px] flex-shrink-0 flex-col rounded-lg bg-neutral-100 ${
        isOverWipLimit ? 'border-2 border-red-500' : ''
      }`}
    >
      <div className="flex items-center justify-between p-3">
        <h3 className="text-sm font-semibold text-neutral-700">
          {column.title}
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              isOverWipLimit
                ? 'bg-red-200 text-red-700'
                : 'bg-neutral-200 text-neutral-700'
            }`}
          >
            {taskCount}
            {column.maxTasks && ` / ${column.maxTasks}`}
          </span>
        </h3>
      </div>
      <div
        className="flex-1 overflow-y-auto p-3"
        onScroll={handleScroll}
        style={{ height: '70vh' }} 
      >
        {isVirtualizationEnabled ? (
          <div style={{ height: taskCount * AVG_CARD_HEIGHT, position: 'relative' }}>
            {visibleTasks.map((task) => {
              const taskIndex = tasks.indexOf(task);
              if (taskIndex === -1) return null;

              return (
                <div
                  key={task.id}
                  style={{
                    position: 'absolute',
                    top: taskIndex * AVG_CARD_HEIGHT, 
                    width: 'calc(100% - 1.5rem)', 
                    paddingTop: '0.375rem', 
                    paddingBottom: '0.375rem', 
                  }}
                >
                  <KanbanCard task={task} onClick={() => onTaskClick(task)} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </div>
        )}

        {taskCount === 0 && !isVirtualizationEnabled && (
          <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-sm text-neutral-500">
            Drag cards here
          </div>
        )}
      </div>

      <button
        onClick={onTaskCreate}
        className="flex w-full items-center justify-center p-3 text-sm font-medium text-neutral-500 hover:bg-neutral-200"
      >
        + Add a card
      </button>
    </div>
  );
});