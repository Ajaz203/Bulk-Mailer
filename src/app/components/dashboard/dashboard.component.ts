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

 topCommonData:any = [];



  constructor(private userService: UserService) {}

  ngOnInit(){
   
    this.getAll();
  }


getAll() {
  this.userService.getAllStat().subscribe({
    next: (res: any) => {
      const overview = res?.overview;

      this.topCommonData = overview ? [
        {
          id: 1,
          title: 'Total Emails Sent',
          count: overview.totalEmailsSent
        },
        {
          id: 2,
          title: 'Total Drafts',
          count: overview.totalDrafts
        },
        {
          id: 3,
          title: 'Total Scheduled',
          count: overview.totalScheduled
        },
        {
          id: 4,
          title: 'Total Candidates',
          count: overview.totalCandidates
        },
        {
          id: 5,
          title: 'Total Vendors',
          count: overview.totalVendors
        },
      ] : [];

      // Now fetch total users and append
      this.userService.getUsers().subscribe({
        next: (userRes: any) => {
          if (userRes?.totalUsers !== undefined) {
            this.topCommonData.push({
              id: 6,
              title: 'Total Users',
              count: userRes.totalUsers
            });
          }
        },
        error: (err) => {
          console.error('Error fetching users', err);
        }
      });
    },
    error: (err) => {
      console.error('Error fetching overview stats', err);
    }
  });
}


}
