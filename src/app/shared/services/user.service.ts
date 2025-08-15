import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { users } from '../interface/user';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();
  // private apiUrl: string = 'https://1ed16883303b.ngrok-free.app/';
  private apiUrl: string = 'https://api.mailcept.net/';

  constructor(private http: HttpClient, private toastr: ToastrService) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }
  getBaseUrl(): string {
    return this.apiUrl;
  }

  // getUserFromStorage() {
  //   const user = localStorage.getItem('user');
  //   return user ? JSON.parse(user) : null;
  // }
  getUserFromStorage() {
  const user = localStorage.getItem('user') || localStorage.getItem('loggedInUser');
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
    return this.http.post<{ message: string }>(
      this.apiUrl + 'plans',
      this.appendUserId(data),
      {
        ...this.getAuthHeaders(),
        responseType: 'json' as const
      }
    );
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
  allcontacts() {
    return this.http.get(this.apiUrl + 'get-all-contacts', this.getAuthHeaders());
  }

  /////////////////////////////////////////bulkemailer apis////////////////////////////////////////////////////////////////////


  private refreshTableSubject = new Subject<void>();
  refreshTable$ = this.refreshTableSubject.asObservable();



  // url: string = 'http://142.93.212.196:3000/';
  // url: string = 'https://69e1e31cb2a4.ngrok-free.app/';

  header: any = {
    'ngrok-skip-browser-warning': 'true'
  };

  getUserId(): number {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const id = localStorage.getItem('userId');
      return id ? Number(id) : 0;
    }
    console.warn('Not running in browser, userId is set to 0');
    return 0;
  }
  // checkloginStatus() {
  //   if (typeof window !== 'undefined' && localStorage.getItem('token')) {
  //     this.router.navigate(['/dashboard']);
  //   } else {
  //     this.router.navigate(['/login']);
  //   }
  // }

  postWithUserId(endpoint: string, data: any) {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const payload = {
    ...data,
    userId: currentUser?.userId || null,
    userEmail: currentUser?.email || '',
    userName: currentUser?.name || ''
  };

  return this.http.post(this.apiUrl + endpoint, payload, { headers: this.header });
}




  getWithUserId(endpoint: string, params: any = {}) {
    const updatedParams = { ...params, userId: this.getUserId() };
    return this.http.get<any[]>(this.apiUrl + endpoint, {
      headers: this.header,
      params: updatedParams
    });
  }

  triggerTableReload() {
    this.refreshTableSubject.next();
  }


  getCategory() {
    return this.http.get(this.apiUrl + 'category', { headers: this.header });
  }

  addCategory(data: any) {
    return this.postWithUserId('category', data);
  }

  updateCategory(id: string, data: any) {
    return this.postWithUserId('categoryUpdate', { id, ...data });
  }

  deleteCategory(data: any) {
    return this.postWithUserId('categoryDelete', data);
  }


  createSingleReq(data: any) {
    return this.postWithUserId('candidateSingleUpload', data);
  }

  getCandidateData(data: any) {
    return this.postWithUserId('getCandidates', data);
  }

  // bulkUpload(data: any) {
  //   return this.postWithUserId('candidateMassUpload', data);
  // }
  bulkUpload(payload: any[]) {
    return this.http.post(this.apiUrl + 'candidateMassUpload', payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }
  updateCandidate(id: string, data: any) {
    return this.postWithUserId('candidateUpdate', { id, ...data });
  }

  deleteCandidate(data: any) {
    return this.postWithUserId('candidateDelete', data);
  }

  sendMail(data: any) {
    return this.postWithUserId('sendOrScheduleMail', data);
  }

  sendBulkEmail(data: any[]) {
    return this.postWithUserId('sendBulkEmail', { data });
  }


  venorUpload(payload: any[]) {
    return this.http.post(this.apiUrl + 'vendorMassUpload', payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }




  getVendors(userId: string) {
    const payload = { userId };
    return this.http.post(this.apiUrl + 'getVendors', payload, { headers: this.header });
  }

  vendorUpdate(id: string, data: any) {
    return this.postWithUserId('vendorUpdate', { id, ...data });
  }

  vendorDelete(data: any) {
    return this.postWithUserId('vendorDelete', data);
  }

  vendorSendMail(data: any) {
    return this.postWithUserId('sendOrScheduleVendorMail', data);
  }

  UserRegister(data: any) {
    return this.postWithUserId('register', data);
  }

  // loginUser(data: any) {
  //   return this.http.post(this.apiUrl + 'login', data, { headers: this.header });
  // }

  forgotPassword(data: any) {
    return this.http.post(this.apiUrl + 'forgot-password', data, { headers: this.header });
  }


  verifyOtp(data: any) {
    return this.postWithUserId('verify-otp', data);
  }

  updatePassword(data: any) {
    return this.postWithUserId('reset-password', data);
  }

  getSentMails(data: any) {
    return this.postWithUserId('getAllMails', data);
  }


  deleteDraft(data: any) {
    return this.postWithUserId('deleteDraft', data);
  }

  getDrafts(targetType: string) {
    const userId = this.getUserId();
    const payload = { targetType, userId };
    return this.http.post<any[]>(this.apiUrl + 'getDrafts', payload, { headers: this.header });
  }
  uploadProfileImage(data: FormData) {
    return this.http.post(this.apiUrl + 'updateProfile', data, {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true'

      })
    });
  }

  // getUserProfileUpdate(userId: number) {
  //   return this.http.post(this.url + 'getUserProfile', { userId }, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'ngrok-skip-browser-warning': 'true'
  //     })
  //   });
  // }


  getDashboardStats(userId: string) {
    return this.http.post(this.apiUrl + 'dashboard-summary', { userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }
  getVendorsByUser(userId: number) {
    return this.http.post(this.apiUrl + 'getVendorsByUser', { userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }
  getUsersWithVendors(params: any) {
    return this.http.get<any[]>(this.apiUrl + 'getUsersWithVendors', {
      headers: this.header,
      params: params
    });
  }

  deleteSelectedVendors(data: any) {
    return this.postWithUserId('deleteSelectedVendors', data);
  }
  disableIntro(data: any) {
    return this.postWithUserId('disable-suggestion', data);
  }
  contactUs(data: any) {
    return this.postWithUserId('create-contact', data);
  }
  // getPlans(data: any) {
  //   return this.getWithUserId('plans', data);
  // }
  verifySubscription(data: any) {
    return this.postWithUserId('verify-subscription', data);
  }
  createSubscriptionOrder(data: any) {
    return this.postWithUserId('subscribe', data);
  }
  registerAdmin(data: any) {
    return this.postWithUserId('register-admin', data);
  }
//   registerAdmin(data: any) {
//   return this.http.post(this.apiUrl + 'register-admin', data, { headers: this.header });
// }
// createSubscriptionOrder(data: any) {
//   return this.http.post(this.apiUrl + 'subscribe', data, { headers: this.header });
// }
  // user.service.ts in second app
  getProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    return this.http.get('https://api.mailcept.net', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((user: any) => {
      localStorage.setItem('userId', user.userId.toString());
      localStorage.setItem('name', user.name);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role', user.role);
    });
  }

}
