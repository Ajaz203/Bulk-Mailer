import { Component } from '@angular/core';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  constructor(public service: UserService) {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')
      ])
    });
  }
  ngOnInit(): void {

  }
  onUploadError(args: any): void { }

  onUploadSuccess(args: any): void { }
  onSubmit() {
    if (this.userForm.invalid) return;

    const email = this.userForm.value.email?.toLowerCase();

    if (this.submittedEmails.has(email)) {
      this.service.showToast(
        'error',
        'This email is already registered. Please use a different one.'
      );
      return;
    }

    this.isLoading = true;

    this.service.addUsers(this.userForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.submittedEmails.add(email); 
        this.service.showToast(
          'success',
          res.message || 'User added successfully'
        );
        this.userForm.reset();
      },
      error: (err: any) => {
        this.isLoading = false;

        const errorMsg =
          err?.error?.message?.toLowerCase().includes('email')
            ? 'Something Went Wrong'
            : 'Email already registered';

        this.service.showToast('error', errorMsg);
      },
    });
  }
  cancel(): void {
  this.userForm.reset();
}


togglePassword(): void {
  this.showPassword = !this.showPassword;
}

}
