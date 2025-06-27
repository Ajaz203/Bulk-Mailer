import { Component, OnInit } from '@angular/core';
import { EmailService } from '../services/bulk-email.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PopupComponent } from '../popup/popup.component';
@Component({
  standalone: true,
  selector: 'app-cat-table',
  imports: [CommonModule, MatDialogModule,
    MatButtonModule,],
  templateUrl: './cat-table.component.html',
  styleUrl: './cat-table.component.css'
})
export class CatTableComponent implements OnInit {
  constructor(private service: EmailService, private dialog: MatDialog) { }
  getDataArr: any = [];
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getCategory().subscribe((resp: any) => {
      console.log("get category data is", resp);
      this.getDataArr = resp;
    })
  }

  openModal() {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '450px',
  maxHeight: 'auto', // No vertical scrollbar triggered from this
  disableClose: true,
  panelClass: 'custom-dialog'  
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('User input:', result);
        let payload={
         "name":result
        }
        this.service.addCategory(payload).subscribe((resp:any)=>{
          this.getData();
        })
      }
    });
  }
}
