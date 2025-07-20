import { Component, Input } from '@angular/core';
import { tourReview } from '../../../../shared/interface/tours';
import { NgbRatingConfig, NgbRating } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-restaurant-review',
    templateUrl: './restaurant-review.component.html',
    styleUrl: './restaurant-review.component.scss',
    imports: [NgbRating]
})
export class RestaurantReviewComponent {

  @Input() restaurantReview: tourReview[];

  constructor(private config: NgbRatingConfig) {
		this.config.max = 5;
		this.config.readonly = true;
	}
}
