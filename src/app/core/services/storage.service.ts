import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  prefix: string = 'osm-app';
  storage: Storage;
  constructor() {
    this.storage = window.localStorage;
  }

  private generateKey(key: string) {
    return this.prefix + '_' + key;
  }

  getItem(key: string) {
    const data = this.storage.getItem(this.generateKey(key));
    if (data != null) return JSON.parse(data);
    else return null;
  }

  setItem(key: string, data: any) {
    this.storage.setItem(this.generateKey(key), JSON.stringify(data));
  }

  removeItem(key: string) {
    this.storage.removeItem(this.generateKey(key));
  }

  clear() {
    this.storage.clear();
  }
}
