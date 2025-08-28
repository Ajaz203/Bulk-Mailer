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
  switch (title.trim()) {
    case 'Total Sent Emails':
      return 'bi-envelope-fill';
    case 'Email Failures':
      return 'bi-exclamation-triangle-fill';
    case 'All Admins':
      return 'bi-person-gear';
    case 'Total Vendors':
      return 'bi-building';
    case 'Total Candidates':
      return 'bi-person-badge';
    case 'All Users':
      return 'bi-people-fill';
    case 'Total Users':
      return 'bi-bar-chart';
    case 'Draft Mails':
      return 'bi-file-earmark-text';
    default:
      return 'bi-question-circle';
  }
}

getBgStyle(title: string): { [klass: string]: any } {
  switch (title.trim()) {
    case 'Total Candidates':
      return { 'background-color': '#007bff' }; 
    case 'Email Failures':
      return { 'background-color': 'red' };
    case 'All Admins':
      return { 'background-color': '#747dc6' };
    case 'Total Vendors':
      return { 'background-color': '#4aa4d9' }; 
    case 'Total Sent Emails':
      return { 'background-color': '#198754' }; 
    case 'All Users':
      return { 'background-color': '#9e65c2' }; 
    case 'Draft Mails':
      return { 'background-color': '#9C27B0' }; 
    default:
      return { 'background-color': '#9e65c2' }; 
  }
}

getBorderClass(title: string): string {
  switch (title.trim()) {
    case 'Total Sent Emails':
      return 'border-success-custom';
    case 'All Admins':
      return 'border-warning-custom';
    case 'Total Vendors':
      return 'border-vendor-custom';
    case 'Total Candidates':
      return 'border-primary-custom';
    case 'All Users':
    case 'Total Users':
      return 'border-secondary-custom';
    case 'Email Failures':
      return 'border-danger-custom';
    case 'Draft Mails':
      return 'border-draft-custom';
    default:
      return 'border-secondary-custom';
  }
}

}