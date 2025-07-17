import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/bulk-email.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private service: EmailService,  private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.viewMail();
    this.refreshInterval = setInterval(() => this.viewMail(), 5000);
  }
  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }
  page = 1;
pageSize = 10;

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
  if (this.showInitialLoader) this.isLoading = true;

  this.service.getSentMails({}).subscribe(
    (res: any) => {
      const mails: any[] = res || [];
      this.allMails = mails;
      this.originalMails = mails;

      this.candidateMails = mails.filter(mail => mail.targetType === 'candidate');
      this.vendorMails = mails.filter(mail => mail.targetType === 'vendor');

      if (!this.isFilterApplied) {
        this.updateSentMails();
      }

      if (this.showInitialLoader) {
        this.isLoading = false;
        this.showInitialLoader = false; 
      }

      this.cdr.detectChanges();
    },
    (err) => {
      console.error('Error fetching mails:', err);
      this.allMails = [];
      this.candidateMails = [];
      this.vendorMails = [];
      this.sentMails = [];
      this.isLoading = false;
      this.showInitialLoader = false;
      this.cdr.detectChanges();
    }
  );
}


  switchTargetType(type: 'candidate' | 'vendor') {
    if (this.targetType !== type) {
      this.targetType = type;
      this.searchText = '';
      this.updateSentMails();
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
