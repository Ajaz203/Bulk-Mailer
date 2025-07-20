import { Component, Input } from '@angular/core';
import { tourLocation } from '../../../../shared/interface/tours';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-tour-location',
    templateUrl: './tour-location.component.html',
    styleUrl: './tour-location.component.scss',

})
export class TourLocationComponent {

  @Input() location: tourLocation;

  constructor(public sanitizer: DomSanitizer) {}

  safe(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
