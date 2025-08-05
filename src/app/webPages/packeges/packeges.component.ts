import { Component, OnInit } from '@angular/core';
import { WebHeaderComponent } from "../web-header/web-header.component";
import { EmailService } from '../../services/bulk-email.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-packeges',
  standalone: true,
  imports: [WebHeaderComponent,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './packeges.component.html',
  styleUrls: ['./packeges.component.css']
})
export class PackegesComponent implements OnInit {
  plans: any[] = [];
  selectedPlan: any;
  showUserModal = false;
  userForm: FormGroup;

  constructor(private service: EmailService, private fb: FormBuilder) {
       this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 ngOnInit(): void {
  this.service.getPlans({}).subscribe((res: any) => {
    if (res?.plans) {
      this.plans = res.plans.filter((p: any) => p.isActive);
    }
  });
}
  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.showUserModal = true;
  }

  onUserSubmit() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;
    console.log('User:', userData);
    console.log('Selected Plan:', this.selectedPlan);

    this.showUserModal = false;

    // ✅ TODO: Call your payment gateway here (Stripe, Razorpay, etc.)
    this.openPaymentGateway(userData, this.selectedPlan);
  }

  openPaymentGateway(user: any, plan: any) {
    // Example placeholder: Replace with your gateway integration
    alert(`Redirecting ${user.name} to payment for $${plan.price}`);
    
    // Example: Navigate to payment route
    // this.router.navigate(['/payment'], { queryParams: { plan: plan.name, price: plan.price } });
  }
}

