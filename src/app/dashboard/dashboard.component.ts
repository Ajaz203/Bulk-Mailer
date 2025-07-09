import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  overviewStats: any[] = [];
  emailTrendLabels: string[] = [];
  emailTrendData: any = { labels: [], datasets: [] };
  emailTypeLabels: string[] = [];
  emailTypeData: any = { labels: [], datasets: [] };
  userRoles: any[] = [];
  isBrowser: boolean = false;

    lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5000, // Adjust step size based on your data
          callback: function (value: number | string): string {
            return Number(value).toLocaleString(); // format with commas
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333'
        }
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            return `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`;
          }
        }
      }
    }
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#444',
          font: {
            size: 13,
            family: 'Segoe UI'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  constructor(
    private service: EmailService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.service.getDashboardStats(userId).subscribe({
      next: (res: any) => {
        this.userName = res.userName;

        const o = res.overview || {};
        this.overviewStats = [
          { label: 'Sent', count: o.totalEmailsSent || 0, icon: 'bi-send' },
          { label: 'Drafts', count: o.totalDrafts || 0, icon: 'bi-file-earmark-text' },
          { label: 'Scheduled', count: o.totalScheduled || 0, icon: 'bi-clock-history' },
          { label: 'Candidates', count: o.totalCandidates || 0, icon: 'bi-person' },
          { label: 'Vendors', count: o.totalVendors || 0, icon: 'bi-building' }
        ];

        const trend = res.emailTrend || [];
        this.emailTrendLabels = trend.map((d: any) => d.date);
        this.emailTrendData = {
          labels: this.emailTrendLabels,
          datasets: [
            {
              data: trend.map((d: any) => d.count),
              label: 'Emails Sent',
              borderColor: '#5ab745',
              backgroundColor: 'rgba(90, 183, 69, 0.1)',
              tension: 0.3,
              pointBackgroundColor: '#5ab745',
              fill: true
            }
          ]
        };


        const types = res.emailTypes || [];
        this.emailTypeLabels = types.map((t: any) => t.type);
        this.emailTypeData = {
          labels: this.emailTypeLabels,
          datasets: [{
            data: types.map((t: any) => t.count),
            backgroundColor: types.map((t: any) => {
              const type = t.type?.trim().toLowerCase();
              if (type === 'immediate') return '#F0561D';
              if (type === 'scheduled') return '#F8AE54';
              return '#cccccc'; // fallback
            }),
            hoverBackgroundColor: types.map((t: any) => {
              const type = t.type?.trim().toLowerCase();
              if (type === 'immediate') return '#F0561D';
              if (type === 'scheduled') return '#F8AE54';
              return '#cccccc'; // fallback
            }),
            hoverOffset: 8,
            borderWidth: 1,
            borderColor: '#fff'
          }]
        };


        this.userRoles = res.userRoles || [];
      },
      error: (err) => {
        console.error('Dashboard loading failed', err);
      }
    });
  }

  generateColors(count: number): string[] {
    const palette = ['#007bff', '#ffc107', '#28a745', '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997'];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  }
}
