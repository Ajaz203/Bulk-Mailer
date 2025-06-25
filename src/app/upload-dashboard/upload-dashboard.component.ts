import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleUploadComponent } from '../single-upload/single-upload.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { CandidateListComponent } from '../candidate-list/candidate-list.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload-dashboard',
  standalone: true,
  imports: [CommonModule, SingleUploadComponent, BulkUploadComponent,CandidateListComponent],
  templateUrl: './upload-dashboard.component.html',
  styleUrls: ['./upload-dashboard.component.css']
})
export class UploadDashboardComponent {
  constructor(private router: Router) {}
  uploadedCandidates: any[] = [];
SegmentRequest:any;
segment: string = 'candidate';
  onExcelDataReceived(data: any[]) {
    this.uploadedCandidates = data;
  }
   goToAbout() {
    this.router.navigate(['/cat-table']);
  }
}
