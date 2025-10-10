import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModalComponent } from './logout-modal/logout-modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [FeatherIconsComponent, CommonModule],
})
export class UserProfileComponent implements OnInit {
  isActive = false;
  defaultImage = 'assets/images/users/5.jpg';
  user$ = this.userService.getUser();

  constructor(
    private modal: NgbModal,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

 getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return this.defaultImage;
  if (imagePath.includes('assets')) return imagePath;
  return this.userService.getBaseUrl() + imagePath.replace(/\\/g, '/');
}


  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }

  toggle(): void {
    this.isActive = !this.isActive;
  }

  goToAccount(): void {
    this.router.navigate(['/setting']);
  }

  logout(): void {
    const modalRef = this.modal.open(LogoutModalComponent, { centered: true });
    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.userService.clearUser();
          localStorage.removeItem('token');
          this.router.navigate(['/home']);
        }
      })
      .catch(() => {});
  }
}
