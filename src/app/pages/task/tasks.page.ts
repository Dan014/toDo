import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId?: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  private _storage: Storage | null = null;
  categoryId = '';
  categoryName = '';
  tasks: Task[] = [];
  newTask = '';

  constructor(private route: ActivatedRoute, private storage: Storage) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') || '';
    const cats = (await this._storage.get('categories')) || [];
    const cat = cats.find((c: any) => c.id === this.categoryId);
    this.categoryName = cat?.name || 'Sin nombre';
    await this.loadTasks();
  }

  async loadTasks() {
    const all = (await this._storage?.get('tasks')) || [];
    this.tasks = all.filter((t: Task) => t.categoryId === this.categoryId);
  }

  async saveTasks() {
    const all = (await this._storage?.get('tasks')) || [];
    const others = all.filter((t: Task) => t.categoryId !== this.categoryId);
    await this._storage?.set('tasks', [...others, ...this.tasks]);
  }

  async addTask() {
    if (!this.newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: this.newTask.trim(),
      completed: false,
      categoryId: this.categoryId,
    };
    this.tasks.push(task);
    await this.saveTasks();
    this.newTask = '';
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;
    await this.saveTasks();
  }

  async removeTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    await this.saveTasks();
  }
}
