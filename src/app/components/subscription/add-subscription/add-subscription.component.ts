import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-add-subscription',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss'
})
export class AddSubscriptionComponent {
      subscriptionForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.subscriptionForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      dailyMailLimit: [null, [Validators.required, Validators.min(1)]],
      validity: [null], // days (optional)
      maxUsers: [null], // optional (null = unlimited)
      isCustom: [false]
    });
  }

onSubmit(): void {
  if (this.subscriptionForm.valid) {
    const payload = this.subscriptionForm.value;
    console.log('Submitting subscription plan:', payload);

    this.userService.plans(payload).subscribe({
      next: (res) => {
        console.log('Plan created successfully', res);
      },
      error: (err) => {
        console.error('Failed to create plan', err);

      }
    });
  }
}


  onCancel(): void {
    this.subscriptionForm.reset();
  }
}
