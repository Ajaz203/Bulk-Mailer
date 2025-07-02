import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../services/bulk-email.service';

@Component({
  selector: 'app-all-mails',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private service: EmailService) {}

  ngOnInit(): void {
    this.viewMail();
  }

  viewMail() {
    this.isLoading = true;
    this.service.getSentMails({}).subscribe(
  (res: any) => {
    const mails: any[] = res as any[];
    this.allMails = mails || [];
    this.candidateMails = mails.filter(mail => mail.targetType === 'candidate');
    this.vendorMails = mails.filter(mail => mail.targetType === 'vendor');
    this.updateSentMails();
    this.isLoading = false;
  },
  (err) => {
    console.error('Error fetching mails:', err);
    this.allMails = [];
    this.candidateMails = [];
    this.vendorMails = [];
    this.sentMails = [];
    this.isLoading = false;
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
