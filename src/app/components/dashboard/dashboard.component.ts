import { Component } from '@angular/core';
import { DashboardEarningChartComponent } from './dashboard-earning-chart/dashboard-earning-chart.component';
import { DashboardVisitorChartComponent } from './dashboard-visitor-chart/dashboard-visitor-chart.component';
import { TopCommonDataComponent } from './top-common-data/top-common-data.component';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DashboardTrafficChartComponent } from './dashboard-traffic-chart/dashboard-traffic-chart.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [TopCommonDataComponent, DashboardVisitorChartComponent, 
      DashboardEarningChartComponent,CommonModule,NgbDatepicker,DashboardTrafficChartComponent]
})
export class DashboardComponent {

 topCommonData:any = [];



  constructor(private userService: UserService) {}

  ngOnInit(){
   
    this.getAll();
  }


getAll() {
  const data = {}; 
  this.userService.dashboadCharts(data).subscribe({
    next: (res: any) => {
      const tiles = res?.tiles;
      const totalUsers = res?.totalUsers;

      this.topCommonData = [];

      if (tiles) {
        this.topCommonData = [
          {
            id: 1,
            title: 'Total Emails Sent',
            count: tiles.totalSent,
          },
          {
            id: 2,
            title: 'Total Failed Emails',
            count: tiles.totalFailed,
          },
          {
            id: 3,
            title: 'Total Vendors Emails',
            count: tiles.totalVendors,
          },
          {
            id: 4,
            title: 'Total Candidates Emails',
            count: tiles.totalCandidates,
          },
          // {
          //   id: 5,
          //   title: 'Total Vendors',
          //   count: overview.totalVendors,
          // },
        ];
      }

      // if (totalUsers !== undefined) {
      //   this.topCommonData.push({
      //     id: 6,
      //     title: 'Total Users',
      //     count: totalUsers,
      //   });
      // }
    },
    error: (err) => {
      console.error('Error fetching dashboard stats', err);
    }
  });
}



}
