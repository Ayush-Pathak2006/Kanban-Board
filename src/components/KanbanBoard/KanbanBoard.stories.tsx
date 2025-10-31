import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { sampleColumns, sampleTasks } from './sample-data';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard', 
  component: KanbanBoard,
  tags: ['autodos'],
  parameters: {
    layout: 'fullscreen', 
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
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