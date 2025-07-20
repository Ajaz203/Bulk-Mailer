import { Component, EventEmitter, Output } from '@angular/core';
import { hotelTabs } from '../../../../shared/data/data/hotel';

@Component({
    selector: 'app-hotel-tab',
    templateUrl: './hotel-tab.component.html',
    styleUrl: './hotel-tab.component.scss',

})
export class HotelTabComponent {

  @Output() tabValue = new EventEmitter<string>();

  public hotelTabs = hotelTabs;
  public activeTab = 'rooms';

  changeTab(value: string){
    this.activeTab = value;

    this.tabValue.emit(this.activeTab)
   }
}
