import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-vendor-candidate-list',
  imports: [NgbPaginationModule,CommonModule],
  templateUrl: './vendor-candidate-list.component.html',
  styleUrl: './vendor-candidate-list.component.css'
})
export class VendorCandidateListComponent {

  constructor(private emailService: EmailService) { };

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

// on page change, update signal
onPageChange(newPage: number) {
  this.page.set(newPage);
}

paginated = computed(() =>
  this._candidates().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize)
);

  toggleSelection(index: number) {
    // console.log('toggleSelection is called')
    const selected = this.selected();
    selected.has(index) ? selected.delete(index) : selected.add(index);
    this.selected.set(new Set(selected));
    console.log(this.selected)
  }

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


  // clearSelection() {
  //   console.log("clearSelection is called")
  //   this.selected.set(new Set());
  //   console.log(this.selected)

  // }

  sendSelected() {
    console.log("sendSelected is called")

    const selectedData = Array.from(this.selected()).map(i => this.candidates[i]);

    if (selectedData.length) {
      this.emailService.sendBulkEmail(selectedData).subscribe({
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
      this.emailService.sendBulkEmail(this.candidates).subscribe({
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
}
