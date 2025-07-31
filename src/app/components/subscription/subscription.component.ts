import { Component } from '@angular/core';
import { reviewDetails } from '../../shared/interface/review';
import { ReviewService } from '../../shared/services/review.service';
import { NgbRatingConfig, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../shared/components/ui/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-review',
    templateUrl: './subscription.component.html',
    styleUrl: './subscription.component.scss',
    imports: [FormsModule]
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

   customUsers: number = 10;

  calculateCustomPrice(): number {
    const basePrice = 999;
    const additionalUsers = Math.max(this.customUsers - 10, 0);
    return basePrice + additionalUsers * 100;
  }

  selectCustomPlan() {
    const totalPrice = this.calculateCustomPrice();
    const planDetails = {
      plan: 'Custom',
      admin: 1,
      users: this.customUsers,
      price: totalPrice
    };

    console.log('Custom Plan Selected:', planDetails);
    // Call backend API or open payment gateway here
  }
}
