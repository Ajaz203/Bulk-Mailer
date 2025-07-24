import { Component } from '@angular/core';
import { DashboardEarningChartComponent } from './dashboard-earning-chart/dashboard-earning-chart.component';
import { DashboardVisitorChartComponent } from './dashboard-visitor-chart/dashboard-visitor-chart.component';
import { TopCommonDataComponent } from './top-common-data/top-common-data.component';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DashboardTrafficChartComponent } from './dashboard-traffic-chart/dashboard-traffic-chart.component';
import { DashboardBookingHistoryComponent } from './dashboard-booking-history/dashboard-booking-history.component';
import { FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [TopCommonDataComponent, DashboardVisitorChartComponent, 
      DashboardEarningChartComponent,CommonModule,
      NgbDatepicker,DashboardTrafficChartComponent
      ,DashboardBookingHistoryComponent,FormsModule,NgbDatepickerModule]
})
export class DashboardComponent {
  selectedDate: NgbDateStruct;
  today: NgbDateStruct;
  chartFilter = { date: this.getCurrentMonthYear() };
 topCommonData:any = [];
  
  selectedMonth: { year: number, month: number };

  constructor(private userService: UserService,private calendar: NgbCalendar) {
     this.today = this.calendar.getToday(); 
    this.selectedDate = this.today
  }

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
 
  

  

  onDateSelect(date: NgbDateStruct) {
    this.selectedDate = date;
    const formatted = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    this.chartFilter = { date: formatted };
  }

  isToday(date: NgbDateStruct): boolean {
    return date.day === this.today.day &&
           date.month === this.today.month &&
           date.year === this.today.year;
  }

  isSelected(date: NgbDateStruct): boolean {
    return date.day === this.selectedDate?.day &&
           date.month === this.selectedDate?.month &&
           date.year === this.selectedDate?.year;
  }

  

  private getCurrentMonthYear(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }
}
