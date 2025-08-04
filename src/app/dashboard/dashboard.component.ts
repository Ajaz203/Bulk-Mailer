import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { ChartOptions, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  userName: string = '';
  overviewStats: any[] = [];
  emailTrendLabels: string[] = [];
  emailTrendData: any = { labels: [], datasets: [] };
  sendMailTrendData: any = { labels: [], datasets: [] };
  emailTypeLabels: string[] = [];
  emailTypeData: any = { labels: [], datasets: [] };
  userRoles: any[] = [];
  isBrowser: boolean = false;
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;
    this.service.getUserProfileUpdate(+userId).subscribe({
      next: async (res: any) => {
        if (res?.suggestion) return;

        // Run intro
        const introJs = (await import('intro.js')).default;
        introJs()
          .setOptions({
            steps: [
              { intro: '👋 <b>Welcome to MailCept!</b><br>Let’s take a quick tour of your workspace.' },
              {
                element: document.querySelector('.nav-link[routerLink="/dashboard"]')!,
                intro: '📊 <b>Dashboard</b><br>Get an overview of email stats and activity.'
              },
              {
                element: document.querySelector('.nav-link[routerLink="/candidate-upload"]')!,
                intro: '👤 <b>Candidates</b><br>Upload and manage candidate profiles here.'
              },
              {
                element: document.querySelector('.nav-link[role="button"]')!,
                intro: '🤝 <b>Vendors</b><br>Manage vendor contacts and communication.'
              },
              {
                element: document.querySelector('.nav-item.dropdown > a.nav-link.dropdown-toggle[href="javascript:void(0)"]')!,
                intro: `<div style="display: flex; align-items: center; gap: 10px;">
                        <i class="bi bi-send-fill text-success" style="font-size: 20px;"></i>
                        <div><b>Mail</b><br>Access all your sent mails, drafts, and more.</div>
                      </div>`
              },
              // {
              //   element: document.querySelector('.dropdown .dropdown-toggle')!,
              //   intro: `
              //         <div class="tour-step">
              //           <div class="tour-header">Your Profile</div>
              //           <div class="tour-body">Click here to edit your profile info or log out of your account.</div>
              //         </div>
              //       `
              // }
            ],
            tooltipClass: 'customIntroTooltip',
            showProgress: true,
            showBullets: true,
            exitOnEsc: true,
            nextLabel: 'Next →',
            prevLabel: '← Back',
            doneLabel: '🚀 Got it!'
          })
          .oncomplete(() => {
            this.disableIntroApi(userId);
          })
          .onbeforeexit(() => {
            this.disableIntroApi(userId);
            return true;
          })
          .start();
      },
      error: (err) => console.error('Intro check failed', err)
    });
  }

  disableIntroApi(userId: string) {
    this.service.disableIntro({ userId }).subscribe({
      next: (res) => console.log('Intro disabled via API', res),
      error: (err) => console.error('Intro disable API error', err)
    });
  }


  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
          callback: (value: number | string): string => Number(value).toLocaleString()
        },
        title: {
          display: true,
          text: 'Emails Sent',
          color: '#666',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Days',
          color: '#666',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          color: '#333'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            return `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} mails`;
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
  refreshDashboard() {
    console.log('Refreshing dashboard...');
    // Fetch latest stats and chart data
    // Example: this.loadDashboardData();
  }
  navigateTo(link: string) {
    console.log('Navigate to:', link);
    // this.router.navigateByUrl(link);
  }
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

        // For chart with actual date labels
        this.sendMailTrendData = {
          labels: trend.map((d: any) =>
            new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          ),
          datasets: [
            {
              label: 'Sent Emails',
              data: trend.map((d: any) => d.count),
              borderColor: '#00457c',
              backgroundColor: 'rgba(0, 69, 124, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#00457c',
              pointBorderColor: '#00457c',
              pointHoverRadius: 6,
              pointRadius: 4
            }
          ]
        };

        // Optional: if you still use this
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
              return '#cccccc';
            }),
            hoverBackgroundColor: types.map((t: any) => {
              const type = t.type?.trim().toLowerCase();
              if (type === 'immediate') return '#F0561D';
              if (type === 'scheduled') return '#F8AE54';
              return '#cccccc';
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
