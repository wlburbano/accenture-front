import {
  IonSegmentButton,
  IonFabButton,
  IonToolbar,
  IonButtons,
  IonContent,
  IonSegment,
  IonHeader,
  IonButton,
  IonTitle,
  IonModal,
  IonLabel,
  IonIcon,
  IonFab,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  optionsOutline,
  filterOutline,
  trashOutline,
  addOutline,
} from 'ionicons/icons';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CreateTaskPayload } from 'src/app/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { TaskFilterType } from '../../models/task-filter.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { RemoteConfigService } from 'src/app/core/services/remote-config.service';
import { TaskFormComponent } from 'src/app/shared/components/task-form/task-form.component';
import { TaskListComponent } from 'src/app/shared/components/task-list/task-list.component';
import { TaskFiltersComponent } from 'src/app/shared/components/task-filters/task-filters.component';
import { CategoryManagerComponent } from 'src/app/shared/components/category-manager/category-manager.component';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CategoryManagerComponent,
    TaskFiltersComponent,
    ReactiveFormsModule,
    TaskListComponent,
    TaskFormComponent,
    IonSegmentButton,
    CommonModule,
    IonFabButton,
    FormsModule,
    IonContent,
    IonToolbar,
    IonButtons,
    IonSegment,
    IonHeader,
    IonButton,
    IonTitle,
    IonLabel,
    IonModal,
    IonIcon,
    IonFab,
  ],
})
export class HomePage implements OnInit {
  private readonly _taskService = inject(TaskService);
  private readonly _categoryService = inject(CategoryService);
  private readonly _remoteConfig = inject(RemoteConfigService);
  private readonly _notificationService = inject(NotificationService);

  @ViewChild('taskModal') taskModal!: IonModal;

  readonly tasks = this._taskService.filteredTasks;
  readonly categories = this._categoryService.categories;
  readonly filterState = this._taskService.filterState;

  selectedCategoryId = signal<string | undefined>(undefined);
  currentStatus = signal<TaskFilterType>('all');
  selectedTaskForEdit = signal<Task | null>(null);
  isDescriptionEnabled = this._remoteConfig.isDescriptionEnabled;
  isCategoryManagementEnabled = this._remoteConfig.isCategoryManagementEnabled;

  constructor() {
    addIcons({ trashOutline, checkmarkCircleOutline, addOutline, filterOutline, optionsOutline });
  }

  async ngOnInit(): Promise<void> {}

  onSaveTask(payload: CreateTaskPayload & { id?: string }): void {
    if (payload.id) {
      this._taskService.updateTask(payload.id, payload);
      this._notificationService.presentToast('¡Tarea actualizada correctamente!', 'primary', 'top');
    } else {
      this._taskService.addTask(payload);
      this._notificationService.presentToast('¡Nueva tarea creada con éxito!', 'success', 'top');
    }

    if (this.taskModal) {
      this.taskModal.dismiss();
    }
    this.selectedTaskForEdit.set(null);
  }

  onOpenEditModal(task: any, modalElement: any) {
    this.selectedTaskForEdit.set(task);
    modalElement.present();
  }

  onToggleTask(taskId: string, isCompleted: boolean): void {
    this._taskService.toggleTaskCompletion(taskId);
    const mensaje = !isCompleted ? '¡Tarea completada!' : 'Tarea marcada como pendiente';
    this._notificationService.presentToast(mensaje, 'success', 'top');
  }

  onDeleteTask(taskId: string): void {
    this._taskService.deleteTask(taskId);
    this._notificationService.presentToast('Tarea eliminada correctamente', 'danger', 'top');
  }

  onStatusFilterChange(event: any): void {
    const status = event.detail.value as TaskFilterType;

    this.currentStatus.set(status);
    this._taskService.updateFilter({ status });
  }

  onCategoryFilterChange(event: any): void {
    const categoryId = event.detail.value ?? null;
    this._taskService.updateFilter({ categoryId });
  }

  onSearchChange(event: any): void {
    const query = event.target.value || '';
    this._taskService.updateFilter({ searchQuery: query });
  }

  getCategoryData(categoryId?: string): Category | undefined {
    if (!categoryId) return undefined;
    return this.categories().find((category) => category.id === categoryId);
  }

  openTaskModal(): void {
    this.selectedTaskForEdit.set(null);
    this.taskModal.present();
  }
}
