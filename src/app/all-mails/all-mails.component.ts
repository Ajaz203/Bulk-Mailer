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
  sentMailsAll: any[] = []; 



  constructor(private service: EmailService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.viewMail();
    this.refreshInterval = setInterval(() => this.viewMail(), 5000);
    this.loadSentMails();
  }
  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }
loadSentMails(): void {
  this.service.getSentMails({ page: 1, limit: 1000 }).subscribe((res: any) => {
    this.sentMailsAll = res.data || [];
    this.totalRecords = this.sentMailsAll.length;
    this.searchMails(); 
  });
}


 searchMails(): void {
  const payload = {
    page: this.page,
    limit: this.pageSize,
    searchText: this.searchText.trim()
  };

  this.isLoading = true;
  this.service.getSentMails(payload).subscribe((res: any) => {
    this.isLoading = false;
    this.sentMails = res.data || [];
    this.totalRecords = res.total || 0;
  });
}

  get paginatedMails() {
    const start = (this.page - 1) * this.pageSize;
    return this.sentMails.slice(start, start + this.pageSize);
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


 onPageChange(newPage: number): void {
  this.page = newPage;
  this.searchMails(); // not loadSentMails
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

 

}
