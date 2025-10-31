import type { Meta, StoryObj } from '@storybook/react';
import { KanbanCard } from './KanbanCard';
import { sampleTasks } from './sample-data'; 

const meta: Meta<typeof KanbanCard> = {
  title: 'Components/KanbanCard', 
  component: KanbanCard,
  tags: ['autodocs'], 
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    task: sampleTasks['task-1'],
  },
};

export const Overdue: Story = {
  args: {
    task: sampleTasks['task-2'],
  },
};
export const Minimal: Story = {
  args: {
    task: sampleTasks['task-3'],
  },
};