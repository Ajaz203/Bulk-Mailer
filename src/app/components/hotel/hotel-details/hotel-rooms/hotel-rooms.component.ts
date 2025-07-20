import { Component, Input } from '@angular/core';
import { hotelRooms } from '../../../../shared/interface/hotel';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-hotel-rooms',
    templateUrl: './hotel-rooms.component.html',
    styleUrl: './hotel-rooms.component.scss',
    imports: [RouterLink]
})
export class HotelRoomsComponent {

  @Input() hotelRooms: hotelRooms[];

}
