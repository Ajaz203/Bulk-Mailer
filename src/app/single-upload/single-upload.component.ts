import { Component, ViewChild,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/bulk-email.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-single-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-upload.component.html',
  styleUrls: ['./single-upload.component.css']
})
export class SingleUploadComponent implements OnInit {
  constructor(private sevice: EmailService) { }
  @ViewChild('manualForm') manualForm!: NgForm;
  candidate: any = {
    name: '',
    email: '',
    contact_no: '',
    alt_contact_no: '',
    category: ''
  };
  dropDownArr:any=[]
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.sevice.getCategory().subscribe((resp: any) => {
      console.log("getCategory category data is", resp);
      this.dropDownArr = resp;
    })
  }
  

reset(form: NgForm) {
    if (form) {
      form.resetForm(); // ✅ Correct method for NgForm
      this.candidate = {
        name: '',
        email: '',
        contact_no: '',
        alt_contact_no: '',
        category: ''
      };
    } else {
      console.error('Form is undefined!');
    }
  }

  save(data: any) {
    this.sevice.createSingleReq(this.candidate).subscribe((resp: any) => {
      this.sevice.triggerTableReload();
      console.log("resp of single creation")
      this.reset(data);

    })
    // Send to API if needed
  }
}
