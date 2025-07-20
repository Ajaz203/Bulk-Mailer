import { Component, Input } from '@angular/core';
import { restaurantOrders } from '../../../../shared/interface/restaurant';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-restaurant-order-menu-item',
    templateUrl: './restaurant-order-menu-item.component.html',
    styleUrl: './restaurant-order-menu-item.component.scss',
    imports: [NgClass, DecimalPipe]
})
export class RestaurantOrderMenuItemComponent {

  @Input() restaurantOrders: restaurantOrders[];

}
