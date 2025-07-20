import { Component } from '@angular/core';
import { tourPackageDetail } from '../../../shared/interface/tours';
import { ToursService } from '../../../shared/services/tours.service';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-tour-package-categories',
    templateUrl: './tour-package-categories.component.html',
    styleUrl: './tour-package-categories.component.scss',
    imports: [RouterLink, FeatherIconsComponent, PaginationComponent]
})
export class TourPackageCategoriesComponent {

  public packageDetail: tourPackageDetail[];

  constructor(private tourService: ToursService){
    this.tourService.tour().subscribe(response => {
        this.packageDetail = response.tourPackageDetail;
    })
  }
}
