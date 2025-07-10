import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { EmailService } from '../services/bulk-email.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink,  ToastrModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private service: EmailService,
    private toastr: ToastrService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  triggerToast(
    action: 'success' | 'error' | 'info' | 'warning',
    message: string
  ) {
    this.toastr[action](message, action.toUpperCase(), {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right',
    });
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.triggerToast('error', 'Please fill in both email and password.');
      return;
    }

    const payload = {
      email: this.email,
      password: this.password
    };

    this.loading = true;

    this.service.loginUser(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.triggerToast('success', response.message || 'Login successful!');
          const user = {
          userId: response.user.userId,
          name: response.user.name,
          email: response.user.email
        };

  
        localStorage.setItem('loggedInUser', JSON.stringify(user));
          localStorage.setItem('userId', response.user.userId.toString());
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.user.name);
          localStorage.setItem('email', response.user.email);

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (error) => {
          this.triggerToast(
            'error',
            error?.error?.message || 'Server error or Invalid email/password.'
          );
        }
      });
  }
}
