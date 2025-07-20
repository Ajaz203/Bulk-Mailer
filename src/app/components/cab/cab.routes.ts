import { Routes } from '@angular/router';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { AddNewCarComponent } from './add-new-car/add-new-car.component';
import { AllCarsComponent } from './all-cars/all-cars.component';
import { AllDriverComponent } from './all-driver/all-driver.component';
import { CarDetailComponent } from './car-detail/car-detail.component';

export default [
  {
    path: 'all-car',
    component: AllCarsComponent
  },
  {
    path: 'car-detail',
    component: CarDetailComponent
  },
  {
    path: 'add-new-car',
    component: AddNewCarComponent
  },
  {
    path: 'all-driver',
    component: AllDriverComponent
  },
  {
    path: 'add-driver',
    component: AddDriverComponent
  }
] as Routes;

