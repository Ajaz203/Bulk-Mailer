import { Component } from '@angular/core';
import { WebHeaderComponent } from '../web-header/web-header.component';
import { WebFooterComponent } from '../web-footer/web-footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink,WebHeaderComponent,WebFooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}
