import { Component } from '@angular/core';
import { restaurant } from '../../../shared/interface/restaurant';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { RestaurantReviewComponent } from './restaurant-review/restaurant-review.component';
import { RestaurantLocationComponent } from './restaurant-location/restaurant-location.component';
import { RestaurantGalleryComponent } from './restaurant-gallery/restaurant-gallery.component';
import { RestaurantOverviewComponent } from './restaurant-overview/restaurant-overview.component';
import { RestaurantOrderComponent } from './restaurant-order/restaurant-order.component';
import { RestaurantTabsComponent } from './restaurant-tabs/restaurant-tabs.component';

@Component({
    selector: 'app-restaurant-details',
    templateUrl: './restaurant-details.component.html',
    styleUrl: './restaurant-details.component.scss',
    imports: [RestaurantTabsComponent, RestaurantOrderComponent, RestaurantOverviewComponent, RestaurantGalleryComponent, RestaurantLocationComponent, RestaurantReviewComponent]
})
export class RestaurantDetailsComponent {

  public activeTab = 'order';

  public restaurantDetails: restaurant;

  constructor(private restaurantService: RestaurantService) {
    this.restaurantService.restaurant().subscribe(response => {
      this.restaurantDetails = response;
    })
  }

  getTabValue(value: string){
    this.activeTab = value;
  }
}
