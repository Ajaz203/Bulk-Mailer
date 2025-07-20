import { Component } from '@angular/core';
import { gallery } from '../../../shared/interface/restaurant';
import { cabDetail } from '../../../shared/interface/cab';
import { CabService } from '../../../shared/services/cab.service';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-car-detail',
    templateUrl: './car-detail.component.html',
    styleUrl: './car-detail.component.scss',
    imports: [CarouselModule]
})
export class CarDetailComponent {

  public cabImages: gallery[];
  public cabDetails: cabDetail[];

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

  constructor(private cabService: CabService) {
    this.cabService.cab().subscribe(response => {
      this.cabImages = response.cabImages;
      this.cabDetails = response.cabDetails;
    })
  }
}
