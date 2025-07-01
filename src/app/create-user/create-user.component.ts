import { Component } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { EmailService } from '../services/bulk-email.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  name: string = '';
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


  triggerToast(type: 'success' | 'error' | 'info' | 'warning', message: string) {
    this.toastr[type](message, type.toUpperCase(), {
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-top-right',
      progressAnimation: 'increasing'
    });
  }

 
  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.triggerToast('error', 'Please fill all fields.');
      return;
    }

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.loading = true;

    this.service.UserRegister(payload)
      .pipe(finalize(() => this.loading = false)) 
      .subscribe({
        next: (response: { message?: string }) => {
          this.triggerToast('success', response.message || 'Registration successful!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          this.triggerToast('error', error.error.message || 'Registration failed. Please try again.');
        }
      });
  }
}
