import { Component, OnInit } from '@angular/core';
import { EmailService } from '../services/bulk-email.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  sentCount = 0;
  draftCount = 0;
  vendorCount = 0;
  recentMails: any[] = [];

  constructor(private service: EmailService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) return;

    this.service.getDashboardStats(userId).subscribe({
      next: (res: any) => {
        this.sentCount = res.sentCount || 0;
        this.draftCount = res.draftCount || 0;
        this.vendorCount = res.vendorCount || 0;
        this.recentMails = res.recentMails || [];
      },
      error: (err) => {
        console.error('Dashboard loading failed', err);
      }
    });
  }
}

