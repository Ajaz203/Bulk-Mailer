import { Component } from '@angular/core';
import { dashboardEarningChart } from '../../../shared/data/chart/dashboard-chart';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'app-dashboard-earning-chart',
    templateUrl: './dashboard-earning-chart.component.html',
    styleUrl: './dashboard-earning-chart.component.scss',
    imports: [NgApexchartsModule]
})
export class DashboardEarningChartComponent {

dashboardVisitorChart: any;   
  dashboardEarningChart: any;   
 constructor(private userService: UserService) {}
   ngOnInit(): void {
    this.getAll();
  }
getAll() {
  this.userService.getAllStat().subscribe({
    next: (res: any) => {
      const emailStats = res?.emailStats;
      const emailTrend = res?.emailTrend;

      if (emailStats) {
        this.dashboardVisitorChart = {
          series: [
            emailStats.today || 0,
            emailStats.thisWeek || 0,
            emailStats.thisMonth || 0
          ],
          labels: ['Today', 'This Week', 'This Month'],
          chart: { type: 'pie', height: 350 },
          colors: ['#36b9cc', '#4e73df', '#1cc88a'],
          dataLabels: { enabled: true },
          plotOptions: { pie: { expandOnClick: true } },
          legend: { position: 'bottom' },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: { width: 320 },
              legend: { position: 'bottom' }
            }
          }]
        };
      }

      if (emailTrend?.length) {
        const trendDates = emailTrend.map((item: any) => item.date);
        const trendCounts = emailTrend.map((item: any) => item.count);

        this.dashboardEarningChart = {
          series: [{
            name: 'Emails Sent',
            data: trendCounts
          }],
          chart: {
            type: 'bar',
            height: 350
          },
          colors: ['#f6c23e'],
          dataLabels: {
            enabled: true
          },
          xaxis: {
            categories: trendDates,
            labels: {
              style: {
                fontSize: '12px'
              }
            }
          },
          yaxis: {
            title: {
              text: 'Email Count'
            }
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          fill: {
            opacity: 1
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              columnWidth: '50%'
            }
          },
          legend: {
            position: 'top'
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                height: 300
              }
            }
          }]
        };
      }
    },
    error: (err) => {
      console.error('Error fetching stats', err);
    }
  });
}

}
