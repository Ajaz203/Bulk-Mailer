import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tour } from '../interface/tours';

@Injectable({
  providedIn: 'root'
})
export class ToursService {

  constructor(private http: HttpClient) {}

  // Category
  tour(): Observable<tour>{
    return this.http.get<tour>('assets/json/tours.json')
  }
}
