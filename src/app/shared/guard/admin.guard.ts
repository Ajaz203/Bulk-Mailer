import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}

canActivate(): boolean {
  const token = this.storageService.getLocal<string>('token');


  if (!token) {
    this.router.navigate(['/auth/login']);
    return false;
  }
  return true;
}


}
