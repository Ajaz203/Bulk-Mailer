import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-logout-modal',
    templateUrl: './logout-modal.component.html',
    styleUrl: './logout-modal.component.scss',
imports: [FormsModule,CommonModule]
})
export class LogoutModalComponent {
isDarkMode = document.body.classList.contains('dark-only'); 
  constructor(private modal: NgbActiveModal, private router: Router){}

  closeModal(){
    this.modal.close();
  }

logout() {
  localStorage.clear();
  this.modal.close();
  const firstAppUrl = 'https://mailcept.net/home'; 

  setTimeout(() => {
    window.location.href = firstAppUrl;
  }, 300);
}

}
