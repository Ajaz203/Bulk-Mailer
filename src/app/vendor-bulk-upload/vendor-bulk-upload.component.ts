// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-vendor-bulk-upload',
//   imports: [],
//   templateUrl: './vendor-bulk-upload.component.html',
//   styleUrl: './vendor-bulk-upload.component.css'
// })
// export class VendorBulkUploadComponent {

// }

import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-vendor-bulk-upload',
  imports: [],
  templateUrl: './vendor-bulk-upload.component.html',
  styleUrl: './vendor-bulk-upload.component.css'
})
export class VendorBulkUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileUpload(event: MouseEvent) {
    event.stopPropagation(); // prevent it from bubbling to the div
    this.fileInput.nativeElement.click();
  }
  // @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() dataParsed = new EventEmitter<any[]>();

  fileName: string = '';
  selectedFile: File | null = null;
  excelData: any[] = [];

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
      this.dataParsed.emit(this.excelData);
    };
    reader.readAsArrayBuffer(this.selectedFile);
  }

  uploadFile() {
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
