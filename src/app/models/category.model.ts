export interface Category {
  id: string;
  name: string;
  color: string;
  isSystem: boolean;
}

export type CreateCategoryPayload = Omit<Category, 'id' | 'isSystem'>;
