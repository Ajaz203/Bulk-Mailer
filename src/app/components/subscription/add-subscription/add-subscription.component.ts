import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-subscription',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss'
})
export class AddSubscriptionComponent {
     subscriptionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.subscriptionForm = this.fb.group({
      planName: ['', Validators.required],
      description: ['', Validators.required],
      emailLimit: [null, [Validators.required, Validators.min(1)]],
      userLimit: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required],
    
    });
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      const formData = this.subscriptionForm.value;
      console.log('Submitting Subscription Plan:', formData);
      // TODO: call your API with formData
    }
  }

  onCancel(): void {
    this.subscriptionForm.reset();
  }
}
