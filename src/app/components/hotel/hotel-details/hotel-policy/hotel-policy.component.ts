import { Component, Input } from '@angular/core';
import { hotelPolicy } from '../../../../shared/interface/hotel';

@Component({
    selector: 'app-hotel-policy',
    templateUrl: './hotel-policy.component.html',
    styleUrl: './hotel-policy.component.scss',
})
export class HotelPolicyComponent {

  @Input() hotelPolicy: hotelPolicy[];

}
