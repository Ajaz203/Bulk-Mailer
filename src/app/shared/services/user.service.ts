import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { users } from '../interface/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();
  private apiUrl: string = 'https://50945bf04c8f.ngrok-free.app/';

  constructor(private http: HttpClient, private toastr: ToastrService) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }
  getBaseUrl(): string {
  return this.apiUrl;
}

  getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
broadcastUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
  this.userSubject.next(user);        
}
clearUser() {
  localStorage.removeItem('user');
  this.userSubject.next(null);
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



 setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));     
    this.userSubject.next(user);     
    
                       
  }
getUser(): Observable<any> {
  if (!this.userSubject.value) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }
  return this.userSubject.asObservable();
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

  superAdminAllUsers(data: any) {
    return this.http.post(this.apiUrl + "superadmin/all-users", this.appendUserId(data), this.getAuthHeaders());
  }
  getAdminUsers(data: { adminId: number }): Observable<any> {
    return this.http.post(this.apiUrl + "admin/my-users", data, this.getAuthHeaders());
  }
  uploadProfileWithImage(data: FormData) {
    return this.http.post(this.apiUrl + 'updateProfile', data, {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }

  getUserProfileUpdate(userId: number) {
    return this.http.post(
      this.apiUrl + 'getUserProfile',
      { userId },
      this.getAuthHeaders()
    );
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


  getAllStat() {
    return this.http.get(this.apiUrl + 'getAllStats', this.getAuthHeaders());
  }


  dashboadCharts(data: any = {}) {
    return this.http.post(this.apiUrl + 'admin/dashboard-charts', this.appendUserId(data), this.getAuthHeaders());
  }
  trafficChart(data: any) {
    return this.http.post(this.apiUrl + 'admin/mail-traffic-chart', this.appendUserId(data), this.getAuthHeaders());
  }
  plans(data: any) {
    return this.http.post(this.apiUrl + 'plans', this.appendUserId(data), this.getAuthHeaders());
  }
deletePlan(planId: string) {
  return this.http.post(this.apiUrl + 'delete-plans', this.appendUserId({ id: planId }), this.getAuthHeaders());
}
updatePlan(planId: string, updatedData: any) {
  const payload = this.appendUserId({ ...updatedData, id: planId });
  return this.http.post(this.apiUrl + 'update-plan', payload, this.getAuthHeaders());
}


  getPlans() {
    return this.http.get(this.apiUrl + 'Plans', this.getAuthHeaders());
  }

}
