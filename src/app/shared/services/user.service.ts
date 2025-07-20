import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { users } from '../interface/user';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl:any='https://b6fd1e050d9d.ngrok-free.app/'
    header: any = {
    "ngrok-skip-browser-warning": "true",
  }
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // User
  user(): Observable<users>{
    return this.http.get<users>('assets/json/user.json')
  }
 addUsers(data:any) {
    return this.http.post(this.apiUrl + "addUser", data);
  }
  showToast(action: 'success' | 'error' | 'info' | 'warning', message: string) {
    this.toastr[action](message, action + "!", { timeOut: 3000, progressBar: true, progressAnimation: 'decreasing', positionClass: 'toast-top-right' });
  }
   getUsers() {
    return this.http.get(this.apiUrl + "getAllUser",{ headers: this.header });
  }
  isActiveToggles(data:any) {
    return this.http.post(this.apiUrl + "isActiveToggle", data);
  }
  updateUser(data:any) {
    return this.http.post(this.apiUrl + "updateUserById", data);
  }
}

