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
      return { 'background-color': '#ffc107' };
    case 'Total Vendors':
      return { 'background-color': '#0dcaf0' }; 
    case 'Total Sent Emails':
      return { 'background-color': ' #28a745' }; 
    case 'All Users ':
      return { 'background-color': '#6c757d' }; 
    default:
      return { 'background-color': '#343a40' }; 
  }
}

getBorderClass(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('sent')) {
    return 'border-start border-end border-4 border-success';
  } else if (lowerTitle.includes('admin')) {
    return 'border-start border-end border-4 border-warning';
  } else if (lowerTitle.includes('vendor')) {
    return 'border-start border-end border-4 border-info';
  } else if (lowerTitle.includes('candidate')) {
    return 'border-start border-end border-4 border-primary';
  } else if (lowerTitle.includes('user')) {
    return 'border-start border-end border-4 border-secondary';
  } else if (lowerTitle.includes('failure')) {
    return 'border-start border-end border-4 border-danger';
  } else if (lowerTitle.includes('draft')) {
    return 'border-start border-end border-4 border-dark';
  } else {
    return 'border-start border-end border-4 border-secondary';
  }
}


}
