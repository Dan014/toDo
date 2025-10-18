import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init(): Promise<void> {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async get<T>(key: string): Promise<T | null> {
    return this._storage ? (await this._storage.get(key)) ?? null : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this._storage?.set(key, value);
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }
}
