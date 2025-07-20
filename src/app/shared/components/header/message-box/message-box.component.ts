import { Component } from '@angular/core';
import { headerMessageBox } from '../../../data/data/header';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-message-box',
    templateUrl: './message-box.component.html',
    styleUrl: './message-box.component.scss',
    imports: [FeatherIconsComponent]
})
export class MessageBoxComponent {

  public headerMessageBox = headerMessageBox;

  public isActive: boolean = false;

  toggle(){
    this.isActive =! this.isActive;
  }

}
