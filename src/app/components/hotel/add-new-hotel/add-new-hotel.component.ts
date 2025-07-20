import { Component } from '@angular/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { TagInputModule } from 'ngx-chips';
import { addHotelDetails } from '../../../shared/interface/hotel';
import { HotelService } from '../../../shared/services/hotel.service';
import { RoomDetailsComponent } from './room-details/room-details.component';

@Component({
    selector: 'app-add-new-hotel',
    templateUrl: './add-new-hotel.component.html',
    styleUrl: './add-new-hotel.component.scss',
    imports: [TagInputModule, OwlDateTimeModule, OwlNativeDateTimeModule, RoomDetailsComponent]
})

export class AddNewHotelComponent {

  public addHotelDetails: addHotelDetails[];

  constructor(private hotelService: HotelService){
    this.hotelService.hotel().subscribe(response => {
      this.addHotelDetails = response.addHotelDetails;
    })
  }

}
