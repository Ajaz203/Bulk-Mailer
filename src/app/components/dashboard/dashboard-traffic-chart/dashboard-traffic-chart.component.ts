import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { dashboardTrafficChart } from '../../../shared/data/chart/dashboard-chart';
import { UserService } from '../../../shared/services/user.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard-traffic-chart',
  standalone: true,
  templateUrl: './dashboard-traffic-chart.component.html',
  styleUrl: './dashboard-traffic-chart.component.scss',
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormsModule,

  ]
})
export class DashboardTrafficChartComponent implements OnChanges {
  @Input() filter: { date: string };
  selectedRange: 'day' | 'week' | 'month' = 'month';
  chartOptions: any = { ...dashboardTrafficChart };
  trafficData: any = {};
  selectedDate: NgbDateStruct;
  calendarDate: Date = new Date();

  constructor(private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.loadChartData();
    }
  }

  onDateChange(event: any) {
    const selected = event.value;
    if (!selected) return;

    const formattedDate = selected.toISOString().split('T')[0];
    this.filter = { date: formattedDate };

    this.loadChartData();
  }

 loadChartData() {
  let selectedDate = this.filter?.date;
  if (!selectedDate) return;


  if (/^\d{4}-\d{2}$/.test(selectedDate)) {
    selectedDate += '-01';
  }


  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const payload = {
    date: selectedDate,
    role: user?.role,        
    userId: user?.userId      
  };

  this.userService.trafficChart(payload).subscribe((res: any) => {
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

    this.updateChart(this.selectedRange);
  });
}
hasChartData(): boolean {
  const currentData = this.trafficData[this.selectedRange];
  if (!currentData?.values?.length) return false;
  return currentData.values.some((val: number) => val > 0);
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
      series: [
        {
          name: 'Referral Traffic',
          data: values
        }
      ],
      xaxis: {
        categories: labels
      }
    };
  }
}
