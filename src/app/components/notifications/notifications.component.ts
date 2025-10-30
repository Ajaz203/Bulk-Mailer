import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  role: 'superadmin' | 'admin' | 'user' = 'user';
  userId: number | null = null;

  constructor(private authService: UserService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (userData: any) => {
        this.role = userData?.role || 'user';
        this.userId = userData?.id || userData?.userId || null;
        this.loadNotifications();
      },
      error: (err: any) => {
        console.error('Error getting user data:', err);
        this.role = 'user';
        this.loadNotifications();
      }
    });
  }

  
  loadNotifications(): void {
    let apiCall;

    if (this.role === 'superadmin') {
      apiCall = this.authService.getNotifications();
    } else {
      apiCall = this.authService.getUserNotifications({ userId: this.userId });
    }

    apiCall.subscribe({
      next: (res: any) => {
        this.notifications = Array.isArray(res) ? res : res.data || [];

        // Map notifications for display
        this.notifications = this.notifications.map((n: any) => ({
          ...n,
          time: new Date(n.createdAt).toLocaleString(),
          fontColor: n.status === 'unread' ? 'warning' : 'success'
        }));
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
      }
    });
  }
}
