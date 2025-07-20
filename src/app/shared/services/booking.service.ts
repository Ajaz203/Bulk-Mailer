import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { booking } from '../interface/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) {}

  // booking
  booking(): Observable<booking>{
    return this.http.get<booking>('assets/json/booking.json')
  }
}
