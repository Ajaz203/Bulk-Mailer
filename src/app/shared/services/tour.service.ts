import { Injectable } from '@angular/core';
import { TourService } from 'ngx-ui-tour-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AppTourService {

  constructor(private tourService: TourService) {}

  initializeTour() {
    this.tourService.initialize([
      {
        anchorId: 'dashboard',
        title: 'Dashboard',
        content: 'This is your main dashboard where you can monitor stats and progress.',
      },
      {
        anchorId: 'vendors',
        title: 'Vendors',
        content: 'Here you can manage your vendor contacts and upload data easily.',
      },
      {
        anchorId: 'candidates',
        title: 'Candidates',
        content: 'This section allows you to manage and email your candidates.',
      }
    ]);
  }

  startTour() {
    this.initializeTour();
    this.tourService.start();
  }
}
