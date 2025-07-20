import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { restaurant } from '../interface/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) {}

  // Restaurant
  restaurant(): Observable<restaurant>{
    return this.http.get<restaurant>('assets/json/restaurant.json')
  }
}
