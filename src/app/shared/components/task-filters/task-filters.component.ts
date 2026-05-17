import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filterOutline } from 'ionicons/icons';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-task-filters',
  templateUrl: './task-filters.component.html',
  standalone: true,
  imports: [CommonModule, IonToolbar, IonSearchbar, IonItem, IonIcon, IonSelect, IonSelectOption],
})
export class TaskFiltersComponent {
  categories = input.required<Category[]>();

  search = output<any>();
  categoryChange = output<any>();

  constructor() {
    addIcons({ filterOutline });
  }
}
