import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { StorageService } from './storage.service';
import { Task } from '../models/task.model';

const TASKS_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private cache: Task[] = [];

  constructor(private store: StorageService) {}

  async load(): Promise<Task[]> {
    this.cache = (await this.store.get<Task[]>(TASKS_KEY)) ?? [];
    return this.cache;
  }

  async list(): Promise<Task[]> {
    return this.cache.length ? this.cache : this.load();
  }

  async add(title: string): Promise<void> {
    const now = Date.now();
    const task: Task = { id: uuid(), title, completed: false, createdAt: now, updatedAt: now };
    const all = await this.list();
    all.unshift(task);
    await this.store.set(TASKS_KEY, all);
  }

  async toggle(id: string): Promise<void> {
    const all = await this.list();
    const index = all.findIndex(t => t.id === id);
    if (index === -1) return;
    all[index].completed = !all[index].completed;
    all[index].updatedAt = Date.now();
    await this.store.set(TASKS_KEY, all);
  }

  async remove(id: string): Promise<void> {
    const all = await this.list();
    const filtered = all.filter(t => t.id !== id);
    await this.store.set(TASKS_KEY, filtered);
    this.cache = filtered;
  }
}
