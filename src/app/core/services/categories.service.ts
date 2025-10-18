import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { StorageService } from './storage.service';
import { Category } from '../models/category.model';

const CATEGORIES_KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private cache: Category[] = [];

  constructor(private store: StorageService) {}

  async load(): Promise<Category[]> {
    this.cache = (await this.store.get<Category[]>(CATEGORIES_KEY)) ?? [];
    return this.cache;
  }

  async list(): Promise<Category[]> {
    return this.cache.length ? this.cache : this.load();
  }

  async create(name: string, color?: string): Promise<Category> {
    const now = Date.now();
    const category: Category = { id: uuid(), name, color, createdAt: now, updatedAt: now };
    const all = await this.list();
    all.push(category);
    await this.store.set(CATEGORIES_KEY, all);
    return category;
  }

  async update(id: string, changes: Partial<Category>) {
    const all = await this.list();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], ...changes, updatedAt: Date.now() };
    await this.store.set(CATEGORIES_KEY, all);
  }

  async remove(id: string) {
    const all = await this.list();
    const filtered = all.filter(c => c.id !== id);
    await this.store.set(CATEGORIES_KEY, filtered);
    this.cache = filtered;
  }
}
