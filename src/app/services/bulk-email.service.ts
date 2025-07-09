import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private refreshTableSubject = new Subject<void>();
  refreshTable$ = this.refreshTableSubject.asObservable();

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  url: string = 'http://142.93.212.196:3000/';
  // url: string = 'https://08295fa3753a.ngrok-free.app/';

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
  checkloginStatus() {
     if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    this.router.navigate(['/dashboard']);
  } else {
    this.router.navigate(['/login']);
  }
  }

  postWithUserId(endpoint: string, data: any) {
    const userId = this.getUserId();
    const payload = { ...data, userId };
    return this.http.post(this.url + endpoint, payload, { headers: this.header });
  }



  getWithUserId(endpoint: string, params: any = {}) {
    const updatedParams = { ...params, userId: this.getUserId() };
    return this.http.get<any[]>(this.url + endpoint, {
      headers: this.header,
      params: updatedParams
    });
  }

  triggerTableReload() {
    this.refreshTableSubject.next();
  }


  getCategory() {
    return this.http.get(this.url + 'category', { headers: this.header });
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
    return this.http.post(this.url + 'candidateMassUpload', payload, {
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
    return this.http.post(this.url + 'vendorMassUpload', payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }




  getVendors(userId: string) {
    const payload = { userId };
    return this.http.post(this.url + 'getVendors', payload, { headers: this.header });
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

  loginUser(data: any) {
    return this.http.post(this.url + 'login', data, { headers: this.header });
  }

  forgotPassword(data: any) {
    return this.http.post(this.url + 'forgot-password', data, { headers: this.header });
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
    return this.http.post<any[]>(this.url + 'getDrafts', payload, { headers: this.header });
  }
  uploadProfileImage(data: FormData) {
    return this.http.post(this.url + 'updateProfile', data, {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true'

      })
    });
  }

  getUserProfileUpdate(userId: number) {
    return this.http.post(this.url + 'getUserProfile', { userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }


  getDashboardStats(userId: string) {
    return this.http.post(this.url + 'dashboard-summary', { userId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    });
  }
}
