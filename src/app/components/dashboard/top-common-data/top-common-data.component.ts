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

    default:
      return 'bi-question-circle'; 
  }
}

getBgStyle(title: string): { [klass: string]: any } {
  switch (title) {
    case 'Total Candidates':
      return { 'background-color': '#007bff' }; 
    case 'Email Failures':
      return { 'background-color': 'red' };
    case 'All Admins':
      return { 'background-color': '#747dc6' };
    case 'Total Vendors':
      return { 'background-color': '#4aa4d9' }; 
    case 'Total Sent Emails':
      return { 'background-color': ' #28a745' }; 
    case 'All Users ':
      return { 'background-color': '#9e65c2' }; 
    default:
      return { 'background-color': '#9e65c2' }; 
  }
}

getBorderClass(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('sent')) {
    return 'border-success-custom';
  } else if (lowerTitle.includes('admin')) {
    return 'border-warning-custom';
  } else if (lowerTitle.includes('vendor')) {
    return 'border-vendor-custom';
  } else if (lowerTitle.includes('candidate')) {
    return 'border-primary-custom';
  } else if (lowerTitle.includes('user')) {
    return 'border-secondary-custom';
  } else if (lowerTitle.includes('failure')) {
    return 'border-danger-custom';
  } else if (lowerTitle.includes('draft')) {
    return 'border-dark-custom';
  } else {
    return 'border-secondary-custom';
  }
}



}
