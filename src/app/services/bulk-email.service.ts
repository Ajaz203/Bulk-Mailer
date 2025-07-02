import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private refreshTableSubject = new Subject<void>();
  refreshTable$ = this.refreshTableSubject.asObservable();

  constructor(private http: HttpClient) { }
  
  // url: string = 'http://142.93.212.196:3000/';
  url: string = 'https://83a6-203-92-37-218.ngrok-free.app/';

  header: any = {
    'ngrok-skip-browser-warning': 'true'
  };

 getUserId(): number {
  if (typeof window !== 'undefined') {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : 0;
  }
  return 0;
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

  bulkUpload(data: any) {
    return this.postWithUserId('candidateMassUpload', data);
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


  venorUpload(data: any) {
    return this.postWithUserId('vendorMassUpload', data);
  }

  getVendors() {
    return this.http.get(this.url + 'getVendors', { headers: this.header });
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
    return this.postWithUserId('forgot-password', data);
  }

  verifyOtp(data: any) {
    return this.postWithUserId('verify-otp', data);
  }

  updatePassword(data: any) {
    return this.postWithUserId('reset-password', data);
  }

 
  deleteDraft(data: any) {
    return this.postWithUserId('deleteDraft', data);
  }

  getDrafts(targetType: string) {
    return this.getWithUserId('getDrafts', { targetType });
  }
}
