import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-dashboard-booking-history',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard-booking-history.component.html',
  styleUrl: './dashboard-booking-history.component.scss',
})
export class DashboardBookingHistoryComponent implements OnInit {

  top5Users: any[] = [];

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.loadDashboardCharts();
  }

loadDashboardCharts(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

  const data = {
    userId: user.userId,
    role: user.role
  };
  this.userService.dashboadCharts(data).subscribe((res) => {
    let result: any;
    if (res instanceof ArrayBuffer) {
      const decoder = new TextDecoder('utf-8');
      const jsonString = decoder.decode(res);
      result = JSON.parse(jsonString);
    } else {
      result = res;
    }
    this.top5Users = result?.top5Users || [];
  });
}
trackByUser(index: number, user: any): any {
  return user.userId;
}
getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); 
}


}
