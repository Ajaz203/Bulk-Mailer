import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/bulk-email.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


interface Mail {
  subject: string;
  email: string;
  status: string;
  targetType: 'candidate' | 'vendor';

}

@Component({
  selector: 'app-all-mails',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './all-mails.component.html',
  styleUrls: ['./all-mails.component.css']
})


export class AllMailsComponent implements OnInit {
  allMails: any[] = [];
  candidateMails: any[] = [];
  vendorMails: any[] = [];
  sentMails: any[] = [];
  searchText: string = '';
  targetType: 'candidate' | 'vendor' = 'candidate';
  isLoading = false;
  searchTerm: any;
  refreshInterval: any;
  originalMails: any[] = [];
  isFilterApplied: boolean = false;
  showInitialLoader: boolean = true;
  currentStatusFilter: 'success' | 'failed' | 'all' = 'all';
  page = 1;
  pageSize = 20;
  totalRecords = 0;
  totalPages = 0;

currentPage: number = 1;

totalMails: number = 0;
mails: any[] = [];
  activeTab: any;
  constructor(private service: EmailService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.viewMail();
    this.refreshInterval = setInterval(() => this.viewMail(), 5000);
  }
  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

  get paginatedMails() {
    const start = (this.page - 1) * this.pageSize;
    return this.sentMails.slice(start, start + this.pageSize);
  }
 getFilteredPaginatedMails(): any[] {
  const filtered = this.sentMails
    .filter(mail => mail.targetType === this.targetType)
    .filter(mail => {
      if (!this.searchText) return true;
      const search = this.searchText.toLowerCase();
      return (
        mail.email?.toLowerCase().includes(search) ||
        mail.mailSubject?.toLowerCase().includes(search)
      );
    });

  this.totalRecords = filtered.length;

  const start = (this.page - 1) * this.pageSize;
  return filtered.slice(start, start + this.pageSize);
}


viewMail() {
  const payload = {
    page: this.page,
    limit: this.pageSize,
    targetType: this.targetType,
    status: this.currentStatusFilter !== 'all' ? this.currentStatusFilter : undefined,

  };

  if (this.showInitialLoader) this.isLoading = true;

  this.service.getSentMails(payload).subscribe(
    (res: any) => {
      this.sentMails = res?.data || [];
      this.totalRecords = res?.total || 0;
      this.isLoading = false;
      this.showInitialLoader = false;
      this.cdr.detectChanges();
    },
    (err) => {
      console.error('Error fetching mails:', err);
      this.sentMails = [];
      this.totalRecords = 0;
      this.isLoading = false;
      this.showInitialLoader = false;
      this.cdr.detectChanges();
    }
  );
}


onPageChange(pageNum: number): void {
  this.page = pageNum;
  this.viewMail();
}
switchTargetType(type: 'candidate' | 'vendor') {
  if (this.targetType !== type) {
    this.targetType = type;
    this.page = 1;
    this.viewMail();
  }
}

filterByStatus(status: 'success' | 'failed') {
  this.currentStatusFilter = status;
  this.page = 1;
  this.viewMail();
}

resetFilter() {
  this.currentStatusFilter = 'all';
  this.page = 1;
  this.viewMail();
}

searchMails() {
  this.page = 1;
  this.viewMail();
}

}
