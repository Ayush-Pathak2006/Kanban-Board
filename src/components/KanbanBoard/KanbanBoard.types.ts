export interface KanbanTask {
  id: string; 
  title: string; 
  description?: string;
  status: string; 
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string; 
  tags?: string[]; 
  createdAt: Date; 
  dueDate?: Date; 
}

export interface KanbanColumn {
  id: string; 
  title: string; 
  color: string; 
  taskIds: string[]; 
  maxTasks?: number; 
}