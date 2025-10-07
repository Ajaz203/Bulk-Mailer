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
export class UserPersonalDetailsComponent implements OnInit, OnDestroy{
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

    this.loadUserProfile();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
 this.signatureEditor = new Editor();
  this.getUserSignature();
  }
  ngOnDestroy() {
    this.signatureEditor.destroy();
  }
  loadUserProfile() {
    this.userService.getUserProfileUpdate(this.userId).subscribe((res: any) => {
      const user = res?.data;
      this.profileForm.patchValue({
        userName: user?.userName || '',
       
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

saveSignature() {
  const signatureValue = this.profileForm.get('signature')?.value;
  console.log('Signature Value:', signatureValue);

  if (!signatureValue) {
    this.userService.showToast('error', 'Please enter your signature before saving.');
    return;
  }

  const payload = { userId: this.userId, signature: signatureValue };
  console.log('Payload:', payload); // ✅ check in console

  this.userService.createSignature(payload).subscribe({
    next: (res: any) => {
      console.log('API Response:', res); // ✅ check if API hits
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

      // ✅ Save it globally
      localStorage.setItem('userSignature', fetchedSignature);

      // ✅ Show in form
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

