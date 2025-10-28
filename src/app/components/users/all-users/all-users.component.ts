import { Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../pipes/search.pipe';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-users',
  standalone: true,
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
  imports: [CommonModule, FormsModule, SearchPipe]
})
export class AllUsersComponent {

  users: any[] = [];
  paginatedUsers: any = [];
  searchText: any = '';
  selectedUser: any = null;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  isEditMode: boolean;
  showPassword = false;
 subscriptions: any[] = [];
selectedUserForPlan: any = null;
selectedPlan: any = null;

  constructor(private userService: UserService, private route: ActivatedRoute, private titleService: Title) {
    this.titleService.setTitle('MailCept-Users');
  }


    isDarkMode = document.body.classList.contains('dark-only'); 
  // ngOnInit(): void {
  //   this.route.queryParams.subscribe(params => {
  //     const adminId = +params['adminId'];
  //     if (adminId) {
  //       this.getData(adminId);
  //     } else {
  //       const fallbackAdminId = Number(localStorage.getItem('userId'));
  //       this.getData(fallbackAdminId);
  //     }
  //   });
  // }

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    const role = loggedInUser.role;
    const adminId = +params['adminId']; 

    if (role === 'superadmin' && adminId) {
      this.getData(adminId);
    } else if (role === 'superadmin') {
    
      this.getSuperAdminUsers();
    } else {
      const fallbackAdminId = adminId || +(localStorage.getItem('userId') ?? 0);
      this.getData(fallbackAdminId);
    }
  });
  this.getAllPlans();
}
getSuperAdminUsers() {
  this.userService.superAdminAllUsers({}).subscribe(
    (res: any) => {
   this.users = (res?.users || []).map((u: { plans: any[]; }) => {
  // Find the active plan (or the latest plan)
  const activePlan = u.plans?.find(p => p.isActive === 1);

  return {
    ...u,
    subscriptionId: activePlan?.planId || '',   // binds to dropdown
    currentPlanName: activePlan?.planName || '', // display below dropdown
    validityDays: activePlan?.durationMonths ? activePlan.durationMonths * 30 : 30 // optional
  };
});
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.updatePaginatedUsers();
    },
    error => console.error('Error fetching superadmin users', error)
  );
}



  //  getSuperAdminUsers() {
  //   this.userService.superAdminAllUsers({}).subscribe(
  //     (res: any) => {
  //       this.users = res?.users || [];
  //       this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
  //       this.updatePaginatedUsers();
  //     },
  //     error => {
  //       console.error('Error fetching superadmin users', error);
  //     }
  //   );
  // }
//  getAllPlans() {
//     this.userService.plans({}).subscribe({
//       next: (res: any) => {
//         this.subscriptions = res?.plans?.filter((p: any) => p.isActive) || [];
//       },
//       error: (err) => {
//         console.error('Error fetching plans:', err);
//       }
//     });
//   }


getAllPlans() {
  this.userService.getPlans().subscribe({
    next: (res: any) => {
      this.subscriptions = res?.plans?.filter((p: any) => p.isActive) || [];
    },
    error: (err) => {
      console.error('Error fetching plans:', err);
    }
  });
}

openPlanModal(user: any) {
  this.selectedUserForPlan = user;
   this.selectedPlan = this.subscriptions.find(p => p.id === user.subscriptionId) || null;
}

closePlanModal() {
  this.selectedUserForPlan = null;
  this.selectedPlan = null;
}

assignPlan(plan: any) {
  if (!this.selectedUserForPlan) return;

  const payload = {
    userId: this.selectedUserForPlan.userId,
    planId: plan.id,
    validity: plan.validity
  };

  this.userService.assignSubscription(payload).subscribe({
    next: () => {
      Swal.fire('Success', `Plan "${plan.name}" assigned successfully!`, 'success');

      // Update the user object so modal shows current plan immediately
      this.selectedUserForPlan.currentPlanName = plan.name;
      this.selectedUserForPlan.subscriptionId = plan.id;  // <--- important

      // Close the modal
      this.closePlanModal();
    },
    error: (err) => Swal.fire('Error', err?.error?.message || 'Failed to assign subscription', 'error')
  });
}


selectPlan(plan: any) {
  this.selectedPlan = plan;
}




  getInitials(name: string): string {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  }



  getAdminUsers(adminId: number) {
    this.userService.getAdminUsers({ adminId }).subscribe(
      (res: any) => {
        this.users = res?.users || [];
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  getData(adminId: number) {
    this.userService.getAdminUsers({ adminId }).subscribe(
      (res: any) => {
        this.users = res?.users || [];
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }




  updatePaginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  trackByFn(index: number, item: any) {
    return item.userId || index;
  }
  toggleActive(user: any): void {
    const newStatus = !user.isActive;

    this.userService.isActiveToggles({
      userId: user.userId,
      isActive: newStatus
    }).subscribe({
      next: (res: any) => {
        user.isActive = newStatus;

        if (newStatus) {
          this.userService.showToast('success', res.message || 'Account activated');
        } else {
          this.userService.showToast('success', res.message || 'Account deactivated');
        }
      },
      error: () => {
        this.userService.showToast('error', 'Failed to update status');
      }
    });
  }


  editUser(user: any) {
    this.selectedUser = { ...user };
    console.log("data1", this.selectedUser)
    this.isEditMode = true;
  }



  openEditPopup(user: any) {
    this.selectedUser = { ...user };
    this.isEditMode = true;
  }

updateUser() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'superadmin';

  // Preserve existing adminId unless superadmin changes it manually
  if (!isSuperAdmin) {
    const adminId = Number(localStorage.getItem('userId'));
    this.selectedUser.adminId = adminId || null;
  }

  this.userService.updateUser(this.selectedUser).subscribe({
    next: (res: any) => {
      this.isEditMode = false;
      this.userService.showToast('success', res.message);
      if (res.user?.userId === loggedInUser.userId) {
        this.userService.broadcastUser(res.user);
      }
      if (isSuperAdmin) {
        this.getSuperAdminUsers();
      } else {
        const adminId = Number(localStorage.getItem('userId'));
        this.getData(adminId);
      }
    },
    error: () => this.userService.showToast('error', 'Update failed')
  });
}


}
