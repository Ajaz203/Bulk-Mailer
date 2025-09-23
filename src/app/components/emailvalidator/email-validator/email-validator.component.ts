  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { UserService } from '../../../shared/services/user.service';
  import { interval, switchMap, takeWhile } from 'rxjs';
  import { Title } from '@angular/platform-browser';
  import Swal from 'sweetalert2';

  @Component({
    selector: 'app-email-validator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './email-validator.component.html',
    styleUrls: ['./email-validator.component.scss']
  })
  export class EmailValidatorComponent {
    fileName: string | null = null;
    selectedFile: File | null = null;
    isUploading = false;
    isProcessing = false;
    batchId: string | null = null;
    readyForDownload = false;
    results: any[] = [];

    constructor(private userService: UserService, private titleService: Title) {
      this.titleService.setTitle('MailCept-Email Validator');
    }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
    }
  }

  removeFile() {
    this.fileName = null;
    this.selectedFile = null;
    this.batchId = null;
    this.readyForDownload = false;
    this.isUploading = false;
    this.isProcessing = false;
    this.results = [];
    Swal.fire('Removed', 'File has been removed successfully.', 'success');
  }

  uploadFile() {
    if (!this.selectedFile) {
      Swal.fire('No file selected', 'Please select a file to upload.', 'warning');
      return;
    }

    this.isUploading = true;
    this.isProcessing = true;
    this.readyForDownload = false;

    // Show loading
    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while we upload your file',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    formData.append('userId', currentUser?.userId?.toString() || '');
    formData.append('userEmail', currentUser?.email || '');
    formData.append('userName', currentUser?.name || '');

    this.userService.uploadBatch(formData).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        this.batchId = res?.batch?.id;

        if (this.batchId) {
          Swal.fire('Success', 'File uploaded successfully!', 'success');
          this.pollBatchStatus(this.batchId);
        } else {
          this.isProcessing = false;
          Swal.fire('Info', 'Upload succeeded but no batch ID returned.', 'info');
        }
      },
      error: (err) => {
        console.error(err);
        this.isUploading = false;
        this.isProcessing = false;
        Swal.fire('Error', 'There was an error uploading the file.', 'error');
      }
    });
  }

  private pollBatchStatus(uuid: string) {
    console.log('Starting polling for batch:', uuid);

    // Show processing loader
    Swal.fire({
      title: 'Processing...',
      text: 'We are validating your emails, please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    interval(3000)
      .pipe(
        switchMap(() => {
          console.log('Calling checkBatch for:', uuid);
          return this.userService.checkBatch(uuid);
        }),
        takeWhile((res: any) => this.extractBatchState(res) !== 'completed', true)
      )
      .subscribe({
        next: (res: any) => {
          console.log('Polling response:', res);

          const state = this.extractBatchState(res);

          if (state === 'completed') {
            this.isProcessing = false;
            this.readyForDownload = true;
            this.fetchResults(uuid);
            Swal.fire({
              title: 'Validation Complete!',
              text: 'Your file has been validated successfully. You can now download the results.',
              icon: 'success',
              confirmButtonText: 'Download File'
            }).then((result) => {
              if (result.isConfirmed) {
                this.downloadFile();
              }
            });
          }
        },
        error: (err) => {
          console.error('Polling error:', err);
          this.isProcessing = false;
          Swal.fire('Error', 'Something went wrong while checking batch status.', 'error');
        }
      });
  }

  private extractBatchState(res: any): string | undefined {
    return (
      res?.batch_state ||
      res?.batch?.batch_state ||
      res?.data?.batch?.batch_state ||
      res?.data?.batch_state
    );
  }

  private fetchResults(uuid: string) {
    this.userService.validatorResult(uuid).subscribe({
      next: (res) => {
        console.log('Validation results:', res);
        this.results = res?.results || res || [];
      },
      error: (err) => console.error('Fetch results error:', err),
    });
  }

  downloadFile() {
    if (!this.batchId) return;

    this.userService.validatorEmail(this.batchId).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `validated-emails-${this.batchId}.xlsx`;
        link.click();

        Swal.fire('Downloaded', 'Validated file downloaded successfully.', 'success');
        this.fileName = null;
        this.selectedFile = null;
        this.batchId = null;
        this.readyForDownload = false;
        this.results = [];
        this.isUploading = false;
        this.isProcessing = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to download the file.', 'error');
      }
    });
  }
}
