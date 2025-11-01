import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { sampleColumns, sampleTasks } from './sample-data';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard', 
  component: KanbanBoard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', 
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const [columns, setColumns] = useState<KanbanColumn[]>(sampleColumns);
    const [tasks, setTasks] = useState<Record<string, KanbanTask>>(sampleTasks);

    const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
    const handleDragStart = (event: DragStartEvent) => {
      const { active } = event;
      setActiveTask(tasks[active.id as string] || null);
    };
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over) {
        console.log('Dropped into no-man_s-land');
        return;
      }

      const taskId = active.id as string;
      const newColumnId = over.id as string;
      const originalColumnId = active.data.current?.task.status;

      if (originalColumnId === newColumnId) {
        console.log('Dropped in the same column');
        return;
      }

      console.log(`Moving task ${taskId} from ${originalColumnId} to ${newColumnId}`);
      setColumns(prevColumns => {
        return prevColumns.map(col => {
          if (col.id === originalColumnId) {
            return {
              ...col,
              taskIds: col.taskIds.filter(id => id !== taskId),
            };
          }
          if (col.id === newColumnId) {
            return {
              ...col,
              taskIds: [...col.taskIds, taskId],
            };
          }
          return col;
        });
      });
      setTasks(prevTasks => {
        return {
          ...prevTasks, 
          [taskId]: { 
            ...prevTasks[taskId], 
            status: newColumnId, 
          },
        };
      });
    };

    return (
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <KanbanBoard columns={columns} tasks={tasks} />
        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} />
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  },
};

export const Default: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
  },
};
export const Empty: Story = {
  args: {
    columns: sampleColumns.map(col => ({ ...col, taskIds: [] })),
    tasks: {}, 
  },
};