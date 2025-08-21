// src/app/shared/services/storage.service.ts
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private secretKey = environment.secretKey;

  private encrypt(value: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.secretKey).toString();
  }

  private decrypt(data: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted ? JSON.parse(decrypted) : null;
    } catch {
      return null;
    }
  }

  setLocal(key: string, value: any): void {
    localStorage.setItem(key, this.encrypt(value));
  }

getLocal<T>(key: string): T | string | null {
  const data = localStorage.getItem(key);
  if (!data) return null;

  try {
    // If it looks like CryptoJS encrypted data
    if (data.startsWith('U2FsdGVk')) {
      const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted ? JSON.parse(decrypted) : null;
    } else {
      // Plain data (like JWT token), return as string
      return data as unknown as T;
    }
  } catch (err) {
    console.error('Decryption failed', key, err);
    return null;
  }
}




  removeLocal(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocal(): void {
    localStorage.clear();
  }
}
