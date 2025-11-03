import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  filteredNotifications: any[] = [];
  selectedFilter: 'all' | 'read' | 'unread' = 'all';
  role: 'superadmin' | 'admin' | 'user' = 'user';
  userId: number | null = null;

  // 🕒 subscription reference for auto-refresh
  private refreshSub!: Subscription;

  constructor(private authService: UserService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (userData: any) => {
        this.role = userData?.role || 'user';
        this.userId = userData?.id || userData?.userId || null;
        this.loadNotifications();

        // 🕒 Start auto-refresh every 5 seconds
        this.refreshSub = interval(5000).subscribe(() => {
          this.loadNotifications();
        });
      },
      error: (err: any) => {
        console.error('Error getting user data:', err);
        this.loadNotifications();

        // 🕒 Still start auto-refresh even if user fetch fails
        this.refreshSub = interval(5000).subscribe(() => {
          this.loadNotifications();
        });
      }
    });
  }

  /** ✅ Cleanup on destroy */
  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  /** Load Notifications */
  loadNotifications(): void {
    const apiCall =
      this.role === 'superadmin'
        ? this.authService.getNotifications()
        : this.authService.getUserNotifications({ userId: this.userId });

    apiCall.subscribe({
      next: (res: any) => {
        this.notifications = Array.isArray(res) ? res : res.data || [];
        this.notifications = this.notifications.map((n: any) => {
          const updatedMessage = n.message?.replace(/User ID \d+/, n.senderName);
          return {
            ...n,
            message: updatedMessage,
            time: new Date(n.createdAt).toLocaleString(),
          };
        });
        this.filterNotifications();
      },
      error: (err) => console.error('Error fetching notifications:', err)
    });
  }

  /** Filter Notifications by Status */
  filterNotifications(): void {
    if (this.selectedFilter === 'all') {
      this.filteredNotifications = this.notifications;
    } else {
      this.filteredNotifications = this.notifications.filter(
        (n) => n.status === this.selectedFilter
      );
    }
  }

  /** Mark all notifications as read */
  markAllAsRead(): void {
    const unreadIds = this.notifications
      .filter((n) => n.status === 'unread')
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    const payload = {
      id: unreadIds,
      role: this.role
    };

    this.authService.updateNotifications(payload).subscribe({
      next: () => {
        this.notifications = this.notifications.map((n) => ({
          ...n,
          status: 'read'
        }));
        this.filterNotifications();
      },
      error: (err) => console.error('Error marking all as read:', err)
    });
  }

  /** Check if all notifications are read */
  isAllRead(): boolean {
    return this.notifications.every((n) => n.status === 'read');
  }
}
