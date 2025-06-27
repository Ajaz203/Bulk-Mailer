import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../header/header.component';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;
@Component({
  selector: 'app-vendor-candidate-list',
  imports: [NgbPaginationModule, CommonModule, HeaderComponent,FormsModule],
  templateUrl: './vendor-candidate-list.component.html',
  styleUrl: './vendor-candidate-list.component.css'
})
export class VendorCandidateListComponent {

  dataArr: any;
  isLoading: boolean = false;
  cdr: any;
  selectedCandidate: any = {};
  scheduleDate: any = '';
  scheduleTime: any = '';
  schedulePeriod: any = 'AM';
  selectedCandidates = new Set<any>();
  selectedFile: File | null = null;
  mailBody: any = '';
  mailSubject: any = '';
  mailDescription: any = '';
  http: any;
  selectionMode: 'all' | 'selected' = 'selected';
  


  constructor(private service: EmailService) { };

  private _candidates = signal<any[]>([]);
  @Input()
  set candidates(value: any[]) {
    this._candidates.set(value);
  }
  get candidates() {
    return this._candidates();
  }

  selected = signal<Set<number>>(new Set());

  page = signal(1);
  pageSize = 10;

  pageNumber = 1;
  ngOnInit() {
    this.getData();
    this.cdr.detectChanges();
    this.service.refreshTable$.subscribe(() => {
      this.getData();
    });
  }

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
  // on page change, update signal
  onPageChange(newPage: number) {
    this.page.set(newPage);
  }

  paginated = computed(() =>
    this._candidates().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize)
  );

  selectAll() {
    const start = (this.page() - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, this.candidates.length);
    const selected = new Set(this.selected());

    const allSelected = Array.from({ length: end - start }, (_, i) => selected.has(start + i)).every(Boolean);

    if (allSelected) {
      for (let i = start; i < end; i++) selected.delete(i);
    } else {
      for (let i = start; i < end; i++) selected.add(i);
    }

    this.selected.set(selected);
  }
  getData() {
    this.isLoading = true;
    this.service.getVendors().subscribe({
      next: (resp: any) => {
        console.log("vendor Response:", resp);
        this.dataArr = resp;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load data:', err);
      }
    });
  }
  isPageFullySelected(): boolean {
    const start = (this.page() - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, this.candidates.length);
    const selected = this.selected();

    for (let i = start; i < end; i++) {
      if (!selected.has(i)) return false;
    }
    return true;
  }

  isPagePartiallySelected(): boolean {
    const start = (this.page() - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, this.candidates.length);
    const selected = this.selected();

    let count = 0;
    for (let i = start; i < end; i++) {
      if (selected.has(i)) count++;
    }

    return count > 0 && count < (end - start);
  }


  // clearSelection() {
  //   console.log("clearSelection is called")
  //   this.selected.set(new Set());
  //   console.log(this.selected)

  // }

  sendSelected() {
    console.log("sendSelected is called")

    const selectedData = Array.from(this.selected()).map(i => this.candidates[i]);

    if (selectedData.length) {
      this.service.sendBulkEmail(selectedData).subscribe({
        next: (res) => {
          // console.log('Email sent successfully', res);
          alert('Emails sent to selected candidates!');
        },
        error: (err) => {
          // console.error('Error sending email', err);
          alert('Failed to send emails.');
        }
      });
    } else {
      alert('No record selected');
    }
  }

  sendAll() {
    if (this.candidates.length) {
      this.service.sendBulkEmail(this.candidates).subscribe({
        next: (res) => {
          // console.log('Email sent successfully', res);
          alert('Emails sent to selected candidates!');
        },
        error: (err) => {
          // console.error('Error sending email', err);
          alert('Failed to send emails.');
        }
      });
    } else {
      alert('No record selected');
    }
  }


  editCandidate(candidate: any) {
    this.selectedCandidate = { ...candidate };
    const modal = new bootstrap.Modal(document.getElementById('editModal')!);
    modal.show();
  }

  updateCandidate() {
    this.service.vendorUpdate(this.selectedCandidate.id, this.selectedCandidate)
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

        this.service.vendorDelete(payload).subscribe({
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

    this.isLoading = true;

    this.service.vendorSendMail(payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Mail sent successfully!', 'success');
        this.resetMailModal();

        // ✅ Close modal
        const modalElement = document.getElementById('mailModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modal.hide();
        }

        // ✅ Remove leftover backdrop
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
}
