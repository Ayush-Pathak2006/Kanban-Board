import React, { useState, useEffect } from 'react';
import type { KanbanTask, KanbanColumn } from './KanbanBoard.types';
import { Modal } from '../../primitives/Modal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: KanbanTask;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void; // 
  columns: KanbanColumn[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onTaskUpdate,
  onTaskDelete, 
  columns
}) => {
  const [formData, setFormData] = useState<Partial<KanbanTask>>(task);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onTaskUpdate(task.id, formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onTaskDelete(task.id);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-4" onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-semibold">
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div id="modal-description" className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Priority</label>
            <select
              name="priority"
              value={formData.priority || 'medium'}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 p-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Status</label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              className="w-full rounded-md border border-neutral-300 p-2"
            >
              {columns.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
          >
            Delete Task
          </button>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium hover:bg-neutral-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};