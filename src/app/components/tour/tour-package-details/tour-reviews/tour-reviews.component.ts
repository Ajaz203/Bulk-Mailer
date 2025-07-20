import { Component, Input } from '@angular/core';
import { tourReview } from '../../../../shared/interface/tours';

@Component({
    selector: 'app-tour-reviews',
    templateUrl: './tour-reviews.component.html',
    styleUrl: './tour-reviews.component.scss',

})
export class TourReviewsComponent {

  @Input() review: tourReview[];

}
