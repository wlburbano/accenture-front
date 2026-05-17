import { Injectable, computed, signal } from '@angular/core';
import { CreateTaskPayload, Task } from '../../models/task.model';
import { TaskFilterState } from '../../models/task-filter.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly TASKS_KEY = 'accenture_tasks';

  private readonly _tasks = signal<Task[]>([]);
  private readonly _filterState = signal<TaskFilterState>({
    searchQuery: '',
    status: 'all',
    categoryId: null,
  });
  readonly filterState = this._filterState.asReadonly();

  constructor() {
    this.loadTasks();
  }

  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const filter = this._filterState();

    return tasks
      .filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(filter.searchQuery.toLowerCase());
        const matchesCategory = filter.categoryId === null || task.categoryId === filter.categoryId;
        const matchesStatus =
          filter.status === 'all' ||
          (filter.status === 'completed' && task.isCompleted) ||
          (filter.status === 'pending' && !task.isCompleted);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  addTask(payload: CreateTaskPayload): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      isCompleted: false,
      categoryId: payload.categoryId || undefined,
      createdAt: new Date(),
    };

    this._tasks.update((current) => [...current, newTask]);
    this.saveToStorage();
  }

  updateTask(id: string, payload: CreateTaskPayload): void {
    this._tasks.update((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: payload.title.trim(),
              description: payload.description.trim(),
              categoryId: payload.categoryId || undefined,
            }
          : task,
      ),
    );
    this.saveToStorage();
  }

  toggleTaskCompletion(taskId: string): void {
    this._tasks.update((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
    this.saveToStorage();
  }

  deleteTask(taskId: string): void {
    this._tasks.update((current) => current.filter((task) => task.id !== taskId));
    this.saveToStorage();
  }

  updateFilter(partialFilter: Partial<TaskFilterState>): void {
    this._filterState.update((current) => ({ ...current, ...partialFilter }));
  }

  cleanCategoryFromTasks(categoryId: string): void {
    this._tasks.update((current) =>
      current.map((task) =>
        task.categoryId === categoryId ? { ...task, categoryId: undefined } : task,
      ),
    );
    this.saveToStorage();
  }

  private loadTasks(): void {
    const stored = localStorage.getItem(this.TASKS_KEY);
    if (stored) this._tasks.set(JSON.parse(stored));
  }

  private saveToStorage(): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(this._tasks()));
  }
}
