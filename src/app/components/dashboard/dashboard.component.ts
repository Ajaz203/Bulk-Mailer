import { Component } from '@angular/core';
import { DashboardEarningChartComponent } from './dashboard-earning-chart/dashboard-earning-chart.component';
import { DashboardVisitorChartComponent } from './dashboard-visitor-chart/dashboard-visitor-chart.component';
import { TopCommonDataComponent } from './top-common-data/top-common-data.component';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DashboardTrafficChartComponent } from './dashboard-traffic-chart/dashboard-traffic-chart.component';
import { DashboardBookingHistoryComponent } from './dashboard-booking-history/dashboard-booking-history.component';
import { FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
// import { TourService } from '../../shared/services/tour.service';
import Swal from 'sweetalert2';
import { TourService } from 'ngx-ui-tour-md-menu';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [TopCommonDataComponent, DashboardVisitorChartComponent,
    DashboardEarningChartComponent, CommonModule,
    NgbDatepicker, DashboardTrafficChartComponent
    , DashboardBookingHistoryComponent, FormsModule, NgbDatepickerModule]
})
export class DashboardComponent {
  selectedDate: NgbDateStruct;
  today: NgbDateStruct;
  chartFilter = { date: this.getCurrentMonthYear() };
  topCommonData: any = [];
  role: string = '';
  selectedMonth: { year: number, month: number };
  planStatus: 'active' | 'expiring' | 'expired' | 'about_to_expire' = 'active';
  daysLeft: number = 0;
  activePlanId: number | null = null;
  plans: any[] = [];
   selectedPlan: any;
  showUserModal = false;
  userForm: any;
 
  constructor(private userService: UserService,
     private calendar: NgbCalendar,
      private titleService: Title ,
      private tourService: TourService) {
    this.titleService.setTitle('MailCept-Dashboard');
    this.today = this.calendar.getToday();
    this.selectedDate = this.today

  }

ngOnInit() {
     this.tourService.initialize([
      {
        anchorId: 'dashboard-step',
        content: 'This is your Dashboard overview.',
        title: 'Dashboard',
      },
      {
        anchorId: 'vendors-step',
        content: 'Manage your vendors here.',
        title: 'Vendors Section',
      },
      {
        anchorId: 'candidates-step',
        content: 'View and manage your candidates here.',
        title: 'Candidates',
      },
    ]);

    // Start tour
    this.tourService.start();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.role = user.role || '';
  this.getAll();

  const userId = Number(localStorage.getItem('userId'));
  if (userId) {
    this.checkSubscription(userId);
  }

}

/**  Check current subscription status */
checkSubscription(userId: number) {
  const payload = { userId };

  this.userService.subscription(payload).subscribe({
    next: (res: any) => {
      const subscription = res.subscription;

      if (subscription) {
        const daysRemaining = subscription.daysRemaining;

        //  Show expiring alert if 3 or fewer days are left
        if (daysRemaining <= 3 && daysRemaining > 0) {
          this.planStatus = 'expiring';
          this.daysLeft = daysRemaining;
          this.showExpiringAlert();
        } 
        // Show expired popup if plan already expired
        else if (daysRemaining <= 0) {
          this.planStatus = 'expired';
          this.showExpiredPopup();
        }
        //  Otherwise, active plan
        else {
          this.planStatus = 'active';
        }
      } else {
        this.planStatus = 'active';
      }
    },
    error: (err) => {
      if (err.status === 403) {
        this.planStatus = 'expired';
        this.showExpiredPopup();
      } else {
        console.error('Subscription check failed:', err);
      }
    }
  });
}


/**  Expiring alert (optional) */
showExpiringAlert() {
  Swal.fire({
    title: 'Your plan is about to expire',
    text: `Your plan will expire in ${this.daysLeft} days. Renew now to avoid interruption.`,
    icon: 'info',
    confirmButtonText: 'Renew Now',
    showCancelButton: true,
    cancelButtonText: 'Later',
    confirmButtonColor: '#00457C'
  }).then((result) => {
    if (result.isConfirmed) {
      this.renewPlan();
    }
  });
}

/** Expired popup */
showExpiredPopup() {
  Swal.fire({
    title: 'Your plan has expired',
    text: 'Please renew your plan to continue using Mailcept services.',
    icon: 'warning',
    confirmButtonText: 'Renew Now',
    allowOutsideClick: false,
    confirmButtonColor: '#00457C'
  }).then((result) => {
    if (result.isConfirmed) {
      this.renewPlan();
    }
  });
}

/**  Renewal redirect */
renewPlan() {
  // Optionally store intended action before redirect
  localStorage.setItem('renewalTriggered', 'true');
  window.location.href = '/packages';
}
  getAll() {
    if (this.role === 'user') {
      // Get from separate API for user role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.userId) return;

      this.userService.getDashboardStats(user.userId).subscribe({
        next: (res: any) => {
          const tiles = res?.overview;
          if (!tiles) return;

          this.topCommonData = [
            { id: 1, title: 'Total Sent Emails', count: tiles.totalEmailsSent || 0 },
            { id: 2, title: 'Total Candidates', count: tiles.totalCandidates || 0 },
            { id: 3, title: 'Total Vendors', count: tiles.totalVendors || 0 },
            { id: 4, title: 'Draft Mails', count: tiles.totalDrafts || 0 }
          ];
        },
        error: (err) => {
          console.error('Error fetching user dashboard stats', err);
        }
      });
    }
    else {
      // Use existing dashboardCharts API for admin & superadmin
      const data: any = { role: this.role };

      this.userService.dashboadCharts(data).subscribe({
        next: (res: any) => {
          this.topCommonData = [];

          if (this.role === 'superadmin') {
            const tiles = res?.superadminTiles?.[0];
            if (!tiles) return;

            this.topCommonData = [
              { id: 1, title: 'All Admins', count: tiles.allAdmins || 0 },
              { id: 2, title: 'All Users', count: tiles.allUsers || 0 },
              { id: 3, title: 'Total Candidates', count: tiles.totalCandidates || 0 },
              { id: 4, title: 'Total Vendors', count: tiles.totalVendors || 0 },
              { id: 5, title: 'Total Sent Emails', count: tiles.totalSentEmails || 0 },
              { id: 6, title: 'Email Failures', count: tiles.emailFailures || 0 }
            ];
          }
          else if (this.role === 'admin') {
            const tiles = res?.tiles;
            if (!tiles) return;

            this.topCommonData = [
              { id: 1, title: 'All Users', count: tiles.totalUsers || 0 },
              { id: 2, title: 'Total Candidates', count: tiles.totalCandidates || 0 },
              { id: 3, title: 'Total Vendors', count: tiles.totalVendors || 0 },
              { id: 4, title: 'Total Sent Emails', count: tiles.totalSent || 0 }
            ];
          }
        },
        error: (err) => {
          console.error('Error fetching dashboard stats', err);
        }
      });
    }
  }


  onDateSelect(date: NgbDateStruct) {
    this.selectedDate = date;
    const formatted = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    this.chartFilter = { date: formatted };
  }

  isToday(date: NgbDateStruct): boolean {
    return date.day === this.today.day &&
      date.month === this.today.month &&
      date.year === this.today.year;
  }

  isSelected(date: NgbDateStruct): boolean {
    return date.day === this.selectedDate?.day &&
      date.month === this.selectedDate?.month &&
      date.year === this.selectedDate?.year;
  }



  private getCurrentMonthYear(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }

}
