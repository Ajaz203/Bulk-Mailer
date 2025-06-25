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
    technology: ''
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
    form.resetForm(); 

    // Reset form model
    this.candidate = {
      name: '',
      email: '',
      contact_no: '',
      alt_contact_no: '',
      technology: ''
    };

    // Reset skills array and input
    this.skills = [];
    this.skill = '';
  } else {
    console.error('Form is undefined!');
  }
}


  // save(data: any) {
  //   this.sevice.createSingleReq(this.candidate).subscribe((resp: any) => {
  //     this.sevice.triggerTableReload();
  //     console.log("resp of single creation")
  //     this.reset(data);

  //   })
   
  // }


save(data: any) {
  this.candidate.skills = this.skills;  

  this.sevice.createSingleReq(this.candidate).subscribe((resp: any) => {
    console.log("Response of single creation", resp);
    this.sevice.triggerTableReload();
    this.reset(data);
  });
}


   skill: string = '';
  skills: string[] = [];

  addSkill() {
    const trimmedSkill = this.skill.trim();
    if (trimmedSkill && !this.skills.includes(trimmedSkill)) {
      this.skills.push(trimmedSkill);
      this.skill = '';
    }
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }
}
