import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmailService } from '../services/bulk-email.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css']
})
export class DraftsComponent implements OnInit {

  draftList: any[] = [];
  isLoading = false;
  dataArr: any = [];

  mailSubject = '';
  mailBody = '';
  scheduleDate = '';
  scheduleTime = '';
  schedulePeriod = '';

  editingDraftId: string = '';
  selectedCandidates = new Set<string>();
  selectionMode = 'selected';

  mailType: 'candidate' | 'vendor' = 'candidate';

  constructor(private service: EmailService, private router: Router) { }

  ngOnInit(): void {
     this.mailType = 'candidate';
    this.getDraftData();
  }


getDraftData() {
  this.isLoading = true;

  this.service.getDrafts(this.mailType).subscribe({
    next: (res) => {
      this.draftList = (res || []).map((draft: any) => ({
        ...draft,
        mailSubject: draft.mailSubject,
        mailBody: draft.mailBody
      }));
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error fetching drafts:', err);
      this.isLoading = false;
    }
  });
}



  editDraft(draft: any) {
    this.editingDraftId = draft.id || draft._id;

    this.mailSubject = draft.mailSubject || '';
    this.mailBody = draft.mailBody || '';
    this.scheduleDate = draft.date || '';
    this.schedulePeriod = draft.period || 'AM';

    if (draft.time && draft.period) {
      this.scheduleTime = this.convertTo24Hour(draft.time, draft.period);
    } else {
      this.scheduleTime = '';
      this.schedulePeriod = '';
    }

    this.selectedCandidates = new Set(draft.emails || []);
    this.selectionMode = 'selected';

    const modalElement = document.getElementById('mailModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  saveAsDraft() {
    const selectedEmails = this.selectionMode === 'all'
      ? this.dataArr.map((c: { email: any }) => c.email)
      : Array.from(this.selectedCandidates);

    const isScheduled = this.scheduleDate && this.scheduleTime;

    const payload: any = {
      mailSubject: this.mailSubject,
      emails: selectedEmails,
      mailBody: this.mailBody,
      type: 'draft',
      mailType: this.mailType
    };

    if (isScheduled) {
      const { time, period } = this.convertTo12HourWithPeriod(this.scheduleTime);
      payload.date = this.scheduleDate;
      payload.time = time;
      payload.period = period;
    }

    this.isLoading = true;

    const apiCall = this.mailType === 'vendor'
      ? this.service.vendorSendMail(payload)
      : this.service.sendMail(payload);

    apiCall.subscribe({
      next: () => {
        Swal.fire('Saved!', 'Draft saved successfully!', 'success');
        this.closeModal();
        this.getDraftData();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to save draft.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  sendMail() {
    const selectedEmails = this.selectionMode === 'all'
      ? this.dataArr.map((c: { email: any }) => c.email)
      : Array.from(this.selectedCandidates);

    if (selectedEmails.length === 0) {
      Swal.fire('Error', 'No recipients selected.', 'error');
      return;
    }

    if (!this.mailSubject || !this.mailBody) {
      Swal.fire('Error', 'Subject and Mail Body are required.', 'error');
      return;
    }

    const isScheduled = this.scheduleDate && this.scheduleTime;

    const payload: any = {
      mailSubject: this.mailSubject,
      emails: selectedEmails,
      mailBody: this.mailBody,
      type: isScheduled ? 'scheduled' : 'immediate',
      mailType: this.mailType
    };

    if (isScheduled) {
      const { time, period } = this.convertTo12HourWithPeriod(this.scheduleTime);
      payload.date = this.scheduleDate;
      payload.time = time;
      payload.period = period;
    }

    this.isLoading = true;

    const apiCall = this.mailType === 'vendor'
      ? this.service.vendorSendMail(payload)
      : this.service.sendMail(payload);

    apiCall.subscribe({
      next: () => {
        Swal.fire('Success', 'Mail sent successfully!', 'success');
        if (this.editingDraftId) {
          this.draftList = this.draftList.filter(
            (d) => d.id !== this.editingDraftId && d._id !== this.editingDraftId
          );
        }
        this.editingDraftId = '';
        this.closeModal();
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


  deleteDraft(draft: any) {
    const draftId = draft.id || draft._id;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this draft?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          id: draftId,
          mailType: draft.mailType || this.mailType
        };

        this.service.deleteDraft(payload).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Draft has been deleted.', 'success');
            this.draftList = this.draftList.filter(
              (d) => d.id !== draftId && d._id !== draftId
            );
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Failed to delete draft.', 'error');
          }
        });
      }
    });
  }

switchMailType(type: 'candidate' | 'vendor') {
  this.mailType = type;
  this.getDraftData();
}



  convertTo24Hour(time12: string, period: string): string {
    let [hours, minutes] = time12.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  convertTo12HourWithPeriod(time24: string): { time: string, period: string } {
    const [hourStr, minute] = time24.split(':');
    let hours = parseInt(hourStr, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return {
      time: `${hours}:${minute.padStart(2, '0')}`,
      period
    };
  }

  resetMailModal() {
    this.mailSubject = '';
    this.mailBody = '';
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.schedulePeriod = '';
    this.selectedCandidates.clear();
  }

  closeModal() {
    const modalElement = document.getElementById('mailModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }

  refreshDrafts() {
    this.getDraftData();
  }
}
