import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class EmailService {
  private refreshTableSubject = new Subject<void>();
  refreshTable$ = this.refreshTableSubject.asObservable();
  constructor(private http: HttpClient) { }
  url: any = 'http://142.93.212.196:3000/';
  // url: any = 'https://2390-122-161-72-104.ngrok-free.app/';

  header: any = {
    'ngrok-skip-browser-warning': 'true'
  }
  triggerTableReload() {
    this.refreshTableSubject.next();
  }
  sendBulkEmail(data: any[]) {
    return this.http.post('http://localhost:3000/sendBulkEmail', { data });
  }
  getCategory() {
    return this.http.get(this.url + 'category', { headers: this.header });
  }

  addCategory(data: any) {
    return this.http.post(this.url + 'category', data, { headers: this.header })
  }
  createSingleReq(data: any) {
    return this.http.post(this.url + 'candidateSingleUpload', data, { headers: this.header })
  }
  getCandidateData(data: any) {
    return this.http.post(this.url + 'getCandidates', data, { headers: this.header })
  }
  bulkUpload(data: any) {
    return this.http.post(this.url + 'candidateMassUpload', data)
  }

  updateCandidate(id: string, data: any) {
    const payload = { id, ...data };
    return this.http.post(this.url + 'candidateUpdate', payload, { headers: this.header });
  }


  deleteCandidate(data: any) {
    return this.http.post(this.url + 'candidateDelete', data, { headers: this.header });
  }
  sendMail(data: any) {
    return this.http.post(this.url + 'sendOrScheduleMail', data, { headers: this.header });
  }
  venorUpload(data: any) {
    return this.http.post(this.url + 'vendorMassUpload', data)
  }

  getVendors() {
    return this.http.get(this.url + 'getVendors', { headers: this.header });
  }

  vendorUpdate(id: string, data: any) {
    const payload = { id, ...data };
    return this.http.post(this.url + 'vendorUpdate', payload, { headers: this.header });
  }


  vendorDelete(data: any) {
    return this.http.post(this.url + 'vendorDelete', data, { headers: this.header });
  }
  vendorSendMail(data: any) {
    return this.http.post(this.url + 'sendOrScheduleVendorMail', data, { headers: this.header });
  }

  updateCategory(id: string, data: any) {
    const payload = { id, ...data };
    return this.http.post(this.url + 'categoryUpdate', payload, { headers: this.header });
  }


  deleteCategory(data: any) {
    return this.http.post(this.url + 'categoryDelete', data, { headers: this.header });
  }
  UserRegister(data: any) {
    return this.http.post(this.url + 'register', data, { headers: this.header });
  }
  loginUser(data: any) {
    return this.http.post(this.url + 'login', data, { headers: this.header });
  }
  forgotPassword(data: any) {
    return this.http.post(this.url + 'forgot-password', data, { headers: this.header });
  }
  verifyOtp(data: any) {
    return this.http.post(this.url + 'verify-otp', data, { headers: this.header });
  }
  updatePassword(data: any) {
    return this.http.post(this.url + 'reset-password', data, { headers: this.header });
  }
  deleteDraft(payload: any) {
  return this.http.post(this.url + 'deleteDraft', payload, { headers: this.header });
}

getDrafts(targetType: string) {
  return this.http.get<any[]>(`${this.url}getDrafts?targetType=${targetType}`, {
    headers: this.header,
  });
}









  
}

