import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexLegend,
  ApexPlotOptions,
  ApexDataLabels
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-visitor-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './dashboard-visitor-chart.component.html',
  styleUrls: ['./dashboard-visitor-chart.component.scss']
})
export class DashboardVisitorChartComponent implements OnInit {

  public chartSeries: ApexNonAxisChartSeries = [0, 0, 0];
  public chartLabels: string[] = ['Vendor Mails', 'Candidate Mails', 'Failed Mails'];

  public chartOptions: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    responsive: ApexResponsive[];
  };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  setChartOptions(): void {
  this.chartOptions = {
    series: this.chartSeries,
    labels: this.chartLabels,
    chart: {
      type: 'donut',
      width: '100%',
      height: 500,
    },
    colors: ['#4aa4d9', '#ef3f3e', '#9e65c2', '#6670bd', '#FF9800'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      formatter: (val, opts) =>
        val + ' - ' + opts.w.globals.series[opts.seriesIndex],
      offsetY: 10,
    },
    responsive: [
      {
        breakpoint: 1835,
        options: {
          chart: {
            height: 245,
          },
          legend: {
            position: 'bottom',
            itemMargin: {
              horizontal: 5,
              vertical: 1,
            },
          },
        },
      },
      {
        breakpoint: 1388,
        options: {
          chart: {
            height: 330,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 1275,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 1158,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            fontSize: '10px',
            position: 'bottom',
            offsetY: 10,
          },
        },
      },
      {
        breakpoint: 598,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            fontSize: '12px',
            position: 'bottom',
            offsetX: 5,
            offsetY: -5,
            markers: {
              width: 10,
              height: 10,
            },
            itemMargin: {
              vertical: 1,
            },
          },
        },
      },
    ],
  };
}

loadChartData(): void {
  const data = {};
  this.userService.dashboadCharts(data).subscribe({
    next: (res: any) => {
      const donutData = res?.donutChart;

      if (donutData) {
        this.chartLabels = ['Drafts', 'Scheduled', 'Sent'];

        this.chartSeries = [
          Number(donutData.drafts) || 0,
          Number(donutData.scheduled) || 0,
          Number(donutData.sent) || 0
        ];

        this.setChartOptions();
      }
    },
    error: (err) => console.error('Error fetching data:', err)
  });
}


}
