import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModalComponent } from './logout-modal/logout-modal.component';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  imports: [FeatherIconsComponent]
})
export class UserProfileComponent {
  userName: any;
  userEmail: any;

  constructor(private modal: NgbModal, private userService: UserService) { }

  public isActive: boolean = false;
  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      if (user) {
        this.userName = user.name;
        this.userEmail = user.email;
      }
    });
  }
  toggle() {
    this.isActive = !this.isActive;
  }

  logout() {
    this.modal.open(LogoutModalComponent, { centered: true, }),
      localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
