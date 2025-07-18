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
  filterByStatus(status: 'success' | 'failed') {
    this.currentStatusFilter = status;
    const baseArray = this.targetType === 'candidate' ? this.candidateMails : this.vendorMails;
    this.sentMails = baseArray.filter(
      mail => mail.status?.trim().toLowerCase() === status
    );
    this.isFilterApplied = true;
    this.cdr.detectChanges();
  }

  resetFilter() {
    this.currentStatusFilter = 'all';
    this.isFilterApplied = false;
    this.updateSentMails();
    this.cdr.detectChanges();
  }

viewMail() {
  const payload = {
    page: this.page,
    limit: this.pageSize
  };

  if (this.showInitialLoader) this.isLoading = true;

  this.service.getSentMails(payload).subscribe(
    (res: any) => {
      const mails = res?.data || [];

      // Separate based on targetType
      this.candidateMails = mails.filter((mail: { targetType: string; }) => mail.targetType === 'candidate');
      this.vendorMails = mails.filter((mail: { targetType: string; }) => mail.targetType === 'vendor');

      // Update UI mail list based on current tab
      this.updateSentMails();

      this.totalRecords = res.total || 0;
      this.isLoading = false;
      this.showInitialLoader = false;
      this.cdr.detectChanges();
    },
    (err) => {
      console.error('Error fetching mails:', err);
      this.candidateMails = [];
      this.vendorMails = [];
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
      this.searchText = '';
      this.updateSentMails();
      if (this.searchText?.trim()) this.searchMails();
    }
  }

  updateSentMails() {
    this.sentMails =
      this.targetType === 'candidate' ? [...this.candidateMails] : [...this.vendorMails];
  }

  searchMails() {
    const search = this.searchText.trim().toLowerCase();
    const baseArray =
      this.targetType === 'candidate' ? this.candidateMails : this.vendorMails;

    if (search) {
      this.sentMails = baseArray.filter(
        (mail) =>
          mail.mailSubject?.toLowerCase().includes(search) ||
          mail.email?.toLowerCase().includes(search)
      );
    } else {
      this.sentMails = [...baseArray];
    }
  }
}
