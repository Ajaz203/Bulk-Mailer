import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../header/header.component';
import { ChangeDetectorRef } from '@angular/core';
declare var bootstrap: any;


@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule, HeaderComponent],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})

export class CandidateListComponent implements OnInit {

  dataArr: any = []
  scheduleDate: any = '';
  scheduleTime: any = '';
  schedulePeriod: any = 'AM';
  selectedCandidates = new Set<any>();
  selectedFile: File | null = null;
  selectedCandidate: any = {};
  mailBody: any = '';
  mailSubject: any = '';
  mailDescription: any = '';
  http: any;
  selectionMode: 'all' | 'selected' = 'selected';
isLoading: boolean = false;




  constructor(private service: EmailService , private cdr: ChangeDetectorRef) { }
  ngOnInit() {
    this.getData();
    this.cdr.detectChanges();
    // this.service.refreshTable$.subscribe(() => {
    //   this.getData(); // function to reload your data
    // });
    //  this.getData();
  }

  getData() {
    this.service.getCandidateData({}).subscribe((resp: any) => {
      console.log("get condidate resp ", resp)
      this.dataArr = resp;
    })
  }


  // triggerFileInput() {
  //   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }


  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     console.log('Selected file:', file);
  //   }
  // }
  // Toggle single selection
  toggleSelection(candidate: any) {
    if (this.selectedCandidates.has(candidate)) {
      this.selectedCandidates.delete(candidate);
    } else {
      this.selectedCandidates.add(candidate);
    }
  }

  // Toggle all selection
  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.dataArr.forEach((candidate: any) => this.selectedCandidates.add(candidate));
    } else {
      this.selectedCandidates.clear();
    }
  }

  // Check if all selected
  isAllSelected() {
    return this.dataArr.length > 0 && this.selectedCandidates.size === this.dataArr.length;
  }

  sendSingle(candidate: any) {
    console.log('Sending single candidate:', candidate);

  }

  editCandidate(candidate: any) {
    this.selectedCandidate = { ...candidate };
    const modal = new bootstrap.Modal(document.getElementById('editModal')!);
    modal.show();
  }

updateCandidate() {
  this.isLoading = true;
  console.log('Updating candidate:', this.selectedCandidate);

  this.service.updateCandidate(this.selectedCandidate.id, this.selectedCandidate).subscribe({
    next: (res) => {
      console.log('Update Response:', res);

      Swal.fire('Updated!', 'Candidate updated successfully', 'success');

      this.isLoading = false; // ✅ Hide loader

      const modalElement = document.getElementById('editModal');
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();

         window.location.reload();
      this.selectedCandidate = null;
    },
    error: (err) => {
      this.isLoading = false; // ✅ Hide loader
      console.error('Update failed:', err);
      Swal.fire('Error!', err.error?.message || 'Failed to update candidate.', 'error');
    }
  });
}



  deleteCandidate(id: any) {
  console.log('Deleting ID:', id);

  if (!id) {
    Swal.fire('Error', 'ID is missing!', 'error');
    return;
  }

  const payload = { id: id };

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading = true;

      this.service.deleteCandidate(payload).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Candidate has been deleted.', 'success');
          this.dataArr = this.dataArr.filter((c: { id: any; }) => c.id !== id);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          Swal.fire('Error!', err.error?.error || 'Failed to delete candidate.', 'error');
        }
      });
    }
  });
}






  // Send selected candidates
  sendSelected() {
    if (this.selectedCandidates.size === 0) {
      alert('Please select at least one candidate');
      return;
    }
    console.log('Sending selected candidates:', Array.from(this.selectedCandidates));
    // your API call here
  }

  // Send all candidates
  sendAll() {
    console.log('Sending all candidates:', this.dataArr);
    // your API call here
  }





sendMail() {
  const selectedEmails = this.selectionMode === 'all'
    ? this.dataArr.map((c: { email: any }) => c.email)
    : Array.from(this.selectedCandidates).map(c => c.email);

  if (selectedEmails.length === 0) {
    Swal.fire('Error', 'No candidates selected.', 'error');
    return;
  }

  if (!this.mailSubject || !this.mailBody) {
    Swal.fire('Error', 'Subject and Mail Body are required.', 'error');
    return;
  }

  const isScheduled = this.scheduleDate && this.scheduleTime && this.schedulePeriod;

  const payload: any = {
    mailSubject: this.mailSubject,
    emails: selectedEmails,
    mailBody: this.mailBody
  };

  if (isScheduled) {
    payload.date = this.scheduleDate;
    payload.time = this.scheduleTime;
    payload.period = this.schedulePeriod;
    payload.type = 'scheduled';
  } else {
    payload.type = 'immediate';
  }

  console.log('Payload:', payload);

  this.isLoading = true; // 🔥 Start loader

  this.service.sendMail(payload).subscribe({
    next: () => {
      Swal.fire('Success', 'Mail sent successfully!', 'success');
      this.resetMailModal();

      // ✅ Close modal
      const modalElement = document.getElementById('mailModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();
      }
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'Failed to send mail.', 'error');
    },
    complete: () => {
      this.isLoading = false; // 🔥 Stop loader
    }
  });
}




resetMailModal() {
  this.mailSubject = '';
  this.mailBody = '';
  this.scheduleDate = '';
  this.scheduleTime = '';
  this.schedulePeriod = 'AM';
}


  saveAsDraft() {
    console.log('Saving as Draft');
    console.log('Mail Content:', this.mailBody);
    console.log('Schedule:', this.scheduleDate, this.scheduleTime, this.schedulePeriod);
    // Add API call to save as draft
  }

}
