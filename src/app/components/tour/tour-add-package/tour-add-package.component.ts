import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-tour-add-package',
    templateUrl: './tour-add-package.component.html',
    styleUrl: './tour-add-package.component.scss',
    imports: [CommonModule,FormsModule,ReactiveFormsModule]
})

export class TourAddPackageComponent implements OnInit {

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
