import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  dailyMailLimit: number;
  validity: number | null;
  maxUsers: number;
  isCustom: boolean;
}

@Component({
  selector: 'app-all-subscription',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './all-subscription.component.html',
  styleUrl: './all-subscription.component.scss',
})
export class AllSubscriptionComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  planToDelete: SubscriptionPlan | null = null;
  isDeleteConfirmModalOpen = false;
  editPlanForm: FormGroup;
  isEditModalOpen = false;
  selectedPlan: any;
  editingPlanId!: string;

  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) { }
  isDarkMode = document.body.classList.contains('dark-only'); 
  ngOnInit(): void {
    this.loadPlans();
    this.editPlanForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      dailyMailLimit: [0, Validators.required],
      validity: [null],
      maxUsers: [0],
      isCustom: [false]
    });
  }

  loadPlans(): void {
    this.userService.getPlans().subscribe({
      next: (res: any) => {
        this.plans = res?.plans || [];
      },
      error: (err) => {
        console.error('Failed to fetch plans', err);
      },
    });
  }


  deletePlan(plan: SubscriptionPlan): void {
    const confirmDelete = confirm(`Are you sure you want to delete ${plan.name}?`);
    if (confirmDelete) {
      this.userService.deletePlan(plan.id.toString()).subscribe({
        next: () => {
          this.plans = this.plans.filter((p) => p.id !== plan.id);
        },
        error: (err) => {
          console.error('Failed to delete plan', err);
        },
      });
    }
  }

  openDeleteModal(plan: SubscriptionPlan): void {
    this.planToDelete = plan;
    this.isDeleteConfirmModalOpen = true;
  }

  confirmDelete(): void {
    const planId = this.planToDelete?.id;

    if (!planId) {
      console.error('Plan ID is undefined');
      return;
    }

    this.userService.deletePlan(planId.toString()).subscribe({
      next: () => {
        this.plans = this.plans.filter((p) => p.id !== planId);
        this.closeDeleteModal();
        this.userService.showToast('success', 'Plan deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete plan', err);
        this.userService.showToast('error', 'Failed to delete plan');
      }
    });
  }



  closeDeleteModal(): void {
    this.isDeleteConfirmModalOpen = false;
    this.planToDelete = null;
  }
  editPlan(plan: any) {
  this.selectedPlan = plan;
  this.editingPlanId = plan.id.toString(); 
  this.editPlanForm.patchValue(plan);
  this.isEditModalOpen = true;
}


  closeEditModal() {
    this.isEditModalOpen = false;
  }
  submitEditPlan() {
    if (this.editPlanForm.valid && this.editingPlanId) {
      const updatedData = this.editPlanForm.value;

      this.userService.updatePlan(this.editingPlanId, updatedData).subscribe({
        next: (res) => {
          console.log('Plan updated successfully:', res);
          this.isEditModalOpen = false;
          this.loadPlans();
        },
        error: (err) => {
          console.error('Error updating plan:', err);
        }
      });
    }
  }

}
