import { Component, EventEmitter, Output } from '@angular/core';
import { tourTab } from '../../../../shared/data/data/tour';

@Component({
    selector: 'app-tour-tab',
    templateUrl: './tour-tab.component.html',
    styleUrl: './tour-tab.component.scss',

})
export class TourTabComponent {

  @Output() tabValue = new EventEmitter<string>();

  public tourTab = tourTab;
  public activeTab = "highlight";

  getTabValue(value: string){
    this.activeTab = value;

    this.tabValue.emit(this.activeTab)
  }
}
