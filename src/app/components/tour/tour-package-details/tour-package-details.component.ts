import { Component } from '@angular/core';
import { tour } from '../../../shared/interface/tours';
import { ToursService } from '../../../shared/services/tours.service';
import { TourPolicyComponent } from './tour-policy/tour-policy.component';
import { TourReviewsComponent } from './tour-reviews/tour-reviews.component';
import { TourLocationComponent } from './tour-location/tour-location.component';
import { TourAccommodationComponent } from './tour-accommodation/tour-accommodation.component';
import { TourGalleryComponent } from './tour-gallery/tour-gallery.component';
import { TourItineraryComponent } from './tour-itinerary/tour-itinerary.component';
import { TourHighlightComponent } from './tour-highlight/tour-highlight.component';
import { TourTabComponent } from './tour-tab/tour-tab.component';

@Component({
    selector: 'app-tour-package-details',
    templateUrl: './tour-package-details.component.html',
    styleUrl: './tour-package-details.component.scss',
    imports: [TourTabComponent, TourHighlightComponent, TourItineraryComponent, TourGalleryComponent, TourAccommodationComponent, TourLocationComponent, TourReviewsComponent, TourPolicyComponent]
})
export class TourPackageDetailsComponent {

  public tourDetail: tour;

  public activeTab = 'highlight';

  constructor(private tourService: ToursService) {
    this.tourService.tour().subscribe(response => {
      this.tourDetail = response;
    })
  }

  getTabValue(value: string){
    this.activeTab = value;
  }
}
