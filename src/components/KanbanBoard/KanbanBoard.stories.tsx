import { useState } from 'react';
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

// --- HELPER FUNCTION FOR LARGE DATASET STORY ---
const generateLargeDataset = () => {
  const tasks: Record<string, KanbanTask> = {};
  const largeColumn: KanbanColumn = {
    id: 'large-col',
    title: 'Large Dataset (500+ tasks)',
    color: '#b91c1c',
    taskIds: [],
    maxTasks: 510, // For testing WIP
  };

  for (let i = 0; i < 500; i++) {
    const taskId = `task-large-${i}`;
    tasks[taskId] = {
      id: taskId,
      title: `Virtual Task ${i + 1}`,
      description: `This is a virtualized task number ${i + 1}.`,
      status: 'large-col',
      priority: 'low',
      createdAt: new Date(),
    };
    largeColumn.taskIds.push(taskId);
  }
  
  // Add sample tasks to the beginning for variety
  tasks['task-1'] = sampleTasks['task-1'];
  tasks['task-2'] = sampleTasks['task-2'];
  largeColumn.taskIds.unshift('task-1', 'task-2');

  return { tasks, largeColumn };
};
// --- END HELPER FUNCTION ---


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

    // --- REFACTORED: Logic for moving a task ---
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

    // --- UPDATED: Full handleDragEnd with Reordering ---
    const handleDragEnd = (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;
      
      const activeTask = tasks[activeId];
      if (!activeTask) return;

      const overIsColumn = over.data.current?.type === 'Column';

      // --- SCENARIO 1: Dropping on a DIFFERENT COLUMN ---
      const overColumnId = overIsColumn 
        ? overId 
        : tasks[overId]?.status;

      if (overColumnId && overColumnId !== activeTask.status) {
        moveTask(activeId, activeTask.status, overColumnId);
        
        setTasks(prev => ({
          ...prev,
          [activeId]: { ...prev[activeId], status: overColumnId },
        }));
        return;
      }

      // --- SCENARIO 2: Reordering WITHIN the SAME COLUMN ---
      if (!overIsColumn && activeId !== overId) {
        const columnId = activeTask.status;
        const column = columns.find(c => c.id === columnId);
        if (!column) return;

        const oldIndex = column.taskIds.indexOf(activeId);
        const newIndex = column.taskIds.indexOf(overId);

        if (oldIndex === -1 || newIndex === -1) return;
        
        setColumns(prev => {
          return prev.map(col => {
            if (col.id === columnId) {
              const newTaskIds = Array.from(col.taskIds);
              const [movedTask] = newTaskIds.splice(oldIndex, 1);
              newTaskIds.splice(newIndex, 0, movedTask);
              return { ...col, taskIds: newTaskIds };
            }
            return col;
          });
        });
      }
    };

    // --- HANDLER: Modal updates ---
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

    // --- HANDLER: Delete Task ---
    const handleTaskDelete = (taskId: string) => {
      const taskToDelete = tasks[taskId];
      
      setTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[taskId];
        return newTasks;
      });

      setColumns(prev => {
        return prev.map(col => {
          if (col.id === taskToDelete.status) {
            return {
              ...col,
              taskIds: col.taskIds.filter(id => id !== taskId)
            };
          }
          return col;
        });
      });
    };

    // --- HANDLER: Create Task ---
    const handleTaskCreate = (columnId: string) => {
      const newTaskId = `task-${Date.now()}`;
      const newTask: KanbanTask = {
        id: newTaskId,
        title: 'New Task',
        description: '',
        status: columnId,
        priority: 'medium',
        createdAt: new Date(),
        tags: [],
      };
      
      setTasks(prev => ({ ...prev, [newTaskId]: newTask }));
      
      setColumns(prev => prev.map(col => {
        if (col.id === columnId) {
          return { ...col, taskIds: [...col.taskIds, newTaskId] };
        }
        return col;
      }));
      
      setSelectedTask(newTask);
    };
    
    // --- HANDLER: Modal Close (for cleaning up new tasks) ---
    const handleModalClose = () => {
      if (selectedTask && selectedTask.title === 'New Task' && tasks[selectedTask.id]) {
        // If user cancels a "New Task", delete it
        handleTaskDelete(selectedTask.id);
      }
      setSelectedTask(null);
    };

    // --- SENSOR SETUP ---
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
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onTaskClick={setSelectedTask}
          onTaskCreate={handleTaskCreate}
        />
        
        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} onClick={() => { }} />
          ) : null}
        </DragOverlay>

        {selectedTask && (
          <TaskModal
            isOpen={!!selectedTask}
            onClose={handleModalClose}
            task={selectedTask}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
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

// --- NEW STORY: Large Dataset ---
const largeData = generateLargeDataset();
export const LargeDataset: Story = {
  args: {
    columns: [
      sampleColumns[0], // "To Do"
      largeData.largeColumn, // "Large Dataset (500+ tasks)"
      sampleColumns[2], // "Review" (for testing WIP)
    ],
    tasks: largeData.tasks,
  },
};