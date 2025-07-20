import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cab } from '../interface/cab';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CabService {

  constructor(private http: HttpClient) {}

  // cab
  cab(): Observable<cab>{
    return this.http.get<cab>('assets/json/cab.json')
  }
}
