import { Component } from '@angular/core';
import { dashboardBookingHistory } from '../../../shared/data/data/dashboard';

@Component({
    selector: 'app-dashboard-booking-history',
    templateUrl: './dashboard-booking-history.component.html',
    styleUrl: './dashboard-booking-history.component.scss',
})
export class DashboardBookingHistoryComponent {

  public dashboardBookingHistory = dashboardBookingHistory;

}
