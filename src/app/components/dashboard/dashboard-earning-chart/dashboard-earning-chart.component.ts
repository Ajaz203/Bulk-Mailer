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
    this.userService.getAllStat().subscribe({
      next: (res: any) => {
        const emailStats = res?.emailStats;
        const emailTrend = res?.emailTrend;

        // PIE CHART
        if (emailStats) {
          this.dashboardVisitorChart = {
            series: [
              emailStats.today || 0,
              emailStats.thisWeek || 0,
              emailStats.thisMonth || 0
            ],
            labels: ['Today', 'This Week', 'This Month'],
            chart: {
              type: 'pie',
              height: 350,
              background: '#1e1e2f'
            },
            colors: ['#6EC1E4', '#A3D9A5', '#FFD166'],
            dataLabels: { enabled: true },
            legend: {
              position: 'bottom',
              labels: { colors: '#fff' }
            },
            plotOptions: {
              pie: { expandOnClick: true }
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: { width: 320 },
                legend: { position: 'bottom' }
              }
            }]
          };
        }

        // BAR CHART (SIMULATED 3D LOOK)
        if (emailTrend?.length) {
          const trendDates = emailTrend.map((item: any) => item.date);
          const trendEmailSent = emailTrend.map((item: any) => item.count);

          this.dashboardEarningChart = {
            series: [{
              name: 'Email Sent',
              data: trendEmailSent
            }],
            chart: {
              type: 'bar',
              height: 420,
              background: 'transparent',
              toolbar: { show: false }
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'flat',
                borderRadius: 6
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['#ffffff']
            },
            fill: {
              type: 'gradient',
              gradient: {
                type: 'vertical',
                shade: 'light',
                gradientToColors: ['#007acc'],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
              }
            },
            colors: ['#33ccff'],
            xaxis: {
              categories: trendDates,
              labels: {
                rotate: -30,
                style: {
                  fontSize: '13px',
                  colors: '#000'
                }
              },
              axisBorder: { show: false },
              axisTicks: { show: false }
            },
            yaxis: {
              title: {
                text: 'Total Emails Sent',
                style: {
                  fontSize: '14px',
                  color: '#333'
                }
              },
              labels: {
                formatter: (val: number) => `${val.toLocaleString()}`,
                style: {
                  fontSize: '12px',
                  color: '#333'
                }
              }
            },
            grid: {
              show: true,
              borderColor: '#ddd',
              row: {
                colors: ['#f9f9f9', 'transparent'],
                opacity: 0.5
              }
            },
            tooltip: {
              y: {
                formatter: (val: number) => `${val.toLocaleString()} NOK`
              }
            },
            legend: {
              show: false
            }
          };
        }

      },
      error: (err) => {
        console.error('Error fetching stats', err);
      }
    });
  }
}
