import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { hotel } from '../interface/hotel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private http: HttpClient) {}

  // Hotel
  hotel(): Observable<hotel>{
    return this.http.get<hotel>('assets/json/hotel.json')
  }
}
