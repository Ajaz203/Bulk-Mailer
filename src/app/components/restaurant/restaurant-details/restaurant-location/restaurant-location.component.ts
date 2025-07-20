import { Component, Input } from '@angular/core';
import { tourLocation } from '../../../../shared/interface/tours';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-restaurant-location',
    templateUrl: './restaurant-location.component.html',
    styleUrl: './restaurant-location.component.scss',
})
export class RestaurantLocationComponent {

  @Input() restaurantLocation: tourLocation;

  constructor(public sanitizer: DomSanitizer) {}

  safe(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
