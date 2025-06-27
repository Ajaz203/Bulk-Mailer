import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/bulk-email.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-single-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-upload.component.html',
  styleUrls: ['./single-upload.component.css']
})
export class SingleUploadComponent implements OnInit {
  constructor(private sevice: EmailService, private router: Router) { }
  @ViewChild('manualForm') manualForm!: NgForm;
  candidate: any = {
    name: '',
    email: '',
    contact_no: '',
    alt_contact_no: '',
    technology: ''
  };
  dropDownArr: any = []
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


      this.candidate = {
        name: '',
        email: '',
        contact_no: '',
        alt_contact_no: '',
        technology: ''
      };

   
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


  isLoading = false;

  save(data: any) {
    this.isLoading = true; 

    this.candidate.skills = this.skills;

    this.sevice.createSingleReq(this.candidate).subscribe({
      next: (resp: any) => {
        console.log("Response of single creation", resp);

        Swal.fire('Success', 'Candidate added successfully!', 'success');

        this.sevice.triggerTableReload();

        this.reset(data);

        this.router.navigate(['/candidate-list']);
      },
      error: (err) => {
        console.error('Error while adding candidate:', err);

        Swal.fire('Error', 'Failed to add candidate.', 'error');
      },
      complete: () => {
        this.isLoading = false; 
      }
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
