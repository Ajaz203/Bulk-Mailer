
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-single-upload',
  imports: [],
  templateUrl: './vendor-single-upload.component.html',
  styleUrl: './vendor-single-upload.component.css'
})
export class VendorSingleUploadComponent {
  candidate = {
    Name: '',
    Email: '',
    ContactNo: '',
    AlternateContactNo: '',
    Other: ''
  };

  reset() {
    this.candidate = {
      Name: '',
      Email: '',
      ContactNo: '',
      AlternateContactNo: '',
      Other: ''
    };
  }

  saveVendor() {
    console.log('📥 Single Candidate Saved:', this.candidate);
    // Send to API if needed
  }
}
