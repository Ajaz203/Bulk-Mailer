import { Routes } from '@angular/router';
import { AddNewHotelComponent } from './add-new-hotel/add-new-hotel.component';
import { AllHotelComponent } from './all-hotel/all-hotel.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';

export default [
  {
    path: 'all-hotels',
    component: AllHotelComponent
  },
  {
    path: 'hotel-detail',
    component: HotelDetailsComponent
  },
  {
    path: 'add-new-hotel',
    component: AddNewHotelComponent
  }
] as Routes;
