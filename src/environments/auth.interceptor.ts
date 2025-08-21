import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../app/shared/services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = this.storageService.getLocal<string>('token');
  const clonedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next.handle(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) { // only clear if token existed
        this.storageService.clearLocal();
        this.router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
}

}
