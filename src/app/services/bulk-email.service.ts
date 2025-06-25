import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class EmailService {
  private refreshTableSubject = new Subject<void>();
  refreshTable$ = this.refreshTableSubject.asObservable();
  constructor(private http: HttpClient) { }
  url: any = 'http://142.93.212.196:3000/';
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
    return this.http.get(this.url + 'category')
  }
  addCategory(data: any) {
    return this.http.post(this.url + 'category', data)
  }
  createSingleReq(data: any) {
    return this.http.post(this.url + 'candidateSingleUpload', data)
  }
  getCandidateData(data: any) {
    return this.http.post(this.url + 'getCandidates', data)
  }
  bulkUpload(data:any){
     return this.http.post(this.url + 'candidateMassUpload', data)
  }
  

}

