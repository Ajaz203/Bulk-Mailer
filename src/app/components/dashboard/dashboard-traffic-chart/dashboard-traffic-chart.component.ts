import { Component } from '@angular/core';
import { dashboardTrafficChart } from '../../../shared/data/chart/dashboard-chart';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
    selector: 'app-dashboard-traffic-chart',
    templateUrl: './dashboard-traffic-chart.component.html',
    styleUrl: './dashboard-traffic-chart.component.scss',
    imports: [NgApexchartsModule]
})
export class DashboardTrafficChartComponent {

  public trafficChart = dashboardTrafficChart;

}
