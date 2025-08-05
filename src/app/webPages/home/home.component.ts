import { Component } from '@angular/core';
import { WebHeaderComponent } from '../web-header/web-header.component';
import { HomeTilesComponent } from '../home-tiles/home-tiles.component';
import { WebfooterComponent } from '../webfooter/webfooter.component';

@Component({
  selector: 'app-home',
  imports: [WebHeaderComponent,HomeTilesComponent,WebfooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
