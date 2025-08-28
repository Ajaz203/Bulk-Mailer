import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-add-subscription',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss'
})
export class AddSubscriptionComponent {
      subscriptionForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService 
    ,private titleService: Title
  ) {
    this.titleService.setTitle('MailCept-Add Subscription');
  }

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
    this.userService.plans(payload).subscribe({
      next: (res: any) => {
        const message = res?.message || 'Plan created successfully';
        this.toastr.success(message, 'SUCCESS'); 
        this.subscriptionForm.reset();
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Failed to create plan';
        this.toastr.error(errorMessage, 'ERROR'); 
      }
    });
  } else {
    this.toastr.warning('Please fill out all required fields', 'WARNING'); 
  }
}




  onCancel(): void {
    this.subscriptionForm.reset();
  }
}
