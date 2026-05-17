export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  categoryId?: string;
  createdAt: Date;
}

export type CreateTaskPayload = Omit<Task, 'id' | 'isCompleted' | 'createdAt'>;
