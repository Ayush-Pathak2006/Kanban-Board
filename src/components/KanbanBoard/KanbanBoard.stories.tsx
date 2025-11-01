import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { sampleColumns, sampleTasks } from './sample-data';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';
import { TaskModal } from './TaskModal';

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
    const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
      const { active } = event;
      setActiveTask(tasks[active.id as string] || null);
    };
    const moveTask = (taskId: string, originalColumnId: string, newColumnId: string) => {
      setColumns(prevColumns => {
        return prevColumns.map(col => {
          if (col.id === originalColumnId) {
            return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
          }
          if (col.id === newColumnId) {
            return { ...col, taskIds: [...col.taskIds, taskId] };
          }
          return col;
        });
      });
    };
    const handleDragEnd = (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const newColumnId = over.id as string;
      const originalColumnId = active.data.current?.task.status;

      if (originalColumnId === newColumnId) return;
      moveTask(taskId, originalColumnId, newColumnId);
      setTasks(prevTasks => ({
        ...prevTasks,
        [taskId]: { ...prevTasks[taskId], status: newColumnId },
      }));
    };
    const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
      const originalTask = tasks[taskId];
      if (updates.status && updates.status !== originalTask.status) {
        moveTask(taskId, originalTask.status, updates.status);
      }
      setTasks(prevTasks => ({
        ...prevTasks,
        [taskId]: {
          ...prevTasks[taskId],
          ...updates,           
        },
      }));
    };
    const mouseSensor = useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    });
    const touchSensor = useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    return (
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <KanbanBoard columns={columns} tasks={tasks} onTaskClick={setSelectedTask} />
        
        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} onClick={() => { }} />
          ) : null}
        </DragOverlay>

        {selectedTask && (
          <TaskModal
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            task={selectedTask}
            onTaskUpdate={handleTaskUpdate} 
            columns={columns}              
          />
        )}
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