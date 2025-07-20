import { Component, HostListener, Input } from '@angular/core';
import { restaurantOrders } from '../../../../shared/interface/restaurant';

@Component({
    selector: 'app-restaurant-order-menu',
    templateUrl: './restaurant-order-menu.component.html',
    styleUrl: './restaurant-order-menu.component.scss',
})
export class RestaurantOrderMenuComponent {

  @Input() restaurantOrders: restaurantOrders[];

  public activeTab = 'bites';
  public activeChild = '';

  @HostListener('window: scroll', [])
  onWindowScroll(){
    let number = window.pageYOffset || 0;

    if(number <= 765){
      this.activeTab = 'bites';
    }if(number >= 1450){
      this.activeTab = 'sandwich';
    }if(number >= 1650){
      this.activeTab = 'pizza';
    }if(number >= 1815){
      this.activeTab = 'combo';
    }if(number >= 2135){
      this.activeTab = 'deserts';
    }
    // Active child
    if(number >= 200){
      this.activeChild = 'chips';
    }if(number >= 560){
      this.activeChild = 'salad';
    }if(number >= 825){
      this.activeChild = 'fries';
    }if(number >= 1100){
      this.activeChild = 'sticks';
    }if(number >= 1260){
      this.activeChild = 'bread';
    }if(number >= 2180){
      this.activeChild = 'cheesecakes';
    }if(number >= 2350){
      this.activeChild = 'lime';
    }if(number >= 2500){
      this.activeChild = 'cream';
    }if(number >= 2770){
      this.activeChild = 'pudding';
    }
    if(number < 270){
      this.activeChild = '';
    }
  }

  setPage(value: string) {
    document.getElementById(value)?.scrollIntoView({ behavior: 'smooth' });
    this.activeTab = value;
    this.activeChild = value;
  }
}
