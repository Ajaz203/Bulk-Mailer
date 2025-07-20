import { Component } from '@angular/core';
import { reviewDetails } from '../../shared/interface/review';
import { ReviewService } from '../../shared/services/review.service';
import { NgbRatingConfig, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../shared/components/ui/pagination/pagination.component';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrl: './review.component.scss',
    imports: [NgbRating, PaginationComponent]
})
export class ReviewComponent {

  public review: reviewDetails[];

  constructor(private reviewService: ReviewService, private config: NgbRatingConfig){
    this.config.max = 5;
		this.config.readonly = true;

    this.reviewService.review().subscribe(response => {
      this.review = response.review;
    })
  }
}
