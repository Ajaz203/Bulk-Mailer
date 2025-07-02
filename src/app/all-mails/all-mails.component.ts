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
  sentMails: any[] = [];
  searchText: string = '';
  targetType: 'candidate' | 'vendor' = 'candidate';
isLoading = false;
  constructor(private service: EmailService) {}

  ngOnInit(): void {
    this.viewMail();
  }



viewMail() {
  this.isLoading = true;
  const payload = { targetType: this.targetType };
  this.service.getSentMails(payload).subscribe(
    (res: any) => {
      this.allMails = res || [];
      this.sentMails = [...this.allMails];
      this.isLoading = false;
    },
    (err) => {
      console.error('Error fetching mails:', err);
      this.allMails = [];
      this.sentMails = [];
      this.isLoading = false;
    }
  );
}

switchTargetType(type: 'candidate' | 'vendor') {
  if (this.targetType !== type) {
    this.targetType = type;
    this.searchText = '';
    this.viewMail();
  }
}

  searchMails() {
    const search = this.searchText.trim().toLowerCase();
    if (search) {
      this.sentMails = this.allMails.filter(
        (mail) =>
          (mail.mailSubject?.toLowerCase().includes(search)) ||
          (mail.email?.toLowerCase().includes(search))
      );
    } else {
      this.sentMails = [...this.allMails]; 
    }
  }
}
