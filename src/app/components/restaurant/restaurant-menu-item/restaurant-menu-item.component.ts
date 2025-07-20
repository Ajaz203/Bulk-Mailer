import { Component } from '@angular/core';
import { menuItem } from '../../../shared/interface/restaurant';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-restaurant-menu-item',
    templateUrl: './restaurant-menu-item.component.html',
    styleUrl: './restaurant-menu-item.component.scss',
    imports: [RouterLink, FeatherIconsComponent, PaginationComponent]
})
export class RestaurantMenuItemComponent {

  public menuItem: menuItem[];

  constructor(private restaurantService: RestaurantService){
    this.restaurantService.restaurant().subscribe(response => {
      this.menuItem = response.menuItem;
    })
  }
}
