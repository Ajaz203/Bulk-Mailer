import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import Swal from 'sweetalert2';
import { Editor } from 'ngx-editor';
import { forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Title } from '@angular/platform-browser';
declare var bootstrap: any;
@Component({
  selector: 'app-vendors-list',
  imports: [CommonModule, FormsModule, NgxEditorModule, InfiniteScrollModule],
  templateUrl: './vendors-list.component.html',
  styleUrl: './vendors-list.component.scss'
})
export class VendorsListComponent {

  userId!: number;
  selectedUser: any = null;
  vendorList: any[] = [];
  searchTermVendor = '';
  selectedCandidates = new Set<any>();
  showDeleteCandidate = false;
  displayLimit = 50;
  isLoadingMore = false;
  isLoading = false;
  editor!: Editor;
  mailSubject = '';
  mailBody = '';
  scheduleDate = '';
  scheduleTime = '';
  schedulePeriod = 'AM';
  selectionMode: 'all' | 'selected' = 'selected';
  draftList: any[] = [];
  editModalInstance: any = null;
  selectedCandidate: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UserService,
    private titleService: Title
  ) { 
    this.titleService.setTitle('MailCept-Vendors');
  }

ngOnInit(): void {
  this.editor = new Editor();
  this.route.paramMap.subscribe(params => {
    const id = params.get('userId');
    if (id) {
      this.userId = Number(id);


      const navStateUser = history.state?.user;
      if (navStateUser) {
        this.selectedUser = navStateUser;
      } else {
        this.loadUserMeta();
      }

      this.loadVendors();
      this.getDraftData();
    }
  });
    this.getUserSignature();
     this.userSignature = localStorage.getItem('userSignature') || `Ajaz<br>Software Developer`;
}
getUserSignature() {
  const payload = { userId: this.userId, };

  this.service.getSignature(payload).subscribe({
    next: (res: any) => {
      this.userSignature = res?.data?.signature || ''; 
      console.log('Fetched Signature:', this.userSignature);
    },
    error: (err) => {
      console.error('Error fetching signature:', err);
      this.userSignature = ''; 
    }
  });
}



  ngOnDestroy(): void {
    if (this.editor) this.editor.destroy();
  }

  loadUserMeta() {
    // optional: attempt to fetch users with vendors and find this user
    this.service.getUsersWithVendors({}).subscribe({
      next: users => {
        const list = Array.isArray(users) ? users : [];
        const found = list.find((u: any) => u.userId === this.userId);
        if (found) this.selectedUser = found;
      },
      error: err => console.warn('user meta fetch failed', err)
    });
  }

loadVendors(): void {
  this.isLoading = true;
  this.service.getVendorsByUser(this.userId).subscribe({
    next: (res: any) => {
  this.vendorList = Array.isArray(res) ? res : [];
  const nullItems = this.vendorList.filter(v => v == null);
  if (nullItems.length > 0) {
    console.warn('Null or undefined vendors in list:', nullItems);
  }
  this.isLoading = false;
}

  });

}



