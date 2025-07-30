import { Component } from '@angular/core';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { UserService } from '../../../shared/services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
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


    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.profileForm = this.fb.group({
            userName: ['', Validators.required]
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
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file && file.size < 5 * 1024 * 1024) {
            this.selectedImage = file;

            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Image should be <5MB and of type jpg/png.');
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
            const userToStore = {
                userId: updatedUser.userId,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profilePicture  
            };

            this.userService.setUser(userToStore);
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

