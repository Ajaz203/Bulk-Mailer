import { Component, HostListener, Input } from '@angular/core';
import { restaurantOrders } from '../../../../shared/interface/restaurant';
import { RestaurantOrderMenuItemComponent } from '../restaurant-order-menu-item/restaurant-order-menu-item.component';
import { RestaurantOrderMenuComponent } from '../restaurant-order-menu/restaurant-order-menu.component';

@Component({
    selector: 'app-restaurant-order',
    templateUrl: './restaurant-order.component.html',
    styleUrl: './restaurant-order.component.scss',
    imports: [RestaurantOrderMenuComponent, RestaurantOrderMenuItemComponent]
})
export class RestaurantOrderComponent {

  @Input() restaurantOrders: restaurantOrders[];

  public isStuck: boolean = false;
  public isNotStuck: boolean = false;

  @HostListener('window: scroll', [])
  onWindowScroll(){
    let number = window.pageYOffset || 0;
    if (number > 270) {
      this.isStuck = true;
      this.isNotStuck = false;
    }else {
      this.isStuck = false
    }if(number > 3600){
      this.isNotStuck = true;
      this.isStuck = false;
    }
  }
}
