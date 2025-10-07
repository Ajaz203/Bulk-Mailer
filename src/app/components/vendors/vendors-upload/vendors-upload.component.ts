import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-vendors-upload',
  imports: [CommonModule],
  templateUrl: './vendors-upload.component.html',
  styleUrl: './vendors-upload.component.scss'
})
export class VendorsUploadComponent {
  isUploading = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private service: UserService, private titleService: Title) {
    this.titleService.setTitle('MailCept-Vendors Upload');
   }
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
  if (!this.selectedFile) {
    this.isUploading = false;
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: any) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      this.excelData = XLSX.utils.sheet_to_json(firstSheet);

      const userId = Number(localStorage.getItem('userId'));
      const finalArr: any[] = [];

      this.excelData.forEach((item: any) => {
        const { Skills, ...rest } = item;
        finalArr.push({
          ...rest,
          userId: Number(userId)
        });
      });

      // console.log("Final Payload (must be raw array):", finalArr);
      // console.log("Type of Payload:", Array.isArray(finalArr));

      this.service.venorUpload(finalArr).subscribe({
        next: (resp: any) => {
          console.log('Upload success:', resp);
          Swal.fire({
            icon: 'success',
            title: 'Uploaded!',
            text: 'File uploaded successfully.',
          }).then(() => {
            this.navigate();
            this.isUploading = false; // ✅ Reset after success
          });
        },
        error: (error: any) => {
          console.error('Upload failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: error?.error?.message || 'Something went wrong.',
          });
          this.isUploading = false; // ✅ Reset after failure
        },
        complete: () => {
          // ✅ Ensure spinner stops no matter what
          this.isUploading = false;
        }
      });

    } catch (err) {
      console.error('Parsing error:', err);
      this.isUploading = false;
      Swal.fire({
        icon: 'error',
        title: 'Parsing Failed',
        text: 'Invalid file or format.',
      });
    }
  };

  reader.onerror = (err) => {
    console.error('File read error:', err);
    this.isUploading = false;
    Swal.fire({
      icon: 'error',
      title: 'File Read Error',
      text: 'Could not read the file.',
    });
  };

  reader.readAsArrayBuffer(this.selectedFile);
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


  async downloadMassTemplate() {
    window.location.assign('assets/images/VendorEmailerTemplate.xlsx');
  }
  navigate(): void {
    this.router.navigate(['/vendors/by-user']);
  }

  resetFileUpload() {
    this.file = null;
    this.fileName = '';
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