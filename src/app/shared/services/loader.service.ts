// src/app/shared/services/loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  show() {
    this._loading.next(true);
  }

  hide() {
    // Minimum 3-second display logic
    setTimeout(() => {
      this._loading.next(false);
    }, 3000);
  }
}
