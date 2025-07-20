import { Component, Input } from '@angular/core';
import { hotelImages } from '../../../../shared/interface/hotel';
import { HotelService } from '../../../../shared/services/hotel.service';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-hotel-detail',
    templateUrl: './hotel-detail.component.html',
    styleUrl: './hotel-detail.component.scss',
    imports: [CarouselModule]
})
export class HotelDetailComponent {

  @Input() type: string;
  @Input() images: hotelImages[];

  public options = {
    loop: false,
    nav: false,
    dots: true,
    margin: 20,
    responsive: {
      0: {
        items: 1
      },
      416: {
        items: 2
      },
      506: {
        items: 3
      },
      700: {
        items: 4
      }
    }
  }
}
