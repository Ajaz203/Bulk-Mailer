import { Component, Input } from '@angular/core';
import { hotelReview } from '../../../../shared/interface/hotel';
import { NgbRatingConfig, NgbRating } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-hotel-review',
    templateUrl: './hotel-review.component.html',
    styleUrl: './hotel-review.component.scss',
    imports: [NgbRating]
})
export class HotelReviewComponent {

  @Input() hotelReview: hotelReview[];

  constructor(private config: NgbRatingConfig) {
		this.config.max = 5;
		this.config.readonly = true;
	}
}
