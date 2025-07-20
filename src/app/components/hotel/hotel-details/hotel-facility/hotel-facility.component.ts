import { Component, Input } from '@angular/core';
import { hotelFacility } from '../../../../shared/interface/hotel';

@Component({
    selector: 'app-hotel-facility',
    templateUrl: './hotel-facility.component.html',
    styleUrl: './hotel-facility.component.scss',
})
export class HotelFacilityComponent {

  @Input() hotelFacility: hotelFacility[];
}
