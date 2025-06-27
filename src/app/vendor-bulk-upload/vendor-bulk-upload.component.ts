import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from '../services/bulk-email.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-vendor-bulk-upload',
  imports: [CommonModule],
  templateUrl: './vendor-bulk-upload.component.html',
  styleUrl: './vendor-bulk-upload.component.css'
})
export class VendorBulkUploadComponent {
  isUploading = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private service: EmailService) { }
  triggerFileUpload(event: MouseEvent) {
    event.stopPropagation(); // prevent it from bubbling to the div
    this.fileInput.nativeElement.click();
  }
  // @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() dataParsed = new EventEmitter<any[]>();

  fileName: string = '';
  selectedFile: File | null = null;
  excelData: any[] = [];
  file: File | null = null;
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }
  confirmFile(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      this.excelData = XLSX.utils.sheet_to_json(firstSheet);

      console.log('Parsed Excel Data:', this.excelData);

      const finalArr = this.excelData.map((item: any) => {
        const { Skills, ...rest } = item;
        return rest;
      });

      this.service.venorUpload(finalArr).subscribe({
        next: (resp: any) => {
          console.log('Bulk Upload Response:', resp);

          Swal.fire({
            icon: 'success',
            title: 'Uploaded!',
            text: 'File uploaded successfully.',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.navigate();
          });
        },
        error: (error: any) => {
          console.error('Upload Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Something went wrong during file upload.',
            confirmButtonColor: '#d33'
          });
        }
      });
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }
 async downloadMassTemplate() {
    window.location.assign('../asset/VendorEmailerTemplate.xlsx');
  }
  navigate(): void {
    this.router.navigate(['/vendor-list']);
  }

  resetFileUpload() {
    this.file = null;
    this.fileName = '';
  }
  uploadFile() {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
      });
      return;
    }

    this.isUploading = true;
    this.confirmFile();
  }

  removeFile() {
    this.fileName = '';
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.dataParsed.emit([]);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.fileName = files[0].name;
    }
  }
}
