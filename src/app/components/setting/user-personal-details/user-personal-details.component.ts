import { Component } from '@angular/core';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { UserService } from '../../../shared/services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
    selector: 'app-user-personal-details',
    templateUrl: './user-personal-details.component.html',
    styleUrl: './user-personal-details.component.scss',
    imports: [FeatherIconsComponent, FormsModule, ReactiveFormsModule, CommonModule]
})
export class UserPersonalDetailsComponent {
    profileForm!: FormGroup;
    selectedImage: File | null = null;
    previewUrl: string | ArrayBuffer | null = null;
    userId = Number(localStorage.getItem('userId'));
imageChangedEvent: any = '';
croppedFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.profileForm = this.fb.group({
            userName: ['']
        });

        this.loadUserProfile();
        const user = JSON.parse(localStorage.getItem('user') || '{}');

    }

    loadUserProfile() {
        this.userService.getUserProfileUpdate(this.userId).subscribe((res: any) => {
            const user = res?.data;
            this.profileForm.patchValue({
                userName: user?.userName || ''
            });

            if (user?.profileImage) {
                this.previewUrl = user.profileImage;
            }
        });
    }

   onFileSelected(event: Event) {
  this.imageChangedEvent = event;
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('cropperModal')
  );
  modal.show();
}


    removeImage() {
        this.selectedImage = null;
        this.previewUrl = null;
    }

submitForm() {
  if (!this.profileForm.valid) return;

  const formData = new FormData();
  formData.append('userName', this.profileForm.get('userName')?.value);
  formData.append('userId', this.userId.toString());

  if (this.selectedImage) {
    formData.append('profilePicture', this.selectedImage);
  }

  this.userService.uploadProfileWithImage(formData).subscribe({
    next: (res: any) => {
      const updatedUser = res.user;
      const userToStore = {
        userId: updatedUser.userId,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profilePicture 
      };

      this.userService.setUser(userToStore);
      this.userService.broadcastUser(userToStore);

      this.userService.showToast('success', 'Profile updated successfully!');
      this.loadUserProfile();
    },
    error: (err) => {
      console.error(err);
      this.userService.showToast('error', 'Update failed.');
    }
  });
}




}

