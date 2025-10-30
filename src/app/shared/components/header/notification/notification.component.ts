import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';
import { UserService } from '../../../services/user.service';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

interface Notification {
message: readonly unknown[];
  id: number;
  title: string;
  status: 'unread' | 'read';
  createdAt: string;
  time?: string;
  fontColor?: string;
  isNew?: boolean;
}

interface User {
  id?: number;
  userId?: number;
  role?: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications$ = new BehaviorSubject<Notification[]>([]);
  unreadCount$ = new BehaviorSubject<number>(0);
  hasNew$ = new BehaviorSubject<boolean>(false);

  isActive = false;
  role = '';
  userId: number | null = null;
  refreshSub!: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (userData: User) => {
        this.role = userData?.role || 'user';
        this.userId = userData?.id || userData?.userId || null;
        this.loadNotifications();

        // Auto-refresh every 15 seconds
        this.refreshSub = interval(15000).subscribe(() => this.loadNotifications());
      },
      error: err => console.error('Error fetching user data:', err)
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  toggle(): void {
    this.isActive = !this.isActive;
    // Removed auto-mark-as-read
  }

  loadNotifications(): void {
    const apiCall = this.role === 'superadmin'
      ? this.userService.getNotifications()
      : this.userService.getUserNotifications({ userId: this.userId });

    apiCall.subscribe({
      next: (res: any) => {
        const list: Notification[] = (res?.data || res || []).map((n: any) => ({
          ...n,
          time: new Date(n.createdAt).toLocaleString(),
          fontColor: n.status === 'unread' ? 'warning' : 'success',
          isNew: !this.notifications$.value.find(prev => prev.id === n.id),
          status: n.status as 'unread' | 'read'
        }));

        // Sort latest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        this.notifications$.next(list);
        this.unreadCount$.next(list.filter(n => n.status === 'unread').length);

        // Highlight new notifications
        this.hasNew$.next(list.some(n => n.isNew));
      },
      error: err => console.error('Error fetching notifications:', err)
    });
  }

  markAllAsRead(): void {
    const current = this.notifications$.value;
    const unreadIds = current.filter(n => n.status === 'unread').map(n => n.id);
    if (!unreadIds.length) return;

    this.userService.updateNotifications({ id: unreadIds, role: this.role }).subscribe({
      next: () => {
        const updated = current.map(n => ({
          ...n,
          status: 'read' as 'read',
          fontColor: 'muted',
          isNew: false
        }));
        this.notifications$.next(updated);
        this.unreadCount$.next(0);
        this.hasNew$.next(false);
      },
      error: err => console.error('Error marking notifications as read:', err)
    });
  }
  getInitials(title: string): string {
  if (!title) return '';
  const words = title.split(' ');
  if (words.length === 1) return words[0].charAt(0);
  return words[0].charAt(0) + words[1].charAt(0);
}

}
