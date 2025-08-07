import { Routes } from '@angular/router';
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import { VendorsByUserComponent } from './vendors-by-user/vendors-by-user.component';
import { VendorsUploadComponent } from './vendors-upload/vendors-upload.component';

const routes: Routes = [
  {
    path: 'list',
    component: VendorsListComponent,
  },
  {
    path: 'by-user',
    component:VendorsByUserComponent
  },
  {
    path:'upload',
    component:VendorsUploadComponent
  }
];

export default routes;
