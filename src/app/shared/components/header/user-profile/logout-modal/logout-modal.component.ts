import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-logout-modal',
    templateUrl: './logout-modal.component.html',
    styleUrl: './logout-modal.component.scss',

})
export class LogoutModalComponent {

  constructor(private modal: NgbActiveModal, private router: Router){}

  closeModal(){
    this.modal.close();
  }

  logout(){
    localStorage.clear();
    this.modal.close();
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 300);
  }
}
