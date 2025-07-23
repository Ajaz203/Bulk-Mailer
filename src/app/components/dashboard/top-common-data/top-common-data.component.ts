import { Component, Input } from '@angular/core';
import { dashboardCommonData } from '../../../shared/interface/dashboard';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-top-common-data',
    templateUrl: './top-common-data.component.html',
    styleUrl: './top-common-data.component.scss',
    standalone: true,
    imports: [CommonModule]
})
export class TopCommonDataComponent {
  @Input() topCommonData: any[] = [];
  @Input() data: dashboardCommonData;

getIcon(title: string): string {
  switch (title) {
    case 'Total Emails Sent':
      return 'bi-envelope-fill';
    case 'Total Drafts':
      return 'bi-file-earmark-text';
    case 'Total Scheduled':
      return 'bi-calendar-check';
    case 'Total Candidates':
      return 'bi-person-badge';
    case 'Total Vendors':
      return 'bi-people-fill';
    case 'Total Users':
      return 'bi-bar-chart';
    default:
      return 'bi-question-circle';
  }
}

getBgStyle(title: string): { [klass: string]: any } {
  switch (title) {
    case 'Total Candidates':
      return { 'background-color': '#28a745' }; 
    case 'Total Vendors':
      return { 'background-color': 'red' };
    case 'Total Drafts':
      return { 'background-color': '#ffc107' };
    case 'Total Scheduled':
      return { 'background-color': '#0dcaf0' }; 
    case 'Total Emails Sent':
      return { 'background-color': '#007bff' }; 
    case 'Total Users':
      return { 'background-color': '#6c757d' }; 
    default:
      return { 'background-color': '#343a40' }; 
  }
}




getBorderClass(title: string): string {
  switch (title) {
    case 'Total Emails Sent':
      return 'border-start border-end border-4 border-primary';
    case 'Total Drafts':
      return 'border-end border-start border-4 border-warning';
    case 'Total Scheduled':
      return 'border-start border-end border-4 border-info';
    case 'Total Candidates':
      return 'border-end border-start border-4 border-success';
    case 'Total Vendors':
      return 'border-start border-end border-4 border-danger';
    case 'Total Users':
      return 'border-end border-start border-4 border-secondary';
    default:
      return 'border-start border-end border-4 border-secondary';
  }
}



}
