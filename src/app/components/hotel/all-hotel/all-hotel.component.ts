import { Component } from '@angular/core';
import { hotels } from '../../../shared/interface/hotel';
import { HotelService } from '../../../shared/services/hotel.service';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-all-hotel',
    templateUrl: './all-hotel.component.html',
    styleUrl: './all-hotel.component.scss',
    imports: [RouterLink, FeatherIconsComponent, PaginationComponent]
})
export class AllHotelComponent {

  public hotel: hotels[];

  constructor(private hotelService: HotelService){
    this.hotelService.hotel().subscribe(response => {
      this.hotel = response.hotels;
    })
  }
}
