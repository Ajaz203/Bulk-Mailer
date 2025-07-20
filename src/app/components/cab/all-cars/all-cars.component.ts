import { Component } from '@angular/core';
import { cabs } from '../../../shared/interface/cab';
import { CabService } from '../../../shared/services/cab.service';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-all-cars',
    templateUrl: './all-cars.component.html',
    styleUrl: './all-cars.component.scss',
    imports: [RouterLink, FeatherIconsComponent, PaginationComponent]
})
export class AllCarsComponent {

  public cabs: cabs[];

  constructor(private cabService: CabService){
    this.cabService.cab().subscribe(response => {
      this.cabs = response.cab;
    })
  }
}
