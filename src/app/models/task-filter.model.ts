export type TaskFilterType = 'all' | 'completed' | 'pending';

export interface TaskFilterState {
  searchQuery: string;
  status: TaskFilterType;
  categoryId?: string | null;
}
