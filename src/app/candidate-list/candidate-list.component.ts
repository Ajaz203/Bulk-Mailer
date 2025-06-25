import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/bulk-email.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit{
  dataArr:any=[]
  // displayData = [
  //   {
  //     name: "faisal",
  //     email: "mfaisal@mckinsol.com",
  //     contact_no: "9833838383",
  //     alt_contact_no: "9876543212",
  //     category: "Java"
  //   },
  //   {
  //     name: "rahul",
  //     email: "rahul@mckinsol.com",
  //     contact_no: "9123456789",
  //     alt_contact_no: "9988776655",
  //     category: "C#"
  //   },
  //   {
  //     name: "anita",
  //     email: "anita@mckinsol.com",
  //     contact_no: "9345612345",
  //     alt_contact_no: "9456123789",
  //     category: "Java"
  //   },
  //   {
  //     name: "sunil",
  //     email: "sunil@mckinsol.com",
  //     contact_no: "9001122233",
  //     alt_contact_no: "9112233445",
  //     category: "NA"
  //   },
  //   {
  //     name: "priya",
  //     email: "priya@mckinsol.com",
  //     contact_no: "9876501234",
  //     alt_contact_no: "9867543210",
  //     category: "C#"
  //   }
  // ];

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
}
