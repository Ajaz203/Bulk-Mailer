import { Component, Input } from '@angular/core';
import { tourPolicy } from '../../../../shared/interface/tours';

@Component({
    selector: 'app-tour-policy',
    templateUrl: './tour-policy.component.html',
    styleUrl: './tour-policy.component.scss',

})
export class TourPolicyComponent {

  @Input() policy: tourPolicy[];

}
