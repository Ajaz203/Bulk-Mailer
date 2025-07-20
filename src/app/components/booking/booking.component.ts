import { Component } from '@angular/core';
import { bookingDetails } from '../../shared/interface/booking';
import { BookingService } from '../../shared/services/booking.service';
import { PaginationComponent } from '../../shared/components/ui/pagination/pagination.component';
import { FeatherIconsComponent } from '../../shared/components/ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrl: './booking.component.scss',
    imports: [FeatherIconsComponent, PaginationComponent]
})
export class BookingComponent {

  public booking: bookingDetails[];

  constructor(private bookingService: BookingService){
    this.bookingService.booking().subscribe(response => {
      this.booking = response.booking;
    })
  }
}
