import { Component } from '@angular/core';
import { dashboardEarningChart } from '../../../shared/data/chart/dashboard-chart';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
    selector: 'app-dashboard-earning-chart',
    templateUrl: './dashboard-earning-chart.component.html',
    styleUrl: './dashboard-earning-chart.component.scss',
    imports: [NgApexchartsModule]
})
export class DashboardEarningChartComponent {

  public dashboardEarningChart = dashboardEarningChart;

}
