import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage {
  private _storage: Storage | null = null;

  title = '';
  selectedCategoryId = '';
  categories: Category[] = [];

  constructor(private storage: Storage, private router: Router) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
    this.categories = (await this._storage?.get('categories')) || [];
  }

  async addTask() {
    if (!this.title.trim() || !this.selectedCategoryId) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: this.title.trim(),
      completed: false,
      categoryId: this.selectedCategoryId,
    };

    const existingTasks: Task[] = (await this._storage?.get('tasks')) || [];
    existingTasks.push(newTask);
    await this._storage?.set('tasks', existingTasks);
    this.router.navigate(['/']);
  }
}
