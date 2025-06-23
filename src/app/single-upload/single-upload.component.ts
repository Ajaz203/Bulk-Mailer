import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-upload.component.html',
  styleUrls: ['./single-upload.component.css']
})
export class SingleUploadComponent {
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

  save() {
    console.log('📥 Single Candidate Saved:', this.candidate);
    // Send to API if needed
  }
}
