import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FeatherIconsComponent } from '../../shared/components/ui/feather-icons/feather-icons.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.prod';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ ReactiveFormsModule, FormsModule,CommonModule, RouterLink]
})
export class LoginComponent {

 public show: boolean = true;
  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, public router: Router, public userService: UserService) {
    const userData = localStorage.getItem('user');
    if (userData?.length != null) {
      router.navigate(['/dashboard'])
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  ngOnInit() { }
  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
  showPassword() {
    this.show = !this.show;
  }

login(button: HTMLButtonElement): void {
  if (this.loginForm.invalid) return;

  const originalText = button.innerHTML;
  button.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Signing in...
  `;
  button.disabled = true;

  const { email, password } = this.loginForm.value;

  this.userService.login({ email, password }).subscribe({
    next: (res: any) => {
      const { userId, name, email, role } = res.user;
      const message = res?.message || 'Login successful!';

      this.userService.getUserProfileUpdate(userId).subscribe({
        next: (profile: any) => {
          const profileImage = (profile.profilePicture || '').replace(/\\/g, '/');
          const user = { userId, name, email, role, profileImage };

          localStorage.setItem('user', JSON.stringify(user));
          this.userService.setUser(user);
          this.userService.broadcastUser(user);

          // ✅ Backend success message
          this.userService.showToast('success', message);

          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          const errorMsg = err?.error?.message || 'Failed to load user profile.';
          this.userService.showToast('error', errorMsg);
        },
        complete: () => {
          button.innerHTML = originalText;
          button.disabled = false;
        }
      });
    },
    error: (err: any) => {
      // ✅ Skip showing duplicate toast if interceptor already handled 401
      if (err?.handled) {
        button.innerHTML = originalText;
        button.disabled = false;
        return;
      }

      const errorMsg =
        err?.error?.message ||
        err?.message ||
        'Invalid login credentials. Please try again.';

      this.userService.showToast('error', errorMsg);
      button.innerHTML = originalText;
      button.disabled = false;
    }
  });
}

forgotPassword(){
  this.router.navigate(['/forgot-password']);
}
}
