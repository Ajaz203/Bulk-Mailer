import { Component } from '@angular/core';
// import { headerNotification } from '../../../data/data/header';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    imports: [FeatherIconsComponent]
})

export class NotificationComponent {

  // public headerNotification = headerNotification;

  public isActive: boolean = false;

  toggle(){
    this.isActive =! this.isActive;
  }

}
