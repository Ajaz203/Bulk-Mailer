import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
declare var bootstrap: any;


@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule],
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
searchQuery: string = '';

  constructor(private service: EmailService, private cdr: ChangeDetectorRef) { }
  ngOnInit() {
    this.getData();
    this.cdr.detectChanges();
    this.service.refreshTable$.subscribe(() => {
      this.getData();
    });

  }

  getData() {
    this.isLoading = true;
    this.service.getCandidateData({}).subscribe({
      next: (resp: any) => {
        console.log("Candidate Response:", resp);
        this.dataArr = resp;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load data:', err);
      }
    });
  }


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

    // Convert skills array → string for input
    this.selectedCandidate.skillsString = Array.isArray(candidate.skills)
      ? candidate.skills.join(', ')
      : (candidate.skills || '');

    const modal = new bootstrap.Modal(document.getElementById('editModal')!);
    modal.show();
  }

  updateCandidate() {
    this.selectedCandidate.skills = this.selectedCandidate.skillsString
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill !== '');
    this.service.updateCandidate(this.selectedCandidate.id, this.selectedCandidate)
      .subscribe({
        next: (res) => {
          Swal.fire('Updated!', 'Candidate updated successfully', 'success');
          this.getData();

          const modalElement = document.getElementById('editModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  deleteCandidate(id: any) {
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


  handleSelectCandidateSend() {
    if (this.selectedCandidates.size === 0) {
      Swal.fire('Warning', 'Please select at least one candidate.', 'warning');
      return;
    }
    this.selectionMode = 'selected';
    const modal = new bootstrap.Modal(document.getElementById('mailModal')!);
    modal.show();
  }

  handleAllCandidateSend() {
    this.selectionMode = 'all';
    const modal = new bootstrap.Modal(document.getElementById('mailModal')!);
    modal.show();
  }
  sendSelected() {
    if (this.selectedCandidates.size === 0) {
      alert('Please select at least one candidate');
      return;
    }
    console.log('Sending selected candidates:', Array.from(this.selectedCandidates));

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
    const convertedTime = this.convertTo12Hour(this.scheduleTime);

    payload.date = this.scheduleDate;
    payload.time = convertedTime;           // ✅ Time in 12-hour format like "9:40"
    payload.period = this.schedulePeriod;   // ✅ AM or PM
    payload.type = 'scheduled';
  } else {
    payload.type = 'immediate';
  }

  console.log('Payload:', payload);

  this.isLoading = true;

  this.service.sendMail(payload).subscribe({
    next: () => {
      Swal.fire('Success', 'Mail sent successfully!', 'success');
      this.resetMailModal();
      const modalElement = document.getElementById('mailModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();
      }
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'Failed to send mail.', 'error');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
convertTo12Hour(time: string): string {
  let [hours, minutes] = time.split(':').map(Number);

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}




  resetMailModal() {
    this.mailSubject = '';
    this.mailBody = '';
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.schedulePeriod = '';
    this.selectedCandidates.clear();

  }

  saveAsDraft() {
    console.log('Saving as Draft');
    console.log('Mail Content:', this.mailBody);
    console.log('Schedule:', this.scheduleDate, this.scheduleTime, this.schedulePeriod);
    // Add API call to save as draft
  }
get filteredCandidates() {
  if (!this.searchQuery) return this.dataArr;

  const query = this.searchQuery.toLowerCase();

  return this.dataArr.filter((c: any) =>
    (c.name?.toLowerCase().includes(query)) ||
    (c.email?.toLowerCase().includes(query)) ||
    (c.contact_no?.toLowerCase().includes(query)) ||
    (c.alt_contact_no?.toLowerCase().includes(query)) ||
    (c.technology?.toLowerCase().includes(query)) ||
    (c.location?.toLowerCase().includes(query)) ||
    (c.visa?.toLowerCase().includes(query)) ||
    (c.skills?.join(', ').toLowerCase().includes(query)) ||
    (new Date(c.createdAt).toLocaleDateString().toLowerCase().includes(query))
  );
}

}
