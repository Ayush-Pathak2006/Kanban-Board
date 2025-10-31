import type { Meta, StoryObj } from '@storybook/react';
import { KanbanColumn } from './KanbanColumn';
import { sampleColumns, sampleTasks } from './sample-data';
import type { KanbanTask } from './KanbanBoard.types';

const meta: Meta<typeof KanbanColumn> = {
  title: 'Components/KanbanColumn',
  component: KanbanColumn,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
const getTasksForColumn = (columnId: string): KanbanTask[] => {
  const column = sampleColumns.find(col => col.id === columnId);
  if (!column) return [];
  return column.taskIds.map(taskId => sampleTasks[taskId]);
};
export const Default: Story = {
  args: {
    column: sampleColumns[0], 
    tasks: getTasksForColumn('todo'),
  },
};
export const Empty: Story = {
  args: {
    column: sampleColumns[2], 
    tasks: getTasksForColumn('review'),
  },
};