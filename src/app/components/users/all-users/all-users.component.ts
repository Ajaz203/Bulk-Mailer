import { Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { user } from '../../../shared/interface/user';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../pipes/search.pipe';
@Component({
  selector: 'app-all-users',
  standalone: true,
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
  imports: [ CommonModule,FormsModule,SearchPipe]
})
export class AllUsersComponent {

  users: any[] = [];
  paginatedUsers: any = [];
  searchText:any = '';
selectedUser: any = null;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isEditMode: boolean;
  constructor(private userService: UserService) {

  }
  ngOnInit(): void {
   this.getData();
  }

  getData(){
     this.userService.getUsers().subscribe((res: any) => {
      this.users = res?.user || [];
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.updatePaginatedUsers();
    });
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
  console.log("data1", this.selectedUser )
  this.isEditMode = true;        
}



openEditPopup(user: any) {
  this.selectedUser = { ...user };
  this.isEditMode = true;
}

updateUser() {
  this.userService.updateUser(this.selectedUser).subscribe((res:any) => {
    this.getData(); 
    this.isEditMode = false;
    this.userService.showToast('success', res.message);

  });
}

}
