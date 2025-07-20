import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModalComponent } from './logout-modal/logout-modal.component';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.scss',
    imports: [FeatherIconsComponent]
})
export class UserProfileComponent {

  constructor(private modal: NgbModal){}

  public isActive: boolean = false;

  toggle(){
    this.isActive =! this.isActive;
  }

  logout(){
    this.modal.open(LogoutModalComponent, { centered: true,})
  }
}
