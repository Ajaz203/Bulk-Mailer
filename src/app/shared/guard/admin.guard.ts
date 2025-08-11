// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })

// export class AdminGuard {

//   constructor(public router: Router) { }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

//     let user = JSON.parse(localStorage.getItem('user') || '{}');
//     if (!user || user === null) {
//       this.router.navigate(['/auth/login']);
//       return true;
//     }
//     else if (user) {
//       if (!Object.keys(user).length) {
//         this.router.navigate(['/auth/login']);
//         return true;
//       }
//     }
//     return true;
//   }

// }


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      // No token → redirect to login
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true; // Token exists → allow access
  }
}

