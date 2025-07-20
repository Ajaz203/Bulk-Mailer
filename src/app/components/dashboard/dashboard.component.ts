import { Component } from '@angular/core';
import * as data from '../../shared/data/data/dashboard';
import { DashboardToursComponent } from './dashboard-tours/dashboard-tours.component';
import { DashboardWorldMapComponent } from './dashboard-world-map/dashboard-world-map.component';
import { DashboardTrafficChartComponent } from './dashboard-traffic-chart/dashboard-traffic-chart.component';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DashboardBookingHistoryComponent } from './dashboard-booking-history/dashboard-booking-history.component';
import { DashboardEarningChartComponent } from './dashboard-earning-chart/dashboard-earning-chart.component';
import { DashboardVisitorChartComponent } from './dashboard-visitor-chart/dashboard-visitor-chart.component';
import { TopCommonDataComponent } from './top-common-data/top-common-data.component';
import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [TopCommonDataComponent, DashboardVisitorChartComponent, DashboardEarningChartComponent, DashboardBookingHistoryComponent, NgbDatepicker, DashboardTrafficChartComponent, DashboardWorldMapComponent, DashboardToursComponent]
})
export class DashboardComponent {

public topCommonData = [
  {
    id: 1,
    title: "Total Earnings",
    count: 6659
  },
  {
    id: 2,
    title: "Total Bookings",
    count: 9856
  },
  {
    id: 3,
    title: "Reviews",
    count: 893
  },
  {
    id: 4,
    title: "Total Users",
    count: 45631
  }
];



  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        if (res && res.length) {
          this.topCommonData = res;
        }
      },
      error: (err) => {
        console.error('API failed, using static data', err);
        // Do nothing, static data remains
      }
    });
}}
