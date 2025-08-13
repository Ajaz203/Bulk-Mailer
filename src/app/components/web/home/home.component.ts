import { Component } from '@angular/core';
import { WebHeaderComponent } from '../web-header/web-header.component';
import { WebFooterComponent } from '../web-footer/web-footer.component';
import { RouterLink } from '@angular/router';
import { WebPackagesComponent } from "../web-packages/web-packages.component";

@Component({
  selector: 'app-home',
  imports: [WebHeaderComponent, WebFooterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
