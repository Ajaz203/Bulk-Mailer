import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
    selector: 'app-dashboard-world-map',
    templateUrl: './dashboard-world-map.component.html',
    styleUrl: './dashboard-world-map.component.scss',
    imports: [GoogleMapsModule]
})

export class DashboardWorldMapComponent {

  public mapOptions: google.maps.MapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 1
  };

}
