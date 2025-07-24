import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { dashboardTrafficChart } from '../../../shared/data/chart/dashboard-chart';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-dashboard-traffic-chart',
  standalone: true,
  templateUrl: './dashboard-traffic-chart.component.html',
  styleUrl: './dashboard-traffic-chart.component.scss',
  imports: [NgApexchartsModule]
})
export class DashboardTrafficChartComponent implements OnChanges {
  @Input() filter: any;
  selectedRange: 'day' | 'week' | 'month' = 'month';
  chartOptions: any = { ...dashboardTrafficChart };
  trafficData: any = {};

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.loadChartData();
    }
  }

  loadChartData() {
    const selectedDate = this.filter?.date;

    this.userService.trafficChart({ date: selectedDate }).subscribe((res: any) => {
      const data = res?.data || {};

      this.trafficData = {
        day: {
          labels: data?.day?.labels || [],
          values: data?.day?.values || []
        },
        week: {
          labels: data?.week?.labels || [],
          values: data?.week?.values || []
        },
        month: {
          labels: data?.month?.labels || [],
          values: data?.month?.values || []
        }
      };

      // Default to month view
      this.updateChart(this.selectedRange);
    });
  }

  updateFilter(range: 'day' | 'week' | 'month') {
    this.selectedRange = range;
    this.updateChart(range);
  }

  updateChart(range: 'day' | 'week' | 'month') {
    const labels = this.trafficData[range]?.labels || [];
    const values = this.trafficData[range]?.values || [];

    this.chartOptions = {
      ...dashboardTrafficChart,
      series: [{
        name: 'Referral Traffic',
        data: values
      }],
      xaxis: {
        categories: labels
      }
    };
  }
}
