import { Component } from '@angular/core';
import { dashboardVisitorChart } from '../../../shared/data/chart/dashboard-chart';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../shared/services/user.service';
@Component({
    selector: 'app-dashboard-visitor-chart',
    templateUrl: './dashboard-visitor-chart.component.html',
    styleUrl: './dashboard-visitor-chart.component.scss',
    imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgApexchartsModule]
})
export class DashboardVisitorChartComponent {

  // public dashboardVisitorChart = dashboardVisitorChart;
 dashboardVisitorChart: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.userService.getAllStat().subscribe({
      next: (res: any) => {
        const emailStats = res?.emailStats;

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
              height: 350
            },
            colors: ['#36b9cc', '#4e73df', '#1cc88a'],
            dataLabels: {
              enabled: true
            },
            plotOptions: {
              pie: {
                expandOnClick: true
              }
            },
            legend: {
              position: 'bottom'
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 320
                },
                legend: {
                  position: 'bottom'
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
