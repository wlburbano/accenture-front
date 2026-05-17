import { Injectable, signal } from '@angular/core';
import { Category, CreateCategoryPayload } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly CATEGORIES_KEY = 'accenture_categories';

  private readonly _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  constructor() {
    this.loadCategories();
  }

  addCategory(payload: CreateCategoryPayload): void {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      color: payload.color,
      isSystem: false,
    };

    this._categories.update((current) => [...current, newCategory]);
    this.saveToStorage();
  }

  deleteCategory(categoryId: string): void {
    this._categories.update((current) => current.filter((category) => category.id !== categoryId));
    this.saveToStorage();
  }

  private loadCategories(): void {
    const stored = localStorage.getItem(this.CATEGORIES_KEY);

    if (stored) {
      this._categories.set(JSON.parse(stored));
      return;
    }

    const defaultCategories: Category[] = [
      { id: 'cat-work', name: 'Trabajo', color: '#2dd36f', isSystem: true },
      { id: 'cat-personal', name: 'Personal', color: '#3880ff', isSystem: true },
      { id: 'cat-ideas', name: 'Ideas', color: '#ffc409', isSystem: true },
    ];
    this._categories.set(defaultCategories);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(this._categories()));
  }
}
