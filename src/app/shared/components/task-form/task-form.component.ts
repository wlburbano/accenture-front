import { Component, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonList,
  IonItem,
  IonNote,
  IonSelectOption,
  IonButton,
  IonSelect,
  IonInput,
  IonTextarea,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline } from 'ionicons/icons';
import { Category } from '../../../models/category.model';
import { Task } from '../../../models/task.model';
import { CreateTaskPayload } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonNote,
    IonSelectOption,
    IonButton,
    IonSelect,
    IonInput,
    IonTextarea,
    IonIcon,
  ],
})
export class TaskFormComponent {
  private readonly _formBuilder = inject(FormBuilder);

  categories = input.required<Category[]>();
  isDescriptionEnabled = input.required<boolean>();
  taskToEdit = input<Task | null>(null);

  submitted = output<CreateTaskPayload & { id?: string }>();

  taskForm = this._formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    categoryId: [null as string | null],
  });

  constructor() {
    addIcons({ addOutline, createOutline });

    effect(() => {
      const flag = this.isDescriptionEnabled();
      const task = this.taskToEdit();
      const descControl = this.taskForm.get('description');

      if (descControl) {
        if (!flag) {
          descControl.setValue('', { emitEvent: false });
          descControl.disable({ emitEvent: false });
        } else {
          descControl.enable({ emitEvent: false });
        }
      }

      if (task) {
        this.taskForm.patchValue(
          {
            title: task.title,
            description: task.description || '',
            categoryId: task.categoryId || null,
          },
          { emitEvent: false },
        );
      } else {
        this.taskForm.reset(
          {
            title: '',
            description: '',
            categoryId: null,
          },
          { emitEvent: false },
        );
      }
    });
  }

  onSubmit(): void {
    this.taskForm.markAllAsTouched();
    if (this.taskForm.invalid) return;

    const formValues = this.taskForm.getRawValue();
    const currentTask = this.taskToEdit();

    const payload: CreateTaskPayload & { id?: string } = {
      title: formValues.title?.trim() || 'Tarea sin título',
      description: this.isDescriptionEnabled() ? formValues.description?.trim() || '' : '',
      categoryId: formValues.categoryId || undefined,
    };

    if (currentTask) {
      payload.id = currentTask.id;
    }

    this.submitted.emit(payload);

    this.taskForm.reset({
      title: '',
      description: '',
      categoryId: null,
    });
  }
}
