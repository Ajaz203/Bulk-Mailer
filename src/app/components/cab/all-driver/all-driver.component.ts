import { Component } from '@angular/core';
import { cabDrivers } from '../../../shared/interface/cab';
import { CabService } from '../../../shared/services/cab.service';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-all-driver',
    templateUrl: './all-driver.component.html',
    styleUrl: './all-driver.component.scss',
    imports: [RouterLink, FeatherIconsComponent, PaginationComponent]
})
export class AllDriverComponent {

  public drivers: cabDrivers[];

  constructor(private cabService: CabService){
    this.cabService.cab().subscribe(response => {
      this.drivers = response.cabDrivers;
    })
  }
}
