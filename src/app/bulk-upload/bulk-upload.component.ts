import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { EmailService } from '../services/bulk-email.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  imports: [CommonModule],
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent {
  constructor(private service: EmailService) { }
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
      // this.dataParsed.emit(this.excelData);
      console.log(this.excelData)
      var finalArr = this.excelData.map((item: any) => {
        return {
          ...item,
          Skills: item.Skills.split(',').map((skill: any) => skill.trim())
        };
      });
      
      this.service.bulkUpload(finalArr).subscribe((resp: any) => {
        this.service.triggerTableReload();
        console.log(" resp of bulk creation", resp)
      })
    };
    reader.readAsArrayBuffer(this.selectedFile);
  }

  uploadFile() {
    this.confirmFile();
  }
async downloadMassTemplate(){
    
    window.location.assign('../asset/bulkEmailerTemplate.xlsx');
    
  
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
