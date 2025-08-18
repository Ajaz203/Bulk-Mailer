import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { Toolbar } from 'ngx-editor';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { Router } from '@angular/router';

declare var bootstrap: any;
@Component({
  selector: 'app-candidate-list',
  imports: [CommonModule, NgbPaginationModule, FormsModule, NgxEditorModule],
  templateUrl: './candidate-list.component.html',
  styleUrl: './candidate-list.component.scss'
})
export class CandidateListComponent {
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
  searchTerm = '';
  draftList: any[] = [];
  showFilterSection = false;
  originalData: any;
  selectedUser: any = null;
  editor!: Editor;
  htmlContent: string = '';
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['text_color', 'background_color'],
    ['link'],
    ['bullet_list', 'ordered_list'],
    ['code', 'blockquote'],
    ['align_left', 'align_center', 'align_right']
  ];
  showMailModal = false;
  showEditModal = false;
  constructor(private service: UserService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.editor = new Editor();
    this.getData();
    this.cdr.detectChanges();
    this.service.refreshTable$.subscribe(() => {
      this.getData();
    });
    this.getDraftData();

  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }
  backToUsers() {
    this.router.navigate(['/candidates/upload']);
  }
  filter = {
    experience: '',
    visa: '',
    skills: ''
  };

  openFilterSection() {
    this.showFilterSection = !this.showFilterSection;
  }

  applyFilters() {
    const { experience, visa, skills } = this.filter;

    this.dataArr = this.originalData.filter((candidate: any) => {
      const matchExp = !experience || String(candidate.experience) === String(experience);
      const matchVisa = !visa || (candidate.visa?.toLowerCase().includes(visa.toLowerCase()));
      const matchSkills = !skills || (Array.isArray(candidate.skills)
        ? candidate.skills.join(',').toLowerCase().includes(skills.toLowerCase())
        : candidate.skills?.toLowerCase().includes(skills.toLowerCase()));

      return matchExp && matchVisa && matchSkills;
    });
  }



  resetFilters() {
    this.filter = { experience: '', visa: '', skills: '' };
    this.dataArr = [...this.originalData];
  }

  getData() {
    this.isLoading = true;
    this.service.getCandidateData({}).subscribe({
      next: (resp: any) => {
        // console.log("Candidate Response:", resp);
        this.originalData = resp;
        this.dataArr = [...this.originalData];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load data:', err);
      }
    });
  }


  toggleSelection(candidate: any) {
    if (this.selectedCandidates.has(candidate)) {
      this.selectedCandidates.delete(candidate);
    } else {
      this.selectedCandidates.add(candidate);
    }
  }


  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.dataArr.forEach((candidate: any) => this.selectedCandidates.add(candidate));
    } else {
      this.selectedCandidates.clear();
    }
  }

  isAllSelected() {
    return this.dataArr.length > 0 && this.selectedCandidates.size === this.dataArr.length;
  }

  sendSingle(candidate: any) {
    console.log('Sending single candidate:', candidate);

  }

  editCandidate(candidate: any) {
    this.selectedCandidate = { ...candidate };
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
    const modalElement = document.getElementById('mailModal');
    if (modalElement) new bootstrap.Modal(modalElement).show();
    this.openMailModal();
  }

  handleAllCandidateSend() {
    this.selectionMode = 'all';
    const modalElement = document.getElementById('mailModal');
    if (modalElement) new bootstrap.Modal(modalElement).show();
    this.openMailModal();
  }
  sendSelected() {
    if (this.selectedCandidates.size === 0) {
      alert('Please select at least one candidate');
      return;
    }
    console.log('Sending selected candidates:', Array.from(this.selectedCandidates));

  }
  convertTo12HourFormat(time24: string): { time: string, period: string } {
    if (!time24) return { time: '', period: '' };

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

    const isScheduled = this.scheduleDate && this.scheduleTime;

    const payload: any = {
      mailSubject: this.mailSubject,
      emails: selectedEmails,
      mailBody: this.mailBody,

    };
    console.log('Mail sent:', this.mailSubject, this.mailBody);

    if (isScheduled) {
      const { time, period } = this.convertTo12HourFormat(this.scheduleTime);

      payload.date = this.scheduleDate;
      payload.time = time;
      payload.period = period;
      payload.type = 'scheduled';
    } else {
      payload.type = 'immediate';
    }

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


  resetMailModal() {
    this.mailSubject = '';
    this.mailBody = '';
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.schedulePeriod = '';
    this.selectedCandidates.clear();

  }

  saveAsDraft() {
    const selectedEmails = this.selectionMode === 'all'
      ? this.dataArr.map((c: { email: any }) => c.email)
      : Array.from(this.selectedCandidates).map(c => c.email);

    const isScheduled = this.scheduleDate && this.scheduleTime;

    const payload: any = {
      mailSubject: this.mailSubject || '',
      emails: selectedEmails || [],
      mailBody: this.mailBody || '',
      type: 'draft'
    };

    if (isScheduled) {
      const { time, period } = this.convertTo12HourWithPeriod(this.scheduleTime);
      payload.date = this.scheduleDate;
      payload.time = time;
      payload.period = period;
    }

    console.log('Draft Payload:', payload);

    this.isLoading = true;

    this.service.sendMail(payload).subscribe({
      next: () => {
        Swal.fire('Saved!', 'Draft saved successfully!', 'success');
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
        Swal.fire('Error', 'Failed to save draft.', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }



  getDraftData() {
    const targetType = 'candidate';
    this.service.getDrafts(targetType).subscribe({
      next: (res) => {
        this.draftList = res;
        // console.log('Draft Data:', res);
      },
      error: (err) => {
        console.error('Error fetching drafts:', err);
      }
    });
  }
  loadDraft(draft: any) {
    this.mailSubject = draft.mailSubject || '';
    this.mailBody = draft.mailBody || '';
    this.scheduleDate = draft.date || '';

    if (draft.time && draft.period) {
      this.scheduleTime = this.convertTo24Hour(draft.time, draft.period);
      this.schedulePeriod = draft.period;
    } else {
      this.scheduleTime = '';
      this.schedulePeriod = '';
    }

    this.selectedCandidates = new Set(draft.emails || []);
    this.selectionMode = 'selected';

    Swal.fire('Loaded!', 'Draft loaded successfully.', 'success');
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

  convertTo24Hour(time12: string, period: string): string {
    let [hours, minutes] = time12.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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

  openDraftInMail(draft: any) {
    this.mailSubject = draft.mailSubject || '';
    this.mailBody = draft.mailBody || '';
    this.scheduleDate = draft.date || '';

    if (draft.time && draft.period) {
      this.scheduleTime = this.convertTo24Hour(draft.time, draft.period);
      this.schedulePeriod = draft.period;
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
  openMailModal() {
    this.showMailModal = true;
  }

  closeMailModal() {
    this.showMailModal = false;
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

}

