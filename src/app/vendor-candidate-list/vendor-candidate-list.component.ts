import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { Toolbar } from 'ngx-editor';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';


declare var bootstrap: any;

interface UserVendor {
  userId: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-vendor-candidate-list',
  imports: [NgbPaginationModule, CommonModule, FormsModule, NgxEditorModule, InfiniteScrollDirective,IonicModule ],
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
  draftList: any[] = [];
  searchTerm = '';
  userVendorList: any[] = [];
  expandedUserId: number | null = null;
  expandedVendorList: any[] = [];
  selectedUser: any = null;
  vendorList: any[] = [];
  searchTermUser: string = '';
  searchTermVendor: string = '';
  htmlContent: string = '';
  editor!: Editor;
  showDeleteCandidate: boolean = false;
  emailList: any[] = [];
  loading = false;
  displayedVendors: any[] = [];
  displayLimit = 50;
  isLoadingMore = false;
  selectedVendorIds: number[] = [];
  constructor(private service: EmailService, private cd: ChangeDetectorRef,) { };

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
    this.editor = new Editor();
    this.getData();
    this.service.refreshTable$.subscribe(() => {
      this.getData();
    });
    // this.fetchUsersWithVendors();
    this.fetchUsersWithVendorMapping();
  }
  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  onScroll(): void {
    if (this.isLoadingMore || this.displayLimit >= this.vendorList.length)
      return;

    this.isLoadingMore = true;
    setTimeout(() => {
      this.displayLimit = Math.min(
        this.displayLimit + 50,
        this.vendorList.length
      );
      this.isLoadingMore = false;
    }, 1000);
  }

  fetchUsersWithVendors(): void {
    this.service.getUsersWithVendors({}).subscribe({
      next: (res) => {
        this.userVendorList = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error('Error fetching user-vendor data:', err);
      }
    });
  }



  toggleUserDetails(user: any): void {
    if (this.expandedUserId === user.userId) {
      this.expandedUserId = null;
      this.expandedVendorList = [];
      return;
    }

    this.expandedUserId = user.userId;

    this.service.getVendorsByUser(this.selectedUser.userId).subscribe({
      next: (res) => {
        this.vendorList = Array.isArray(res) ? res : [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to reload vendor list after deletion:', err);
      }
    });

  }



  get filteredUserList() {
    const term = this.searchTermUser.toLowerCase();
    return this.userVendorList.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  }
  get filteredVendorList() {
    const term = this.searchTermVendor.toLowerCase();
    return this.vendorList.filter(v =>
      v.email?.toLowerCase().includes(term)
    );
  }
  get paginatedUserList(): UserVendor[] {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredUserList.slice(start, start + this.pageSize);
  }

  handleDeleteCandidate() {
    const selectedIds = Array.from(this.selectedCandidates).map(vendor => vendor.id);
    this.showDeleteCandidate = selectedIds.length > 0;

  }

  clickAllDelete() {
    const visibleVendors = this.filteredVendorList.slice(0, this.displayLimit);
    const selectedIds = visibleVendors
      .filter(vendor => this.selectedCandidates.has(vendor))
      .map(vendor => vendor.id);

    this.deleteSelectedVendors(selectedIds);
  }

  deleteSelectedVendors(selectedIds: number[]) {

    const payload = { ids: selectedIds };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedIds.length} vendors. This action cannot be recover`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.service.deleteSelectedVendors(payload).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Selected candidates have been deleted.', 'success');
            this.isLoading = false;
            this.selectedCandidates.clear();
            this.showDeleteCandidate = false;

            this.vendorList = this.vendorList.filter(
              (c: { id: number }) => !selectedIds.includes(c.id)
            );
            this.dataArr = this.dataArr?.filter(
              (c: { id: number }) => !selectedIds.includes(c.id)
            );
            const user = this.userVendorList.find(u => u.userId === this.selectedUser?.userId);
            if (user && user.vendors) {
              user.vendors = user.vendors.filter((v: { id: any }) => !selectedIds.includes(v.id));
            }

            this.selectedCandidates.clear();
            this.showDeleteCandidate = false;

            this.isLoading = false;
          },
          error: (err) => {
            this.selectedCandidates.clear();
            this.showDeleteCandidate = false;
            this.isLoading = false;
            console.error(err);
            Swal.fire(
              'Error!',
              err.error?.error || 'Failed to delete selected candidates.',
              'error'
            );
          },
        });
      }
      else {
        this.selectedCandidates.clear();
        this.showDeleteCandidate = false;

      }
    });
  }

  handleSelectCandidateSend() {
    const selected = Array.from(this.selectedCandidates).filter(c => this.vendorList.includes(c));

    if (selected.length === 0) {
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

  filteredData() {
    if (!this.dataArr) return [];

    if (!this.searchTerm) {
      return this.dataArr;
    }

    const term = this.searchTerm.toLowerCase();
    return this.dataArr.filter((item: any) =>
      item.email?.toLowerCase().includes(term)
    );
  }


toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.filteredVendorList.forEach((vendor: any) =>
        this.selectedCandidates.add(vendor)
      );
    }
    // else if(event.target.checked){
    //   this.filteredVendorList.forEach((vendor:any)=>
    //     this.selectedCandidates.add(vendor)
    //   );
    // }
    else {
      this.selectedCandidates.clear();
    }
    this.handleDeleteCandidate();   
  }

  toggleSelection(vendor: any) {
    if (this.selectedCandidates.has(vendor)) {
      this.selectedCandidates.delete(vendor);
    } else {
      this.selectedCandidates.add(vendor);
    }
  }

  isAllSelected(): boolean {
    return this.vendorList.length > 0 && this.vendorList.every(v => this.selectedCandidates.has(v));
  }



  sendSingle(candidate: any) {
    console.log('Sending single candidate:', candidate);

  }
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
  // getData() {
  //   this.isLoading = true;
  //   const userId = localStorage.getItem('userId');

  //   if (!userId) {
  //     console.error('User ID not found');
  //     this.isLoading = false;
  //     return;
  //   }

  //   this.service.getVendors(userId).subscribe({
  //     next: (resp: any) => {

  //       this.dataArr = resp;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.error('Failed to load data:', err);
  //     }
  //   });
  // }
  getData() {
    this.isLoading = false;
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


  sendSelected() {
    // console.log("sendSelected is called")

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

  editModalInstance: any = null;
  editCandidate(candidate: any) {
    this.selectedCandidate = {
      ...candidate,
      userId: this.selectedUser?.userId  // ⬅️ set correct userId!
    };

    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      this.editModalInstance = new bootstrap.Modal(modalElement);
      this.editModalInstance.show();
    }
  }



  updateCandidate() {
    if (!this.selectedCandidate?.id) {
      Swal.fire('Error', 'Candidate ID missing.', 'error');
      return;
    }

    // ✅ Attach correct userId
    this.selectedCandidate.userId = this.selectedUser?.userId;

    this.service.vendorUpdate(this.selectedCandidate.id, this.selectedCandidate).subscribe({
      next: () => {
        Swal.fire('Updated!', 'Candidate updated successfully.', 'success');

        if (this.editModalInstance) {
          this.editModalInstance.hide();
        }

        document.querySelectorAll('.modal-backdrop').forEach(bd => bd.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');

        this.openUserVendors(this.selectedUser);
        this.fetchUsersWithVendorMapping();  // ⬅️ reload list correctly
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to update candidate.', 'error');
      }
    });
  }


  trackByVendorId(index: number, vendor: any): number {
    return vendor.id;
  }

  fetchUsersWithVendorMapping(): void {
    this.isLoading = true;

    this.service.getUsersWithVendors({}).subscribe({
      next: (users) => {
        const userList = Array.isArray(users) ? users : [];

        const userVendorObservables = userList.map(user =>
          this.service.getVendorsByUser(user.userId).pipe(
            map(vendors => ({ ...user, vendors }))
          )
        );

        forkJoin(userVendorObservables).subscribe({
          next: (combinedUsersWithVendors) => {
            this.userVendorList = combinedUsersWithVendors;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load vendors per user:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
        this.isLoading = false;
      }
    });
  }




 openUserVendors(user: any): void {
    this.selectedUser = user;
    this.vendorList = [];
    this.displayLimit = 50;
    this.isLoadingMore = false;


    this.service.getVendorsByUser(user.userId).subscribe({
      next: (res) => {
        this.vendorList = Array.isArray(res) ? res : [];
        document
          .querySelectorAll('.modal-backdrop')
          .forEach((bd) => bd.remove());
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');

        const modalElement = document.getElementById('vendorModal');
        if (modalElement) {
          const modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        console.error('Failed to load vendors:', err);
      },
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
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.service.vendorDelete(payload).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Candidate has been deleted.', 'success');
            this.vendorList = this.vendorList.filter(
              (c: { id: any }) => c.id !== id
            );
            this.dataArr = this.dataArr?.filter(
              (c: { id: any }) => c.id !== id
            );

            const user = this.userVendorList.find(u => u.userId === this.selectedUser?.userId);
            if (user && user.vendors) {
              user.vendors = user.vendors.filter((v: { id: any }) => v.id !== id);
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            console.error(err);
            Swal.fire(
              'Error!',
              err.error?.error || 'Failed to delete candidate.',
              'error'
            );
          },
        });
      }
    });
  }

  vendorSendMail() {
    const sourceList =
      this.selectionMode === 'all'
        ? this.vendorList
        : Array.from(this.selectedCandidates);

    const selectedEmails = sourceList.map((c: { email: any }) => c.email);

    if (selectedEmails.length === 0) {
      Swal.fire('Error', 'No candidates selected.', 'error');
      return;
    }

    if (!this.mailSubject?.trim() || !this.mailBody?.trim()) {
      Swal.fire('Error', 'Subject and Mail Body are required.', 'error');
      return;
    }

    // LOG the values to debug
    console.log('Schedule Date:', this.scheduleDate);
    console.log('Schedule Time:', this.scheduleTime);
    console.log('Schedule Period:', this.schedulePeriod);

    const isScheduled =
      this.scheduleDate?.trim?.() &&
      this.scheduleTime?.trim?.() &&
      this.schedulePeriod?.trim?.();

    const payload: any = {
      mailSubject: this.mailSubject,
      emails: selectedEmails,
      mailBody: this.mailBody,
    };

    if (isScheduled) {
      const { time, period } = this.convertTo12HourWithPeriod(
        this.scheduleTime
      );

      payload.date = this.scheduleDate;
      payload.time = time;
      payload.period = period;
      payload.type = 'scheduled';
    } else {
      payload.type = 'immediate';
    }

    this.isLoading = true;

    this.service.vendorSendMail(payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Mail sent successfully!', 'success');
        this.resetMailModal();

        const modalElement = document.getElementById('mailModal');
        if (modalElement) {
          const modal =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
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
      },
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
      ? this.dataArr.map((v: { email: any }) => v.email)
      : Array.from(this.selectedCandidates).map(v => v.email);

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

    // console.log('Vendor Draft Payload:', payload);

    this.isLoading = true;

    this.service.vendorSendMail(payload).subscribe({
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
  getDraftData() {
    const targetType = 'vendor';
    this.service.getDrafts(targetType).subscribe({
      next: (res) => {
        this.draftList = res;
        console.log('Draft Data:', res);
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

}
