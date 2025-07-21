import { Component } from '@angular/core';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.scss',
  imports: [DropzoneModule, FormsModule, ReactiveFormsModule]
})

export class AddNewUserComponent {
  submittedEmails: Set<string> = new Set();
  showPassword: boolean = false;
  userForm: FormGroup
  public config: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    addRemoveLinks: true,
    acceptedFiles: 'image/*'
  };

  public text = '<i class="icon-cloud-up"></i><h6>Drop files here or click to upload.</h6><span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span>';
  isLoading: boolean = false;
  constructor(public service: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
        ],
      ],
    });
  }
  ngOnInit(): void {

  }
  onUploadError(args: any): void { }

  onUploadSuccess(args: any): void { }
  markAllFieldsTouched() {
    Object.values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  showValidationErrors() {
    const controls = this.userForm.controls;

    if (controls['name'].invalid) {
      this.service.showToast('error', 'Please fill name');
    }
    if (controls['email'].invalid) {
      if (controls['email'].errors?.['required']) {
        this.service.showToast('error', 'Please enter email');
      } else if (controls['email'].errors?.['email']) {
        this.service.showToast('error', 'Please enter a valid email address');
      }
    }
    if (controls['password'].invalid) {
      if (controls['password'].errors?.['required']) {
        this.service.showToast('error', 'Password is required');
      } else if (controls['password'].errors?.['minlength']) {
        this.service.showToast('error', 'Password must be at least 6 characters');
      } else if (controls['password'].errors?.['pattern']) {
        this.service.showToast('error', 'Password must contain upper & lowercase letters, a number, and a special character');
      }
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.markAllFieldsTouched();
      this.showValidationErrors();
      return;
    }

    const email = this.userForm.value.email.toLowerCase();

    if (this.submittedEmails.has(email)) {
      this.service.showToast('error', 'This email is already registered. Please use a different one.');
      return;
    }

    this.isLoading = true;

    this.service.addUsers(this.userForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.submittedEmails.add(email);
        this.service.showToast('success', res.message);
        this.userForm.reset();
      },
      error: (err: any) => {
        this.isLoading = false;
        const errorMsg = err?.error?.message?.toLowerCase().includes('email')
          ? 'Email already registered'
          : 'Something went wrong';
        this.service.showToast('error', errorMsg);
      }
    });
  }

  cancel(): void {
    this.userForm.reset();
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

}
