import { Component } from '@angular/core';
import { dashboardVisitorChart } from '../../../shared/data/chart/dashboard-chart';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dashboard-visitor-chart',
    templateUrl: './dashboard-visitor-chart.component.html',
    styleUrl: './dashboard-visitor-chart.component.scss',
    imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgApexchartsModule]
})
export class DashboardVisitorChartComponent {

  public dashboardVisitorChart = dashboardVisitorChart;

}
