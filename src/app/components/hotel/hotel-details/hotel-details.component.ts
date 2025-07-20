import { Component } from '@angular/core';
import { HotelService } from '../../../shared/services/hotel.service';
import { hotel, hotelDetail } from '../../../shared/interface/hotel';
import { HotelPolicyComponent } from './hotel-policy/hotel-policy.component';
import { HotelReviewComponent } from './hotel-review/hotel-review.component';
import { HotelLocationComponent } from './hotel-location/hotel-location.component';
import { HotelFacilityComponent } from './hotel-facility/hotel-facility.component';
import { HotelRoomsComponent } from './hotel-rooms/hotel-rooms.component';
import { HotelAboutComponent } from './hotel-about/hotel-about.component';
import { HotelTabComponent } from './hotel-tab/hotel-tab.component';
import { HotelDetailComponent } from './hotel-detail/hotel-detail.component';

@Component({
    selector: 'app-hotel-details',
    templateUrl: './hotel-details.component.html',
    styleUrl: './hotel-details.component.scss',
    imports: [HotelDetailComponent, HotelTabComponent, HotelAboutComponent, HotelRoomsComponent, HotelFacilityComponent, HotelLocationComponent, HotelReviewComponent, HotelPolicyComponent]
})
export class HotelDetailsComponent {

  public hotel: hotel;
  public hotelDetails: hotelDetail;
  public activeTab = 'rooms';

  constructor(private hotelService: HotelService){
    this.hotelService.hotel().subscribe(response => {
      this.hotel = response;
    })
  }

  getTabValue(value: string){
    this.activeTab = value;
  }
}
