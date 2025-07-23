import { Component, OnInit } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../shared/services/user.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; 

@Component({
  selector: 'app-dashboard-visitor-chart',
  standalone: true,
  templateUrl: './dashboard-visitor-chart.component.html',
  styleUrl: './dashboard-visitor-chart.component.scss',
  imports: [
 
    NgChartsModule 
  ]
})
export class DashboardVisitorChartComponent implements OnInit {

  public pieChartType: ChartType = 'pie';

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
        borderWidth: 1
      }
    ]
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6c757d'
        }
      }
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.userService.getAllStat().subscribe({
      next: (res: any) => {
        const stats = res?.emailStats || {};
        const today = stats.today || 0;
        const thisWeek = stats.thisWeek || 0;
        const thisMonth = stats.thisMonth || 0;

        // Update chart data directly
        this.pieChartData.datasets[0].data = [today, thisWeek, thisMonth];

        // Optional: trigger chart update
        this.pieChartData = { ...this.pieChartData };
      },
      error: (error) => console.error('Error loading statistics:', error)
    });
  }
}
