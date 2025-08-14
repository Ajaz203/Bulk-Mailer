import { Component, OnInit } from '@angular/core';
import { WebHeaderComponent } from "../web-header/web-header.component";
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

import { WebFooterComponent } from '../web-footer/web-footer.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
declare var Razorpay: any;

@Component({
  selector: 'app-web-packages',
    imports: [WebHeaderComponent, CommonModule, FormsModule, ReactiveFormsModule, WebFooterComponent,ConfirmationPopupComponent],

  templateUrl: './web-packages.component.html',
  styleUrl: './web-packages.component.scss'
})
export class WebPackagesComponent  implements OnInit {
  plans: any[] = [];
  selectedPlan: any;
  showUserModal = false;
  userForm: FormGroup;
  showConfirmationModal: boolean = false;
  confirmedPlanName: string = '';
  popupMessage: string = '';
  popupType: 'success' | 'error' | 'info' = 'info';
  showPopup: boolean = false;
  constructor(private service: UserService, private fb:
    FormBuilder, private snackBar: MatSnackBar, private ngZone: NgZone, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  showPopupMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.popupMessage = message;
    this.popupType = type;
    this.showPopup = true;
  }

  ngOnInit(): void {
    this.service.getPlans().subscribe((res: any) => {
      if (res?.plans) {
        this.plans = res.plans.filter((p: any) => p.isActive);
      }
    });
  }
onPopupClose() {
  this.showPopup = false;
  this.router.navigate(['/login']); // redirect when popup closes
}
  selectPlan(plan: any) {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    this.selectedPlan = plan;
    this.userForm.reset();
    this.showUserModal = true;
  }
onUserSubmit(): void {
  if (this.userForm.invalid) {
    return;
  }

  const registrationData = {
    name: this.userForm.value.name.trim(),
    email: this.userForm.value.email.trim(),
    password: this.userForm.value.password
  };

  this.service.registerAdmin(registrationData).subscribe({
    next: (res: any) => {
      if (!res?.userId) {
        console.error('Registration API did not return userId', res);
        this.showPopupMessage('❌ Registration failed: No user ID returned.', 'error');
        return;
      }

      // Save locally
      localStorage.setItem('userId', res.userId.toString());
      localStorage.setItem('userName', registrationData.name);
      localStorage.setItem('userEmail', registrationData.email);

      this.showUserModal = false;
      this.userForm.reset();

      if (!this.selectedPlan?.id) {
        console.error('No plan selected before payment.');
        this.showPopupMessage('Please select a plan before proceeding.', 'error');
        return;
      }

      const razorpayPayload = {
        userId: res.userId,
        userName: registrationData.name,
        userEmail: registrationData.email,
        planId: this.selectedPlan.id
      };

      this.createRazorpayOrder(razorpayPayload);
    },
    error: (err) => {
      console.error('Error in registerAdmin:', err);
      this.showPopupMessage('❌ Registration failed. Please try again.', 'error');
    }
  });
}




  createRazorpayOrder(payload: {
    userId: number;
    userName: string;
    userEmail: string;
    planId: number;
  }) {
    this.service.createSubscriptionOrder(payload).subscribe(
      (res: any) => {

        if (!res) {
          this.showPopupMessage('❌ Order creation failed: Empty response.', 'error');
          return;
        }

        if (!res.orderId) {
          console.error('Missing order ID in response:', res);
          this.showPopupMessage('❌ Order creation failed: Missing Razorpay order ID.', 'error');
          return;
        }

        if (!res.amount) {
          console.error('Missing amount in response:', res);
          this.showPopupMessage('❌ Order creation failed: Missing Razorpay amount.', 'error');
          return;
        }

        const user = {
          userId: payload.userId,
          userName: payload.userName,
          userEmail: payload.userEmail
        };

        const plan = {
          id: payload.planId,
          name: this.selectedPlan?.name || 'Subscription Plan',
          price: res.amount / 100
        };
        const razorpayOrder = {
          id: res.orderId,
          amount: res.amount,
          currency: res.currency || 'INR'
        };

        this.launchRazorpay(user, plan, razorpayOrder);
      },
      err => {
        console.error('Error creating order:', err);
        alert('Failed to create order');
      }
    );
  }



  launchRazorpay(user: any, plan: any, order: any): void {
    const self = this;
    const options: any = {
      key: 'rzp_test_xpuVKCwj93F3DI',
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Mailcept',
      description: plan.name,
      image: 'https://yourdomain.com/logo.png',
      order_id: order.id,

      handler: function (data: any) {
        if (!data.razorpay_payment_id || !data.razorpay_order_id || !data.razorpay_signature) {
          console.error("Missing payment details:", data);
          self.ngZone.run(() => {
            self.showPopupMessage("❌ Razorpay payment verification failed. Missing data.", 'error');
          });
          return;
        }

        const verifyPayload = {
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature
        };

        self.ngZone.run(() => {
          self.verifyPayment(verifyPayload, plan);
        });
      },


      prefill: {
        name: user.userName || '',
        email: user.userEmail || '',
        contact: user.userContact || ''
      },

      notes: {
        planId: plan.id,
        adminId: user.userId
      },

      theme: {
        color: '#00457C'
      }
    };
    const razorpay = new Razorpay(options);

    razorpay.on('payment.failed', (response: any) => {
      console.error("Payment Failed:", response.error);
      this.ngZone.run(() => {
        this.showPopupMessage("❌ Payment failed: " + response.error.description, 'error');
      });
    });


    razorpay.open();
  }




  verifyPayment(response: any, plan: any) {
    const payload = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      planId: plan.id,
      userId: Number(localStorage.getItem('userId')) || 0
    };

    if (!payload.razorpay_order_id || !payload.razorpay_payment_id || !payload.razorpay_signature) {
      console.error("Invalid payload for verification:", payload);
      this.showPopupMessage('Payment verification failed: Incomplete data.', 'error');
      return;
    }

    this.service.verifySubscription(payload).subscribe(
      (res: any) => {
        this.showPopupMessage('✅ Subscription activated successfully!', 'success');
        console.log('Subscription Response:', res);
      },
      err => {
        console.error('Verification error:', err);
        this.showPopupMessage('❌ Payment verification failed.', 'error');
      }
    );

  }


}
