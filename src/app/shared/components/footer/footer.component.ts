import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {

    public year = new Date().getFullYear()
 planStatus: 'active' | 'expiring' | 'expired' = 'active';
  daysLeft: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.checkSubscription(userId);
    }
  }

  /** 🔍 Check subscription status */
  checkSubscription(userId: number) {
    const payload = { userId };

    this.userService.subscription(payload).subscribe({
      next: (res: any) => {
        const subscription = res.subscription;

        if (subscription) {
          const daysRemaining = subscription.daysRemaining;

          if (daysRemaining <= 3 && daysRemaining > 0) {
            this.planStatus = 'expiring';
            this.daysLeft = daysRemaining;
          } else if (daysRemaining <= 0) {
            this.planStatus = 'expired';
          } else {
            this.planStatus = 'active';
          }
        } else {
          this.planStatus = 'active';
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.planStatus = 'expired';
        } else {
          console.error('Subscription check failed:', err);
        }
      }
    });
  }

  /** 🔁 Redirect for renewal */
  renewPlan() {
    localStorage.setItem('renewalTriggered', 'true');
    window.location.href = '/packages';
  }
}
