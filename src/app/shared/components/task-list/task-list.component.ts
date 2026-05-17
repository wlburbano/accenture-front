import {
  IonList,
  IonItemSliding,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonNote,
  IonBadge,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { Component, input, output } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { trashOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: true,
  imports: [
    IonItemOptions,
    IonItemSliding,
    IonItemOption,
    CommonModule,
    IonCheckbox,
    IonLabel,
    IonBadge,
    IonList,
    IonItem,
    IonNote,
    IonIcon,
  ],
})
export class TaskListComponent {
  tasks = input.required<Task[]>();
  categories = input.required<Category[]>();

  toggle = output<string>();
  delete = output<string>();
  edit = output<Task>();

  constructor() {
    addIcons({ trashOutline, checkmarkCircleOutline });
  }

  getCategoryData(categoryId?: string): Category | undefined {
    if (!categoryId) return undefined;
    return this.categories().find((cat) => cat.id === categoryId);
  }

  onToggleTask(id: string): void {
    this.toggle.emit(id);
  }

  onDeleteTask(id: string): void {
    this.delete.emit(id);
  }
}
