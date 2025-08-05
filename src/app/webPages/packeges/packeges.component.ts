// Updated PackegesComponent with real Razorpay subscription flow
import { Component, OnInit } from '@angular/core';
import { WebHeaderComponent } from "../web-header/web-header.component";
import { EmailService } from '../../services/bulk-email.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebfooterComponent } from '../webfooter/webfooter.component';
declare var Razorpay: any;

@Component({
  selector: 'app-packeges',
  standalone: true,
  imports: [WebHeaderComponent, CommonModule, FormsModule, ReactiveFormsModule, WebfooterComponent],
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
    this.showUserModal = false;
    this.createRazorpayOrder(userData, this.selectedPlan);
  }

  createRazorpayOrder(user: any, plan: any) {
    this.service.createSubscriptionOrder({ planId: plan.id }).subscribe((res: any) => {
      if (res?.orderId) {
        this.launchRazorpay(user, plan, res.orderId, res.amount, res.currency);
      }
    }, err => {
      alert('Failed to create order');
    });
  }

  launchRazorpay(user: any, plan: any, orderId: string, amount: number, currency: string) {
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with real key in prod
      amount,
      currency,
      name: 'Mailcept',
      description: `Subscription: ${plan.name}`,
      order_id: orderId,
      prefill: {
        name: user.name,
        email: user.email
      },
      theme: {
        color: '#5ab745'
      },
      handler: (response: any) => {
        this.verifyPayment(response, plan);
      },
      modal: {
        ondismiss: () => console.log('Modal dismissed')
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  verifyPayment(response: any, plan: any) {
    const payload = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      planId: plan.id
    };

    this.service.verifySubscription(payload).subscribe((res: any) => {
      alert('Subscription activated successfully!');
    }, err => {
      alert('Payment verification failed');
    });
  }
}
