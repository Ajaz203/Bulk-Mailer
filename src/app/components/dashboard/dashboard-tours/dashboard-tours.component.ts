import { Component } from '@angular/core';
import { ToursService } from '../../../shared/services/tours.service';
import { category } from '../../../shared/interface/tours';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-dashboard-tours',
    templateUrl: './dashboard-tours.component.html',
    styleUrl: './dashboard-tours.component.scss',
    imports: [CarouselModule]
})
export class DashboardToursComponent {

  public tourCategory: category[];

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
      900: {
        items: 3
      },
      1000: {
        items: 4
      }
    }
  }

  constructor(private tourService: ToursService){
    this.tourService.tour().subscribe(response => {
        this.tourCategory = response.tours;
    })
  }
}
