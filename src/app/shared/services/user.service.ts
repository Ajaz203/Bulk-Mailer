import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { users } from '../interface/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  private apiUrl: string = 'https://f794f7610cc1.ngrok-free.app/';

  constructor(private http: HttpClient, private toastr: ToastrService) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }


  private getAuthHeaders(): any {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    };
  }


  private appendUserId(data: any = {}): any {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn(' userId is missing in localStorage at appendUserId');
    }
    return { ...data, userId: userId?.toString() || '' };
  }



  setUser(user: any): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }


  showToast(type: 'success' | 'error' | 'info' | 'warning', message: string) {
    this.toastr[type](message, type.toUpperCase() + "!", {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right'
    });
  }


  user(): Observable<users> {
    return this.http.get<users>('assets/json/user.json');
  }


  login(data: any) {
    return this.http.post(this.apiUrl + 'login', data).pipe(
      tap((res: any) => {
        if (res?.token && res?.user) {
          const userId = res.user.userId;
          if (userId) {
            localStorage.setItem('userId', userId.toString());
          } else {
            console.warn('userId missing in login response');
          }

          localStorage.setItem('token', res.token);
          this.setUser(res.user);
        }
      })
    );
  }

  getUsers() {
    return this.http.get(this.apiUrl + "getAllUser", this.getAuthHeaders());
  }
  getAdminWithUsers() {
    return this.http.get(this.apiUrl + "getAllAdminsWithUserCount", this.getAuthHeaders());
  }
  superAdminAllUsers() {
    return this.http.get(this.apiUrl + "superadmin/all-users", this.getAuthHeaders());
  }
  getAdminUsers(data: { adminId: number }): Observable<any> {
    return this.http.post(this.apiUrl + "admin/my-users", data, this.getAuthHeaders());
  }


  isActiveToggles(data: any) {
    return this.http.post(this.apiUrl + "isActiveToggle", data, this.getAuthHeaders());
  }
  updateUser(data: any) {
    return this.http.post(this.apiUrl + "updateUserById", data, this.getAuthHeaders());
  }
  addUsers(data: any) {
    return this.http.post(this.apiUrl + 'admin/create-user', this.appendUserId(data), this.getAuthHeaders());
  }
  addAdmin(data: any) {
    return this.http.post(this.apiUrl + 'addAdmin', this.appendUserId(data), this.getAuthHeaders());
  }

  // getUsers() {
  //   return this.http.get(this.apiUrl + 'getAllUser', this.getAuthHeaders());
  // }

  // isActiveToggles(data: any) {
  //   return this.http.post(this.apiUrl + 'isActiveToggle', this.appendUserId(data), this.getAuthHeaders());
  // }

  // updateUser(data: any) {
  //   return this.http.post(this.apiUrl + 'updateUserById', this.appendUserId(data), this.getAuthHeaders());
  // }

  getAllStat() {
    return this.http.get(this.apiUrl + 'getAllStats', this.getAuthHeaders());
  }


  dashboadCharts(data: any = {}) {
    return this.http.post(this.apiUrl + 'admin/dashboard-charts', this.appendUserId(data), this.getAuthHeaders());
  }
  trafficChart(data: any) {
    return this.http.post(this.apiUrl + 'admin/mail-traffic-chart', this.appendUserId(data), this.getAuthHeaders());
  }

}
