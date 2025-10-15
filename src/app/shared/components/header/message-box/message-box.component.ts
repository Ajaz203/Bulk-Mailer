import { Component } from '@angular/core';

import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-message-box',
    templateUrl: './message-box.component.html',
    styleUrl: './message-box.component.scss',
    imports: []
})
export class MessageBoxComponent {

 

  public isActive: boolean = false;

  toggle(){
    this.isActive =! this.isActive;
  }

}
