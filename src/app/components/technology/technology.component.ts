import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-technology',
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent {
isDarkMode = document.body.classList.contains('dark-only');
constructor(private service: UserService, private dialog: MatDialog) { }
  name: string = '';
  getDataArr: any = [];
  categoryName = '';
  isEditMode = false;
  editId: number | null = null;
  categoryList: any[] = [];
  showForm = false;

  newCategory = {
    name: ''
  };
  showEditForm = false;
selectedCategory: any = {
  id: null,
  name: ''
};
  ngOnInit() {
    this.getData();
  }


  getData() {
    this.service.getCategory().subscribe((resp: any) => {
      // console.log("Get category data:", resp);
      this.getDataArr = resp;
    });
  }



submitForm() {
  const payload = { name: this.newCategory.name };
  this.service.addCategory(payload).subscribe({
    next: () => {
      Swal.fire('Success', 'Category added successfully!', 'success');
      this.getData();
      this.newCategory.name = '';
      this.showForm = false;
    },
    error: () => {
      Swal.fire('Error', 'Failed to add category', 'error');
    }
  });
}

  editCategory(item: any) {
  this.selectedCategory = { ...item };
  this.showEditForm = true;
}

updateCategory() {
  const payload = { name: this.selectedCategory.name };
  this.service.updateCategory(this.selectedCategory.id, payload).subscribe({
    next: () => {
      Swal.fire('Updated', 'Category updated successfully!', 'success');
      this.getData();
      this.closeEditForm();
    },
    error: () => {
      Swal.fire('Error', 'Failed to update category', 'error');
    }
  });
}
closeEditForm() {
  this.showEditForm = false;
  this.selectedCategory = { id: null, name: '' };
}

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteCategory(id).subscribe(() => {
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          this.getData();
        });
      }
    });
  }
}

