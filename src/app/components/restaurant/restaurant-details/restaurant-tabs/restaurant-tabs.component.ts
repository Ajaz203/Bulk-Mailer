import { Component, EventEmitter, Output } from '@angular/core';
import { restaurantTab } from '../../../../shared/data/data/restaurant';

@Component({
    selector: 'app-restaurant-tabs',
    templateUrl: './restaurant-tabs.component.html',
    styleUrl: './restaurant-tabs.component.scss',
})
export class RestaurantTabsComponent {

  @Output() tabValue = new EventEmitter<string>();

  public restaurantTab = restaurantTab;

  public activeTab = 'order';

  changeTab(value: string){
    this.activeTab = value;
    this.tabValue.emit(this.activeTab);
  }

}
