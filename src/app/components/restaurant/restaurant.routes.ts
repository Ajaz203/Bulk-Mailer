import { Routes } from '@angular/router';
import { AddNewRestaurantComponent } from './add-new-restaurant/add-new-restaurant.component';
import { AllRestaurantComponent } from './all-restaurant/all-restaurant.component';
import { RestaurantAddMenuItemComponent } from './restaurant-add-menu-item/restaurant-add-menu-item.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { RestaurantMenuItemComponent } from './restaurant-menu-item/restaurant-menu-item.component';

export default [
  {
    path: 'all-restaurant',
    component: AllRestaurantComponent
  },
  {
    path: 'restaurant-detail',
    component: RestaurantDetailsComponent
  },
  {
    path: 'add-new-restaurant',
    component: AddNewRestaurantComponent
  },
  {
    path: 'menu-item',
    component: RestaurantMenuItemComponent
  },
  {
    path: 'add-menu-item',
    component: RestaurantAddMenuItemComponent
  }
] as Routes;

