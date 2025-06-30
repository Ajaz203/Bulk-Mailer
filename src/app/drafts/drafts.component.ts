
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmailService } from '../services/bulk-email.service';
@Component({
  selector: 'app-drafts',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.css'
})
export class DraftsComponent {

  draftList: any[] = [];
  isLoading: boolean | undefined;

  constructor(private service: EmailService, private router: Router) {}

  ngOnInit(): void {
    this.getDraftData();
  }

  getDraftData() {
    const targetType = 'candidate';
    this.service.getDrafts(targetType).subscribe({
      next: (res) => {
        this.draftList = res || [];
      },
      error: (err) => {
        console.error('Error fetching drafts:', err);
      }
    });
  }


  loadDraft(draft: any) {
    // You can redirect or populate form elsewhere
    console.log('Load Draft:', draft);
  }

  deleteDraft(draft: any) {
  
  }
  refreshDrafts() {
  this.isLoading = true;
  this.service.getDrafts('candidate').subscribe({
    next: (res) => {
      this.draftList = res || [];
    },
    error: (err) => {
      console.error('Error fetching drafts:', err);
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

}

