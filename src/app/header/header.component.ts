import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { EmailService } from '../services/bulk-email.service';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
// import introJs from 'intro.js';
declare var bootstrap: any;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('imageRef', { static: false }) imageRef!: ElementRef;
  imageUrl: string | null = null;
  croppedImage: string | null = null;
  openDropdown = false;
  segment: string = '';
  uploadedCandidates: any[] = [];
  openMailDropdown = false;
  draftList: any[] = [];
  userName: string = '';
  userId: string = '';
  userEmail: string = '';
  openDropdownVendor = false;
  profileImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private router: Router, private service: EmailService
    , @Inject(PLATFORM_ID) private platformId: Object) { }
  // ngAfterViewInit(): void {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   const isLoggedIn = localStorage.getItem('token');
  //   const hasSeenIntro = localStorage.getItem('hasSeenIntro');

  //   if (isLoggedIn && !hasSeenIntro) {
  //     setTimeout(async () => {
  //       const introJs = (await import('intro.js')).default;


  //       introJs()
  //         .setOptions({
  //           steps: [
  //             {
  //               intro: '👋 <b>Welcome to MailCept!</b><br>Let’s take a quick tour of your workspace.'
  //             },
  //             {
  //               element: document.querySelector('.nav-link[routerLink="/dashboard"]')!,
  //               intro: '📊 <b>Dashboard</b><br>Get an overview of email stats and activity.'
  //             },
  //             {
  //               element: document.querySelector('.nav-link[routerLink="/candidate-upload"]')!,
  //               intro: '👤 <b>Candidates</b><br>Upload and manage candidate profiles here.'
  //             },
  //             {
  //               element: document.querySelector('.nav-link[role="button"]')!,
  //               intro: '🤝 <b>Vendors</b><br>Manage vendor contacts and communication.'
  //             },
  //             {
  //               element: document.querySelector('.nav-item.dropdown > a.nav-link.dropdown-toggle[href="javascript:void(0)"]')!,
  //               intro: `
  //                 <div style="display: flex; align-items: center; gap: 10px;">
  //                   <i class="bi bi-send-fill text-success" style="font-size: 20px; color: black;"></i>
  //                   <div>
  //                     <b>Mail</b><br>
  //                     Access all your sent mails, drafts, and more.
  //                   </div>
  //                 </div>
  //               `

  //             }

  //           ],
  //           tooltipClass: 'customIntroTooltip',
  //           showProgress: true,
  //           showBullets: true,
  //           exitOnEsc: true,
  //           nextLabel: 'Next →',
  //           prevLabel: '← Back',
  //           doneLabel: '🚀 Got it!'
  //         })
  //         .oncomplete(() => localStorage.setItem('hasSeenIntro', 'true'))
  //         .onexit(() => localStorage.setItem('hasSeenIntro', 'true'))
  //         .start();

  //     }, 1500);
  //   }
  // }
  ngOnInit(): void {
    if (this.isBrowser()) {
      this.userId = localStorage.getItem('userId') || '0';
      this.userName = localStorage.getItem('name') || 'User';
      this.userEmail = localStorage.getItem('email') || 'unknown@example.com';
      this.profileImage = localStorage.getItem('profileImage') || '';
    }


    if (this.userId && this.userId !== '0') {
      this.loadUserProfile();
    } else {
      console.warn('User not logged in yet. Skipping loadUserProfile.');
    }

    const currentUrl = this.router.url;
    this.setSegmentFromUrl(currentUrl);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setSegmentFromUrl(event.urlAfterRedirects);
      }
    });
  }


  setSegmentFromUrl(url: string): void {
    if (url.includes('/dashboard')) {
      this.segment = 'dashboard';
    } else if (url.includes('/vendorbulkupload') || url.includes('/vendor-list')) {
      this.segment = 'vendor';
    } else if (url.includes('/cat-table')) {
      this.segment = 'viewData';
    } else if (url.includes('/all-mails') || url.includes('/drafts')) {
      this.segment = 'mail';
    } else {
      this.segment = '';
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement; ``
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadToServer(file: File): void {
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('userId', this.userId);

    this.service.uploadProfileImage(formData).subscribe({
      next: (res: any) => {
        console.log('Uploaded successfully:', res);
      },
      error: (err: any) => {
        console.error('Upload failed:', err);
      }
    });
  }
  openEditProfileModal(): void {
    const modalEl = document.getElementById('editProfileModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  saveProfile(): void {
    const formData = new FormData();
    formData.append('userId', this.userId.toString());
    formData.append('userName', this.userName.trim());

    if (this.selectedFile instanceof File) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    this.service.uploadProfileImage(formData).subscribe({
      next: (res) => {
        localStorage.setItem('name', this.userName);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully'
        });

        const modalEl = document.getElementById('editProfileModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err) => {
        console.error('Profile update failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Something went wrong while updating profile.'
        });
      }
    });
  }
  loadUserProfile(): void {
    const userIdStr = localStorage.getItem('userId');
    const userId = Number(userIdStr);

    if (!userId || isNaN(userId)) {
      console.warn('Invalid userId', userIdStr);
      return;
    }

    this.service.getUserProfileUpdate(userId).subscribe({
      next: (res: any) => {
        const user = res;
        this.userName = user.name?.trim() || 'User';
        localStorage.setItem('suggestion', user.suggestion ? '1' : '0');
        let profilePath = user.profilePicture || '';
        profilePath = profilePath.replace(/\\/g, '/');
        const encodedPath = encodeURI(profilePath);

        this.profileImage = encodedPath
          ? `${this.service.url}${encodedPath}`
          : '';

        localStorage.setItem('name', this.userName);
        localStorage.setItem('profileImage', this.profileImage);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.profileImage = '';
      }
    });
  }



  setDefaultProfile(): void {
    this.userName = 'User';
    this.profileImage = '';
    localStorage.setItem('name', this.userName);
    localStorage.setItem('profileImage', this.profileImage);
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
        if (this.isBrowser()) {
          localStorage.clear();
        }
        this.router.navigate(['/login']);
      }
    });
  }



  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  dropdown() {
    this.segment = '';
    this.router.navigate(['/candidate-list']);
  }

  goToVendorList() {
    this.router.navigate(['/vendor-list']);
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
