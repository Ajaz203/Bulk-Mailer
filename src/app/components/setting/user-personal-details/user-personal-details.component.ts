import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { UserService } from '../../../shared/services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Editor, NgxEditorModule } from 'ngx-editor';
@Component({
  selector: 'app-user-personal-details',
  templateUrl: './user-personal-details.component.html',
  styleUrl: './user-personal-details.component.scss',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgxEditorModule]
})
export class UserPersonalDetailsComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  selectedImage: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userId = Number(localStorage.getItem('userId'));
  imageChangedEvent: any = '';
  croppedFile: File | null = null;
  signatureEditor!: Editor;
  userSignature: string = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      userName: [''],
      signature: ['']
    });

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.profileImage) {
      this.previewUrl = storedUser.profileImage.startsWith('http')
        ? storedUser.profileImage
        : `${this.userService.getBaseUrl()}${storedUser.profileImage}`;
    } else {
      this.previewUrl = 'assets/images/users/4.jpg';
    }


    // this.loadUserProfile();

    this.signatureEditor = new Editor();
    this.getUserSignature();
  }

  ngOnDestroy() {
    this.signatureEditor.destroy();
  }
  //  loadUserProfile() {
  //   this.userService.getUserProfileUpdate(this.userId).subscribe((res: any) => {
  //     const user = res?.data;
  //     this.profileForm.patchValue({
  //       userName: user?.userName || '',
  //     });


  //     if (user?.profileImage) {

  //       this.previewUrl = user.profileImage.startsWith('http')
  //         ? user.profileImage
  //         : `${this.userService.getBaseUrl()}${user.profileImage}`;
  //     } else {

  //       this.previewUrl = 'assets/images/users/4.jpg';
  //     }
  //   });
  // }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedImage);
    }
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

        const fullImagePath = updatedUser.profilePicture?.startsWith('http')
          ? updatedUser.profilePicture
          : `${this.userService.getBaseUrl()}${updatedUser.profilePicture}`;

        this.previewUrl = fullImagePath || 'assets/images/users/4.jpg';

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
      },
      error: (err) => {
        console.error(err);
        this.userService.showToast('error', 'Update failed.');
      }
    });
  }


  saveSignature() {
    const signatureValue = this.profileForm.get('signature')?.value;
    console.log('Signature Value:', signatureValue);

    if (!signatureValue) {
      this.userService.showToast('error', 'Please enter your signature before saving.');
      return;
    }

    const payload = { userId: this.userId, signature: signatureValue };

    this.userService.createSignature(payload).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        this.userService.showToast('success', 'Signature saved successfully!');

      },
      error: (err) => {
        console.error('Signature Save Error:', err);
        this.userService.showToast('error', 'Failed to save signature.');
      }
    });
  }

  getUserSignature() {
    const payload = { userId: this.userId };

    this.userService.getSignature(payload).subscribe({
      next: (res: any) => {
        const fetchedSignature = res?.data?.signature || '';
        this.userSignature = fetchedSignature;
        localStorage.setItem('userSignature', fetchedSignature);
        this.profileForm.patchValue({
          signature: fetchedSignature
        });
      },
      error: (err) => {
        console.error('Error fetching signature:', err);
        this.userSignature = '';
        localStorage.removeItem('userSignature');
        this.profileForm.patchValue({ signature: '' });
      }
    });
  }
}

