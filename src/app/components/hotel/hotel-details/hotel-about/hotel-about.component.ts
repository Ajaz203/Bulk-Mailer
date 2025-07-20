import { Component, Input } from '@angular/core';
import { hotelAbout } from '../../../../shared/interface/hotel';

@Component({
    selector: 'app-hotel-about',
    templateUrl: './hotel-about.component.html',
    styleUrl: './hotel-about.component.scss',
})
export class HotelAboutComponent {

  @Input() hotelAbout: hotelAbout[];
}
