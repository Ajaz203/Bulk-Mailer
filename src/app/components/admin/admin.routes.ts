import { Routes } from '@angular/router';
import { AllAdminsComponent } from './all-admins.component';
import { NewAdminComponent } from './new-admin.component';

export default [
  { path: 'all-admin', component: AllAdminsComponent },
  { path: 'add-new-admin', component: NewAdminComponent }
] as Routes;
