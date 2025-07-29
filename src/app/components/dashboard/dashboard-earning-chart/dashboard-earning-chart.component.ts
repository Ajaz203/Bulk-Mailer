import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UserService } from '../../../shared/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-earning-chart',
  templateUrl: './dashboard-earning-chart.component.html',
  styleUrls: ['./dashboard-earning-chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule, DatePipe]
})
export class DashboardEarningChartComponent {
  dashboardVisitorChart: any;
  dashboardEarningChart: any;
  lastUpdated: Date = new Date();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getAll();
  }

getAll() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

  const data = {
    userId: user.userId,
    role: user.role
  };
  this.userService.dashboadCharts(data).subscribe({
    next: (res: any) => {
      const barData = res?.barChart || {};
      const vendorMails = barData.monthlyVendorMails || [];
      const candidateMails = barData.monthlyCandidateMails || [];
      const failedMails = barData.monthlyFailedMails || [];

      const months = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (6 - i));
        return date.toLocaleString('default', { month: 'short' });
      });

      const getCountByMonth = (data: any[], month: string) => {
        const entry = data.find(item => item.month === month);
        return entry ? entry.count : 0;
      };

      const vendorSeries = months.map(m => getCountByMonth(vendorMails, m));
      const candidateSeries = months.map(m => getCountByMonth(candidateMails, m));
      const failedSeries = months.map(m => getCountByMonth(failedMails, m));

      this.dashboardEarningChart = {
        series: [
          { name: 'Vendor', data: vendorSeries },
          { name: 'Candidate', data: candidateSeries },
          { name: 'Failed', data: failedSeries }
        ],
        colors: [ "#747dc6","#4aa4d9","#ef3f3e"],
        chart: {
          type: 'bar',
          height: 420,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
            endingShape: 'rounded'
          }
        },
        dataLabels: { enabled: false },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: months,
          labels: {
            rotate: -30,
            style: { fontSize: '12px', colors: '#000' }
          },
          axisTicks: { show: false },
          axisBorder: { show: false }
        },
        yaxis: {
          title: {
            text: 'Emails Count',
            style: { fontSize: '12px', color: '#333', fontWeight: '600' }
          },
          labels: {
            formatter: (val: number) => `${val.toLocaleString()}`,
            style: { fontSize: '12px', color: '#333'  }
          },
          min: 0
        },
        fill: { opacity: 1 },
        tooltip: {
          y: {
            formatter: (val: number) => `${val} emails`
          }
        },
        legend: {
          position: 'bottom',
          offsetY: -10
        },
        responsive: [
          {
            breakpoint: 1387,
            options: {
              chart: { height: 343 },
              legend: { position: 'bottom' }
            }
          },
          {
            breakpoint: 584,
            options: {
              chart: {
                height: 200,
                offsetX: -10
              },
              legend: {
                fontSize: '12px',
                position: 'bottom',
                offsetX: 5,
                offsetY: -5,
                markers: {
                  width: 10,
                  height: 10
                }
              },
              yaxis: {
                tooltip: { enabled: false }
              }
            }
          },
          {
            breakpoint: 371,
            options: {
              chart: {
                height: 200,
                width: '115%',
                offsetX: -25
              },
              legend: {
                offsetY: -5
              }
            }
          }
        ]
      };
    },
    error: (err) => {
      console.error('Error fetching stats', err);
    }
  });
}





}
