import { Component, Input } from '@angular/core';
import { tourAccommodation } from '../../../../shared/interface/tours';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-tour-accommodation',
    templateUrl: './tour-accommodation.component.html',
    styleUrl: './tour-accommodation.component.scss',
    imports: [RouterLink]
})
export class TourAccommodationComponent {

  @Input() accommodations: tourAccommodation[];

}
