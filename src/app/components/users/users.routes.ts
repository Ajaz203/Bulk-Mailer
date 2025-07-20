import { Routes } from '@angular/router';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { AllUsersComponent } from './all-users/all-users.component';

export default [
  {
    path: 'all-user',
    component: AllUsersComponent
  },
  {
    path: 'add-new-user',
    component: AddNewUserComponent
  }
] as Routes;
