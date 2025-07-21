import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { users } from '../interface/user';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class UserService {
    private userSubject = new BehaviorSubject<any>(null); 
  apiUrl:any='https://77a40b8cdaf8.ngrok-free.app/'
    header: any = {
    "ngrok-skip-browser-warning": "true",
  }
  constructor(private http: HttpClient, private toastr: ToastrService) {
     const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

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
  login(data:any) {
    return this.http.post(this.apiUrl + "login", data);
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
  }
    getAllStat() {
    return this.http.get(this.apiUrl + "getAllStats",{ headers: this.header });
  }
}

