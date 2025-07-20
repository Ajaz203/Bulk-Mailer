import { Component } from '@angular/core';
import { category } from '../../../shared/interface/tours';
import { ToursService } from '../../../shared/services/tours.service';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-tour-package',
    templateUrl: './tour-package.component.html',
    styleUrl: './tour-package.component.scss',
    imports: [RouterLink, FeatherIconsComponent, PaginationComponent]
})
export class TourPackageComponent {

  public tourCategory: category[];

  constructor(private tourService: ToursService){
    this.tourService.tour().subscribe(response => {
        this.tourCategory = response.tours;
    })
  }
}
