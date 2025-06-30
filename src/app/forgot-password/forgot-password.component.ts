import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  acceptTerms: boolean = false;
  loading: boolean = false;

  isOtpStep: boolean = false;
  isResetPasswordStep: boolean = false;

  constructor(
    private router: Router,
    private service: EmailService,
    private toastr: ToastrService
  ) {}

  // ✅ Toast Helper
  triggerToast(type: 'success' | 'error' | 'info' | 'warning', message: string) {
    this.toastr[type](message, type.toUpperCase(), {
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-top-right',
      progressAnimation: 'increasing'
    });
  }

  onSubmit() {
    if (!this.isOtpStep && !this.isResetPasswordStep) {
      this.sendOtp();
    } else if (this.isOtpStep && !this.isResetPasswordStep) {
      this.verifyOtp();
    } else if (this.isResetPasswordStep) {
      this.resetPassword();
    }
  }

  // 🔥 Send OTP Step
  sendOtp() {
    if (!this.email) {
      this.triggerToast('error', 'Email is required.');
      return;
    }
    if (!this.acceptTerms) {
      this.triggerToast('error', 'Please accept the terms and conditions.');
      return;
    }

    const payload = { email: this.email };
    this.loading = true;

    this.service.forgotPassword(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          this.triggerToast('success', res.message || 'OTP sent to your email.');
          this.isOtpStep = true;
        },
        error: (error) => {
          this.triggerToast('error', error.error.message || 'Failed to send OTP.');
        }
      });
  }

  // 🔥 Verify OTP Step
  verifyOtp() {
    if (!this.otp) {
      this.triggerToast('error', 'Please enter the OTP.');
      return;
    }

    const payload = { email: this.email, otp: this.otp };
    this.loading = true;

    this.service.verifyOtp(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          this.triggerToast('success', res.message || 'OTP verified successfully!');
          this.isOtpStep = false;
          this.isResetPasswordStep = true;
        },
        error: (error) => {
          this.triggerToast('error', error.error.message || 'Invalid OTP.');
        }
      });
  }

  // 🔥 Reset Password Step
  resetPassword() {
    if (!this.newPassword) {
      this.triggerToast('error', 'New password is required.');
      return;
    }

    const payload = {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword
    };

    this.loading = true;

    this.service.updatePassword(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          this.triggerToast('success', res.message || 'Password updated successfully!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          this.triggerToast('error', error.error.message || 'Failed to reset password.');
        }
      });
  }
}
