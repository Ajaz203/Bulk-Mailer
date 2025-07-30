import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModalComponent } from './logout-modal/logout-modal.component';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  standalone: true,
  imports: [FeatherIconsComponent, CommonModule, AsyncPipe]
})
export class UserProfileComponent {
  user$ = this.userService.getUser();
  isActive = false;

  // Replace this with your live/public base URL
  private baseUrl: string = 'https://79971fdf955d.ngrok-free.app/';

  constructor(
    private modal: NgbModal,
    private userService: UserService,
    private router: Router
  ) {}
getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return 'assets/images/users/5.jpg';

  // If already a fallback or from assets
  if (imagePath.includes('assets')) return imagePath;

  return this.baseUrl + imagePath.replace(/\\/g, '/'); // convert windows backslashes
}

onImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  if (!img.src.includes('default-avatar.png')) {
    img.src = 'assets/images/users/5.jpg';
  }
}


  goToAccount() {
    this.router.navigate(['/setting']);
  }

  toggle() {
    this.isActive = !this.isActive;
  }

  logout() {
    this.modal.open(LogoutModalComponent, { centered: true });
  }
}
