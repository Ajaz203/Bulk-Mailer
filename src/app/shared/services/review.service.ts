import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { review } from '../interface/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {}

  // review
  review(): Observable<review>{
    return this.http.get<review>('assets/json/review.json')
  }
}
