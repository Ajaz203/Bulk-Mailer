import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule,FormsModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit{
  dataArr:any=[]


  constructor(private service: EmailService) {}
 ngOnInit(){
  this.getData();
  this.service.refreshTable$.subscribe(() => {
    this.getData(); // function to reload your data
  });
  //  this.getData();
 }
  
 getData(){
  this.service.getCandidateData({}).subscribe((resp:any)=>{
    console.log("get condidate resp ",resp)
    this.dataArr=resp;
  })
 }

scheduleDate: any = '';
scheduleTime: any = '';
schedulePeriod: any = 'AM';
 selectedCandidates = new Set<any>();

// Toggle single selection
toggleSelection(candidate: any) {
  if (this.selectedCandidates.has(candidate)) {
    this.selectedCandidates.delete(candidate);
  } else {
    this.selectedCandidates.add(candidate);
  }
}

// Toggle all selection
toggleSelectAll(event: any) {
  if (event.target.checked) {
    this.dataArr.forEach((candidate: any) => this.selectedCandidates.add(candidate));
  } else {
    this.selectedCandidates.clear();
  }
}

// Check if all selected
isAllSelected() {
  return this.dataArr.length > 0 && this.selectedCandidates.size === this.dataArr.length;
}

// Send single candidate
sendSingle(candidate: any) {
  console.log('Sending single candidate:', candidate);
  // your API call here
}

// Send selected candidates
sendSelected() {
  if (this.selectedCandidates.size === 0) {
    alert('Please select at least one candidate');
    return;
  }
  console.log('Sending selected candidates:', Array.from(this.selectedCandidates));
  // your API call here
}

// Send all candidates
sendAll() {
  console.log('Sending all candidates:', this.dataArr);
  // your API call here
}


mailContent: any = '';
mailSubject: any = '';
mailDescription: any = '';


sendMail() {
  console.log('Sending Mail');
  console.log('Mail Content:', this.mailContent);
  console.log('Schedule:', this.scheduleDate, this.scheduleTime, this.schedulePeriod);
  // Add API call to send mail here
}

saveAsDraft() {
  console.log('Saving as Draft');
  console.log('Mail Content:', this.mailContent);
  console.log('Schedule:', this.scheduleDate, this.scheduleTime, this.schedulePeriod);
  // Add API call to save as draft
}

}
