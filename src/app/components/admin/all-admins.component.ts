import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../pipes/search.pipe';
import { Router } from '@angular/router';
@Component({
  selector: 'app-all-admins',
  imports: [CommonModule, FormsModule, SearchPipe],
  templateUrl: './all-admins.component.html',
  styleUrl: './all-admins.component.scss'
})
export class AllAdminsComponent {
  users: any[] = [];
  paginatedAdmins: any = [];
  searchText: any = '';
  selectedUser: any = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isEditMode: boolean;
  showPassword = false;
  selectedAdmin: any;
  constructor(private userService: UserService , private router: Router) {

  }
  ngOnInit(): void {
    this.getData();
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  getData() {
    this.userService.getAdminWithUsers().subscribe((res: any) => {
      this.users = res?.admins || [];
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.updatePaginatedUsers();
    });
  }
  updatePaginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAdmins = this.users.slice(start, end);
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
  toggleAdminStatus(user: any): void {
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


  editUser(admins: any) {
    this.selectedAdmin = { ...admins };
    console.log("data1", this.selectedUser)
    this.isEditMode = true;
  }

goToAllUsers(adminId: number) {
  this.router.navigate(['user/all-user'], { queryParams: { adminId } });
}

  openEditPopup(admins: any) {
    this.selectedAdmin = { ...admins };
    this.isEditMode = true;
  }

  updateAdmin() {
    const adminId = localStorage.getItem('userId');
    this.selectedAdmin.adminId = adminId || null
    this.userService.updateUser(this.selectedAdmin).subscribe((res: any) => {
      this.getData();
      this.isEditMode = false;
      this.userService.showToast('success', res.message);

    });
  }

}

