import { Component } from '@angular/core';
import { restaurants } from '../../../shared/interface/restaurant';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-all-restaurant',
    templateUrl: './all-restaurant.component.html',
    styleUrl: './all-restaurant.component.scss',
    imports: [RouterLink, FeatherIconsComponent, PaginationComponent]
})
export class AllRestaurantComponent {

  public restaurant: restaurants[];

  constructor(private restaurantService: RestaurantService){
    this.restaurantService.restaurant().subscribe(response => {
      this.restaurant = response.restaurant;
    })
  }
}
