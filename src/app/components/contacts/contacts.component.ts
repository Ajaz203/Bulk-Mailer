import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-contacts',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  contacts: any[] = [];

  constructor(private service: UserService, private titleService: Title) { 
    this.titleService.setTitle('MailCept-Enquiries');
  }


    ngOnInit(): void {
    this.getAllContacts();
  }

  getAllContacts() {
    this.service.allcontacts().subscribe((res: any) => {
      if (res && res.data) {
        this.contacts = res.data;
      }
    });
  }
}
