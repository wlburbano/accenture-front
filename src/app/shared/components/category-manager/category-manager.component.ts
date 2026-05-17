import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
  IonNote,
  IonListHeader,
  IonInput,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, closeOutline } from 'ionicons/icons';
import { CategoryService } from 'src/app/core/services/category.service';
import { TaskService } from 'src/app/core/services/task.service';
import { CreateCategoryPayload } from 'src/app/models/category.model';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon,
    IonItem,
    IonList,
    IonLabel,
    IonNote,
    IonListHeader,
    IonInput,
  ],
})
export class CategoryManagerComponent {
  private readonly _categoryService = inject(CategoryService);
  private readonly _taskService = inject(TaskService);
  private readonly _formBuilder = inject(FormBuilder);

  close = output<void>();

  readonly categories = this._categoryService.categories;
  readonly prebuiltColors = ['#3880ff', '#2dd36f', '#ffc409', '#eb445a', '#7044ff', '#52606d'];

  categoryForm: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(25)]],
    color: ['#3880ff', [Validators.required]],
  });

  constructor() {
    addIcons({ trashOutline, addOutline, closeOutline });
  }

  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  onAddCategory(): void {
    if (this.categoryForm.invalid) return;

    const values = this.categoryForm.getRawValue();
    const payload: CreateCategoryPayload = {
      name: values.name?.trim() || 'Nueva Categoría',
      color: values.color,
    };

    this._categoryService.addCategory(payload);

    this.categoryForm.reset({
      name: '',
      color: '#3880ff',
    });
  }

  onDeleteCategory(id: string): void {
    this._categoryService.deleteCategory(id);
    this._taskService.cleanCategoryFromTasks(id);
  }
}
