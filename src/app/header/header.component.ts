import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmailService } from '../services/bulk-email.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  openDropdown = false;
  segment: string = '';
  uploadedCandidates: any[] = [];
  openMailDropdown = false;
  draftList: any[] = [];


  constructor(private router: Router, private service: EmailService) {}


getDraftData() {
  const targetType = 'candidate'; // or 'vendor' if needed
  this.service.getDrafts(targetType).subscribe({
    next: (res) => {
      this.draftList = res || [];
      console.log('Draft Data:', res);
    },
    error: (err) => {
      console.error('Error fetching drafts:', err);
    }
  });
}

openDrafts() {

}
openDraftInMail() {

}

sendMail() {
  console.log('Send Mail clicked');
}



  ngOnInit(): void {
    const currentUrl = this.router.url;
    console.log('Current URL:', currentUrl);

    if (currentUrl.includes('vendorbulkupload')) {
      this.segment = 'vendor';
    } else if (currentUrl.includes('cat-table')) {
      this.segment = 'viewData';
    } else {
      this.segment = ''; // Default Candidate
    }
  }

  dropdown() {
    this.segment = '';
    this.router.navigate(['/candidate-list']);
  }

  gotToCanidateList() {
    this.segment = '';
    this.router.navigate(['/candidate-list']);
  }

  goTovendorbulkUpload() {
    this.segment = 'vendor';
    this.router.navigate(['/vendorbulkupload']);
  }

  goToAbout() {
    this.segment = 'viewData';
    this.router.navigate(['/cat-table']);
  }

  onExcelDataReceived(data: any[]) {
    this.uploadedCandidates = data;
  }
}
