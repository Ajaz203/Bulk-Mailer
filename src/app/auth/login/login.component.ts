import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { StorageService } from '../../shared/services/storage.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class LoginComponent {
  public show = true;
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private storageService: StorageService
  ) {
    const userData = this.storageService.getLocal<any>('user');
    if (userData) this.router.navigate(['/dashboard']);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  showPassword() { this.show = !this.show; }

  login(button: HTMLButtonElement) {
    if (this.loginForm.invalid) return;

    const originalText = button.innerHTML;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Signing in...`;
    button.disabled = true;

    const { email, password } = this.loginForm.value;

    // Clear old data to prevent plain values
    this.storageService.removeLocal('token');
    this.storageService.removeLocal('user');

    this.userService.login({ email, password }).subscribe({
      next: (res: any) => {
        const { userId, name, email, role } = res.user;

        this.userService.getUserProfileUpdate(userId).subscribe({
          next: (profile: any) => {
            const profileImage = (profile.profilePicture || '').replace(/\\/g, '/');
            const user = { userId, name, email, role, profileImage };
            this.storageService.setLocal('user', user);
            this.storageService.setLocal('userId', userId);
            this.storageService.setLocal('token', res.token);

            this.userService.setUser(user);
            this.userService.broadcastUser(user);

            this.userService.showToast('success', res.message);
            this.router.navigate(['/dashboard']);
          },
          error: () => this.userService.showToast('error', 'Failed to load profile'),
          complete: () => { button.innerHTML = originalText; button.disabled = false; }
        });
      },
      error: () => {
        this.userService.showToast('error', 'Invalid login');
        button.innerHTML = originalText;
        button.disabled = false;
      }
    });
  }

}