get filteredVendorList() {
  if (!this.searchTermVendor) return this.vendorList;

  const query = this.searchTermVendor.toLowerCase();

  return this.vendorList.filter((vendor: any) =>
    vendor?.email
      ? vendor.email.toLowerCase().includes(query)
      : false
  );
}



  trackByVendorId(index: number, vendor: any): number | string {
  return vendor?.id ?? vendor?._id ?? index;
}

  // infinite scroll emulation (same as before)
  onScroll(): void {
    if (this.isLoadingMore || this.displayLimit >= this.vendorList.length) return;
    this.isLoadingMore = true;
    setTimeout(() => {
      this.displayLimit = Math.min(this.displayLimit + 50, this.vendorList.length);
      this.isLoadingMore = false;
    }, 800);
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.filteredVendorList.slice(0, this.displayLimit).forEach(v => this.selectedCandidates.add(v));
    } else {
      this.selectedCandidates.clear();
    }
    this.handleDeleteCandidate();
  }

  toggleSelection(vendor: any) {
    if (this.selectedCandidates.has(vendor)) this.selectedCandidates.delete(vendor);
    else this.selectedCandidates.add(vendor);
    this.handleDeleteCandidate();
  }

  handleDeleteCandidate() {
    this.showDeleteCandidate = Array.from(this.selectedCandidates).length > 0;
  }

 isAllSelected(): boolean {
  const visibleVendors = this.filteredVendorList.slice(0, this.displayLimit);
  return visibleVendors.length > 0 && visibleVendors.every(v => this.selectedCandidates.has(v));
}


  clickAllDelete() {
    const visible = this.filteredVendorList.slice(0, this.displayLimit);
    const selectedIds = visible.filter(v => this.selectedCandidates.has(v)).map(v => v.id);
    if (selectedIds.length === 0) {
      Swal.fire('Warning', 'Please select at least one candidate to delete.', 'warning');
      return;
    }
    this.deleteSelectedVendors(selectedIds);
  }

  deleteSelectedVendors(selectedIds: number[]) {
    const payload = { ids: selectedIds };
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedIds.length} vendors. This action cannot be recovered.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (!result.isConfirmed) {
        this.selectedCandidates.clear();
        this.showDeleteCandidate = false;
        return;
      }

      this.isLoading = true;
      this.service.deleteSelectedVendors(payload).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Selected candidates have been deleted.', 'success');
          this.vendorList = this.vendorList.filter(v => !selectedIds.includes(v.id));
          // update selectedUser.vendors if present
          if (this.selectedUser && this.selectedUser.vendors) {
            this.selectedUser.vendors = this.selectedUser.vendors.filter((v: any) => !selectedIds.includes(v.id));
          }
          this.selectedCandidates.clear();
          this.showDeleteCandidate = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', err?.error?.error || 'Failed to delete selected candidates.', 'error');
          this.selectedCandidates.clear();
          this.showDeleteCandidate = false;
          this.isLoading = false;
        }
      });
    });
  }

  deleteCandidate(id: any) {
    if (!id) {
      Swal.fire('Error', 'ID is missing!', 'error');
      return;
    }
    const payload = { id };
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.isLoading = true;
      this.service.vendorDelete(payload).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Candidate has been deleted.', 'success');
          this.vendorList = this.vendorList.filter(v => v.id !== id);
          if (this.selectedUser && this.selectedUser.vendors) {
            this.selectedUser.vendors = this.selectedUser.vendors.filter((v: any) => v.id !== id);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error!', err?.error?.error || 'Failed to delete candidate.', 'error');
          this.isLoading = false;
        }
      });
    });
  }

  // Edit candidate - shows the edit modal in page (re-using bootstrap modals)
  editCandidate(candidate: any) {
    this.selectedCandidate = { ...candidate, userId: this.userId };
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      this.editModalInstance = new bootstrap.Modal(modalElement);
      this.editModalInstance.show();
    }
     this.openEditModal();
  }

  updateCandidate() {
    if (!this.selectedCandidate?.id) {
      Swal.fire('Error', 'Candidate ID missing.', 'error');
      return;
    }
    this.selectedCandidate.userId = this.userId;
    this.isLoading = true;
    this.service.vendorUpdate(this.selectedCandidate.id, this.selectedCandidate).subscribe({
      next: () => {
        Swal.fire('Updated!', 'Candidate updated successfully.', 'success');
        if (this.editModalInstance) this.editModalInstance.hide();
        this.loadVendors();
        this.closeEditModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to update candidate.', 'error');
        this.isLoading = false;
      }
    });
  }

  // Mail flow (kept from your original)
  handleSelectCandidateSend() {
    const selected = Array.from(this.selectedCandidates).filter(c => this.vendorList.includes(c));
    if (selected.length === 0) {
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

vendorSendMail() {
  const sourceList = this.selectionMode === 'all'
    ? this.vendorList
    : Array.from(this.selectedCandidates);

  if (sourceList.length === 0) {
    Swal.fire('Error', 'No candidates selected.', 'error');
    return;
  }

  if (!this.mailSubject?.trim()) {
    Swal.fire('Error', 'Subject is required.', 'error');
    return;
  }

  // ✅ Use mailBody as base (it already includes greeting + signature)
  let baseMailBody = this.mailBody;

  // 🟢 Replace placeholder {{name}} with actual first name per vendor
  this.isLoading = true;
  let successCount = 0;
  let failCount = 0;

  const sendNext = (index: number) => {
    if (index >= sourceList.length) {
      this.isLoading = false;
      Swal.fire('Done', `Mails sent: ${successCount}, Failed: ${failCount}`, 'success');
      this.closeMailModal();
      return;
    }

    const vendor = sourceList[index];
    const firstName = vendor?.name?.split(' ')[0] || 'there';
    const personalizedBody = baseMailBody.replace(/{{\s*name\s*}}/gi, firstName);

    const payload: any = {
      mailSubject: this.mailSubject,
      emails: [vendor.email],
      mailBody: personalizedBody,
      type: 'immediate',
    };

    if (this.scheduleDate && this.scheduleTime) {
      const { time, period } = this.convertTo12HourWithPeriod(this.scheduleTime);
      payload.date = this.scheduleDate;
      payload.time = time;
      payload.period = period;
      payload.type = 'scheduled';
    }

    this.service.vendorSendMail(payload).subscribe({
      next: () => {
        successCount++;
        sendNext(index + 1);
      },
      error: (err) => {
        console.error(`Mail failed for ${vendor.email}`, err);
        failCount++;
        sendNext(index + 1);
      },
    });
  };

  sendNext(0);
}




mailTemplateBody: string = '';
userSignature: string = '';
previewMailBody: string = '';
staticSignature: string = '';
openMailModal(vendor?: any) {
  this.showMailModal = true;

  // 🟢 Lock your signature once here
  this.staticSignature = this.userSignature; // store fixed copy

  // Pick one name for preview
  let firstName = 'there';
  if (vendor) {
    firstName = vendor?.name?.split(' ')[0] || 'there';
  } else if (this.selectedCandidates.size > 0) {
    const firstSelected = Array.from(this.selectedCandidates)[0];
    firstName = firstSelected?.name?.split(' ')[0] || 'there';
  }

  const greetingPlaceholder = `Hello {{name}},<br><br>`;
  const signatureBlock = `<br><br>${this.staticSignature}`;

  // 🟢 Compose new body
  const body = this.mailTemplateBody || this.mailBody || '';
  this.mailBody = `${greetingPlaceholder}${body}${signatureBlock}`;

  // 🟢 Preview version
  this.previewMailBody = this.mailBody.replace(/{{\s*name\s*}}/gi, firstName);
}


saveAsDraft() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    Swal.fire('Error', 'User information not found. Please log in again.', 'error');
    return;
  }

  const currentUser = JSON.parse(storedUser);

  const selectedEmails = this.selectionMode === 'all'
    ? this.vendorList.map((v: any) => v.email)
    : Array.from(this.selectedCandidates).map((v: any) => v.email);

  // 🟢 Ensure we save full body (with greeting + signature)
  const bodyToSave = this.previewMailBody || this.mailBody || '';

  const payload: any = {
    mailSubject: this.mailSubject || '',
    emails: selectedEmails || [],
    mailBody: bodyToSave,
    type: 'draft',
    userEmail: currentUser.email,
    userName: currentUser.name,
    userId: currentUser.userId
  };

  const isScheduled = this.scheduleDate && this.scheduleTime;
  if (isScheduled) {
    const { time, period } = this.convertTo12HourWithPeriod(this.scheduleTime);
    payload.date = this.scheduleDate;
    payload.time = time;
    payload.period = period;
  }

  this.isLoading = true;
  this.service.vendorSendMail(payload).subscribe({
    next: () => {
      Swal.fire('Saved!', 'Draft saved successfully!', 'success');
        this.closeMailModal();
      this.resetMailModal();

      const modalEl = document.getElementById('mailModal');
      if (modalEl) {
        const m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        m.hide();
      }
      this.getDraftData();
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'Failed to save draft.', 'error');
    },
    complete: () => (this.isLoading = false),
  });
}



  resetMailModal() {
    this.mailSubject = '';
    this.mailBody = '';
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.schedulePeriod = 'AM';
    this.selectedCandidates.clear();
  }

  getDraftData() {
    const targetType = 'vendor';
    this.service.getDrafts(targetType).subscribe({
      next: (res) => {
        this.draftList = res || [];
      },
      error: (err) => console.error('Error fetching drafts:', err)
    });
  }

 loadDraft(draft: any) {
  this.mailSubject = draft.mailSubject || '';
  this.mailBody = draft.mailBody || '';
  this.previewMailBody = draft.mailBody || ''; // 🟢 also update preview for editor
  this.scheduleDate = draft.date || '';

  if (draft.time && draft.period) {
    this.scheduleTime = this.convertTo24Hour(draft.time, draft.period);
    this.schedulePeriod = draft.period;
  } else {
    this.scheduleTime = '';
    this.schedulePeriod = 'AM';
  }

  this.selectedCandidates = new Set(draft.emails || []);
  this.selectionMode = 'selected';
  Swal.fire('Loaded!', 'Draft loaded successfully.', 'success');
}

 openDraftInMail(draft: any) {
  this.loadDraft(draft);

  // 🟢 Replace {{name}} with preview name
  let firstName = 'there';
  if (this.selectedCandidates.size > 0) {
    const firstSelected = Array.from(this.selectedCandidates)[0];
    if (typeof firstSelected === 'object' && firstSelected.name) {
      firstName = firstSelected.name.split(' ')[0];
    }
  }

  this.previewMailBody = this.mailBody.replace(/{{\s*name\s*}}/gi, firstName);

  const modalElement = document.getElementById('mailModal');
  if (modalElement) new bootstrap.Modal(modalElement).show();
}


  convertTo12HourWithPeriod(time24: string) {
    const [hourStr, minute] = time24.split(':');
    let hours = parseInt(hourStr, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return { time: `${hours}:${minute.padStart(2, '0')}`, period };
  }

  convertTo24Hour(time12: string, period: string) {
    let [hours, minutes] = time12.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Back to users list
  backToUsers() {
    this.router.navigate(['/vendors/by-user']);
  }

showMailModal = false;
showEditModal = false;



closeMailModal() {
  this.showMailModal = false;
  this.mailSubject = '';
  this.mailBody = '';
  this.mailTemplateBody = '';
  this.selectedCandidates.clear(); 
  this.loadVendors();
}


openEditModal() {
  this.showEditModal = true;
}

closeEditModal() {
  this.showEditModal = false;

  this.mailSubject = '';
  this.mailBody = '';
  this.mailTemplateBody = '';
}
  
}