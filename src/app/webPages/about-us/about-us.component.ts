import { Component } from '@angular/core';
import { WebHeaderComponent } from '../web-header/web-header.component';
import { WebfooterComponent } from '../webfooter/webfooter.component';

@Component({
  selector: 'app-about-us',
  imports: [WebHeaderComponent,WebfooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
