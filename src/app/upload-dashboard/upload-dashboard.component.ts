import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleUploadComponent } from '../single-upload/single-upload.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-dashboard',
  standalone: true,
  imports: [CommonModule, SingleUploadComponent, BulkUploadComponent],
  templateUrl: './upload-dashboard.component.html',
  styleUrls: ['./upload-dashboard.component.css']
})
export class UploadDashboardComponent {
  openDropdown = false;
segment: string = 'candidate';
uploadedCandidates: any[] = [];
SegmentRequest:any;
dropdown() {
  this.router.navigate(['/candidate-list']);
}
  constructor(private router: Router) {}

  onExcelDataReceived(data: any[]) {
    this.uploadedCandidates = data;
  }
   goToAbout() {
    this.router.navigate(['/cat-table']);
  }
}
