import { Component, Input } from '@angular/core';
import { hotelLocation } from '../../../../shared/interface/hotel';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-hotel-location',
    templateUrl: './hotel-location.component.html',
    styleUrl: './hotel-location.component.scss',
})
export class HotelLocationComponent {

  @Input() hotelLocation: hotelLocation;

  constructor(public sanitizer: DomSanitizer) {}

  safe(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
