import { Component, OnInit } from '@angular/core';
import { EmailService } from '../services/bulk-email.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PopupComponent } from '../popup/popup.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-cat-table',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cat-table.component.html',
  styleUrl: './cat-table.component.css'
})
export class CatTableComponent implements OnInit {

  constructor(private service: EmailService, private dialog: MatDialog) { }
  name: string = '';
  getDataArr: any = [];

  ngOnInit() {
    this.getData();
  }


  getData() {
    this.service.getCategory().subscribe((resp: any) => {
      console.log("Get category data:", resp);
      this.getDataArr = resp;
    });
  }

 
  openModal() {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '450px',
      maxHeight: 'auto',
      disableClose: true,
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const payload = { name: result };
        this.service.addCategory(payload).subscribe(() => {
          Swal.fire('Success', 'Category added successfully!', 'success');
          this.getData();
        });
      }
    });
  }


 editCategory(item: any) {
  const dialogRef = this.dialog.open(PopupComponent, {
    width: '450px',
    disableClose: true,
    panelClass: 'custom-dialog',
    data: { name: item.name } 
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      const payload = { name: result };
      this.service.updateCategory(item.id, payload).subscribe(() => {
        Swal.fire('Updated', 'Category updated successfully!', 'success');
        this.getData();
      });
    }
  });
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
