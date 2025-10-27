import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebHeaderComponent } from '../web-header/web-header.component';
import { WebFooterComponent } from '../web-footer/web-footer.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
declare var bootstrap: any;
interface Envelope {
  top: number;
  left: number;
  color: string;
  isDragging?: boolean;
  offsetX?: number;
  offsetY?: number;
}
@Component({
  selector: 'app-enroll-now',
  standalone: true,
  imports: [WebHeaderComponent, WebFooterComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './enroll-now.component.html',
  styleUrls: ['./enroll-now.component.scss']
})
export class EnrollNowComponent {
  userForm!: FormGroup;
  showUserModal = false;
  isLoading = false;
  constructor(private fb: FormBuilder, private service: UserService, private router: Router) { }

  envelopes: Envelope[] = [
    { top: 20, left: 120, color: '#00aaff' },
    { top: 50, left: 400, color: '#00c6ff' },
    { top: 150, left: 200, color: '#0099ff' },
    { top: 220, left: 480, color: '#00ff99' },
    { top: 300, left: 100, color: '#ff9900' },
  ];

  selectedEnvelope: Envelope | null = null;


  onMouseMove = (event: MouseEvent) => {
    if (!this.selectedEnvelope) return;
    const env = this.selectedEnvelope;

    env.left = event.clientX - (env.offsetX || 0);
    env.top = event.clientY - (env.offsetY || 0);

    // keep inside container
    env.left = Math.max(0, Math.min(env.left, 300 - 60));
    env.top = Math.max(0, Math.min(env.top, 200 - 40));
  };

  offsetX = 0;
  offsetY = 0;
  startDrag(event: MouseEvent, env: any) {
    this.selectedEnvelope = env;
    const envelopeEl = event.target as HTMLElement;

    envelopeEl.classList.add('dragging');

    // Get container position
    const container = envelopeEl.parentElement!;
    const containerRect = container.getBoundingClientRect();

    // Calculate offset within envelope
    const rect = envelopeEl.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    const onMouseMove = (e: MouseEvent) => {
      // Mouse relative to container
      let left = e.clientX - containerRect.left - this.offsetX;
      let top = e.clientY - containerRect.top - this.offsetY;

      // Optional: limit drag within container bounds
      left = Math.max(0, Math.min(left, container.clientWidth - rect.width));
      top = Math.max(0, Math.min(top, container.clientHeight - rect.height));

      envelopeEl.style.left = left + 'px';
      envelopeEl.style.top = top + 'px';
    };

    const onMouseUp = () => {
      envelopeEl.classList.remove('dragging');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      this.selectedEnvelope = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  onMouseUp = () => {
    if (this.selectedEnvelope) {
      this.selectedEnvelope.isDragging = false;

      // Remove dragging class
      const allEnvelopes = document.querySelectorAll('.envelope');
      allEnvelopes.forEach(env => env.classList.remove('dragging'));
    }
    this.selectedEnvelope = null;

    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };


  features = [
    {
      icon: 'bi bi-speedometer2',
      title: 'High-Speed Delivery',
      description: 'Send thousands of emails in seconds with zero throttling limits.'
    },
    {
      icon: 'bi bi-shield-lock',
      title: 'Data Privacy',
      description: 'Your data is fully encrypted with GDPR-compliant privacy standards.'
    },
    {
      icon: 'bi bi-bar-chart-line',
      title: 'Detailed Analytics',
      description: 'Track delivery rates, opens, and engagement in real time.'
    }
  ];

  steps = [
    { title: 'Sign Up for Free', description: 'Create your MailCept account in seconds — no payment required.' },
    { title: 'Activate Your Trial', description: 'Instantly access all premium tools for 14 days — unlimited sending.' },
    { title: 'Launch Your First Campaign', description: 'Design, automate, and track results in real time with ease.' },
    { title: 'Scale Effortlessly', description: 'Grow with analytics, segmentation, and smart delivery optimization.' },
  ];

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\d][\w.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  startFreeTrial() {
    this.showUserModal = true;
  }

  closeModal() {
    this.showUserModal = false;
    this.userForm.reset();
  }
  closeOnBackdrop(event: MouseEvent) {
    this.userForm.reset();
    this.showUserModal = false;
  }
  onUserSubmit() {
    // console.log('🚀 Submit triggered');

    if (this.userForm.invalid) {
      console.warn('Form Invalid:', this.userForm.value);
      this.userForm.markAllAsTouched();
      return;
    }

    const payload = this.userForm.value;
    this.isLoading = true;

    this.service.registerTrial(payload).subscribe({
     next: (res: any) => {
  this.isLoading = false;
  Swal.fire({
    title: `🚀 You're all set, ${payload.name}!`,
    text: 'Your free trial is now active — start exploring MailCept and experience powerful email automation today!',
    icon: 'success',
    confirmButtonColor: '#00457c',
    confirmButtonText: 'Go to Dashboard'
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['auth/login']);
    }
  });

  this.closeModal();
  this.userForm.reset();
},


      error: (err: any) => {
        this.isLoading = false;
        console.error('❌ API Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err?.error?.message || 'Please try again later.',
        });
      }
    });
  }
}

