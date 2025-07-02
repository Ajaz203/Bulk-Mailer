import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmailService } from '../services/bulk-email.service';
import Swal from 'sweetalert2';
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
  userName: string = '';
  userId: string = '';
  userEmail: string = '';
  openDropdownVendor = false;

  constructor(private router: Router, private service: EmailService) { }

  goToVendorList() {
    this.router.navigate(['/vendor-list']);
  }
  getDraftData() {
    const targetType = 'candidate';
    this.service.getDrafts(targetType).subscribe({
      next: (res) => {
        this.draftList = Array.isArray(res) ? res : [];
        console.log('Draft Data:', res);
      },
      error: (err) => {
        console.error('Error fetching drafts:', err);
      }
    });
  }

  sendMail() {
    console.log('Send Mail clicked');
  }

isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

logout() {
  if (this.isBrowser()) {
    localStorage.clear();
  }
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Logout'
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['/login']);
    }
  });
}

 ngOnInit(): void {
  const currentUrl = this.router.url;
  console.log('Current URL:', currentUrl);

  if (currentUrl.includes('vendorbulkupload')) {
    this.segment = 'vendor';
  } else if (currentUrl.includes('cat-table')) {
    this.segment = 'viewData';
  } else {
    this.segment = '';
  }

  if (this.isBrowser()) {
    this.userName = localStorage.getItem('name') || 'User';
    this.userId = localStorage.getItem('userId') || 'Unknown';
    this.userEmail = localStorage.getItem('email') || 'Unknown';
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
