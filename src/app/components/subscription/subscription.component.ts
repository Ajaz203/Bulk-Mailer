import { Component } from '@angular/core';
import { reviewDetails } from '../../shared/interface/review';
import { ReviewService } from '../../shared/services/review.service';
import { NgbRatingConfig, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../shared/components/ui/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-review',
    templateUrl: './subscription.component.html',
    styleUrl: './subscription.component.scss',
    imports: [FormsModule,CommonModule]
})
export class ReviewComponent {


}
