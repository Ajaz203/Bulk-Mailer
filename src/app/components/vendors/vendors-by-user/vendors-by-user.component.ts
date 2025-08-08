import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
declare var bootstrap: any;


@Component({
  selector: 'app-vendors-by-user',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vendors-by-user.component.html',
  styleUrl: './vendors-by-user.component.scss'
})
export class VendorsByUserComponent implements OnInit {
    userVendorList: any[] = [];
  searchTermUser = '';
  isLoading = false;

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.fetchUsersWithVendorMapping();
    this.service.refreshTable$.subscribe(() => this.fetchUsersWithVendorMapping());
  }

 fetchUsersWithVendorMapping(): void {
  this.isLoading = true;
  this.service.getUsersWithVendors({}).subscribe({
    next: (users) => {
      this.userVendorList = Array.isArray(users) ? users : [];

      // Fetch vendor counts for each user
      this.userVendorList.forEach(user => {
        this.service.getVendorsByUser(user.userId).subscribe(vendors => {
          user.vendors = vendors; // so HTML's user.vendors?.length works
        });
      });

      this.isLoading = false;
    },
    error: (err) => {
      console.error('Failed to fetch users:', err);
      this.isLoading = false;
    }
  });
}


  // If you want client-side filtered list:
  get filteredUserList() {
    const term = (this.searchTermUser || '').toLowerCase();
    if (!term) return this.userVendorList;
    return this.userVendorList.filter(u =>
      (u.name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term)
    );
  }
}