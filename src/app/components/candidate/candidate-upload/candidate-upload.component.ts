import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-candidate-upload',
  imports: [CommonModule,FormsModule],
  templateUrl: './candidate-upload.component.html',
  styleUrl: './candidate-upload.component.scss'
})
export class CandidateUploadComponent {


  isUploading = false;
  file: File | null = null;
  fileName: string = '';
  constructor(private service: UserService, public router: Router, private titleService: Title) { 
    this.titleService.setTitle('MailCept-Upload Candidates');
  }
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileUpload(event: MouseEvent) {
    event.stopPropagation(); // prevent it from bubbling to the div
    this.fileInput.nativeElement.click();
  }
  // @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() dataParsed = new EventEmitter<any[]>();


  selectedFile: File | null = null;
  excelData: any[] = [];

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }

uploadFile(): void {
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

      console.log('Parsed Excel Data:', this.excelData);

      const userId = Number(localStorage.getItem('userId'));

      const finalArr = this.excelData.map((item: any) => ({
        ...item,
        Skills: item.Skills?.split(',').map((skill: string) => skill.trim()) || [],
        userId
      }));

      this.service.bulkUpload(finalArr).subscribe({
        next: (resp: any) => {
          console.log('Bulk Upload Response:', resp);
          Swal.fire({
            icon: 'success',
            title: 'Uploaded!',
            text: 'File uploaded successfully.',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.navigate();
            this.resetFileUpload();
          });
        },
        error: (error) => {
          console.error('Upload Error:', error);
          this.isUploading = false; // ✅ Reset here on failure
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Something went wrong during file upload.',
            confirmButtonColor: '#d33'
          });
        },
        complete: () => {
          this.isUploading = false; // ✅ Always reset when done
        }
      });
    } catch (err) {
      console.error('Parsing Error:', err);
      this.isUploading = false;
      Swal.fire({
        icon: 'error',
        title: 'Parsing Failed',
        text: 'Invalid file format or data.',
      });
    }
  };

  reader.onerror = (err) => {
    console.error('File read error:', err);
    this.isUploading = false;
    Swal.fire({
      icon: 'error',
      title: 'File Read Failed',
      text: 'Could not read the file.',
    });
  };

  reader.readAsArrayBuffer(this.selectedFile);
}


navigate(): void {
  this.router.navigate(['/candidates/list']);
}
  resetFileUpload() {
    this.file = null;
    this.fileName = '';
  }
  async downloadMassTemplate() {
    window.location.assign('assets/images/bulkEmailerTemplate.xlsx');
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


  activeTab: 'single' | 'bulk' = 'single';

singleCandidate = {
  fullName: '',
  email: '',
  phone: ''
};

submitSingle() {
  console.log('Single Candidate Data:', this.singleCandidate);
  // Call API to save single candidate
}

// /////////////////////single upload code/////////////////////////////////////////////////////////////



  isLoading = false;
  skill: string = '';
  skills: string[] = [];

  @ViewChild('manualForm') manualForm!: NgForm;
  candidate: any = {
    name: '',
    email: '',
    contact_no: '',
    alt_contact_no: '',
    technology: '',
    experience: '',
    visa: '',
    location: '',
  };
  dropDownArr: any = []
  ngOnInit() {
    this.getData();
  }
  visaOptions = [
    'US Citizen', 'Green Card', 'H1B', 'H1B Transfer', 'H4 EAD', 'L1', 'L2 EAD',
    'GC EAD', 'OPT EAD', 'CPT', 'F1 (Student)', 'TN Visa', 'E3 Visa', 'B1/B2', 'Other'
  ];
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent) {
    const pastedInput: string = event.clipboardData?.getData('text') || '';
    if (!/^\d*$/.test(pastedInput)) {
      event.preventDefault();
    }
  }

  getData() {
    this.service.getCategory().subscribe((resp: any) => {
      // console.log("getCategory category data is", resp);
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
        technology: '',
        experience: '',
        visa: '',
        location: '',
        userId: '',
      };
      this.skills = [];
      this.skill = '';
    } else {
      console.error('Form is undefined!');
    }
  }


  save(data: any): void {
    this.isLoading = true;
    this.candidate.skills = this.skills;

    Swal.fire({
      title: 'Saving...',
      text: 'Please wait while we save the candidate.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.service.createSingleReq(this.candidate).subscribe({
      next: (resp: any) => {
        console.log('Response of single creation:', resp);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Candidate added successfully.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.service.triggerTableReload();
          this.reset(data);
          this.router.navigate(['/candidates/list']);
        });
      },
      error: (err) => {
        console.error('Error while adding candidate:', err);

        Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to add candidate.',
          confirmButtonColor: '#d33'
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

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
