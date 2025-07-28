import { Routes } from '@angular/router';
import { TourAddPackageCategoryComponent } from './tour-add-package-category/tour-add-package-category.component';
import { TourAddPackageComponent } from './tour-add-package/tour-add-package.component';
import { TourPackageCategoriesComponent } from './tour-package-categories/tour-package-categories.component';
import { TourPackageDetailsComponent } from './tour-package-details/tour-package-details.component';
import { TourPackageComponent } from './tour-package/tour-package.component';
import { NewAdminComponent } from '../admin/new-admin.component';
import { AllAdminsComponent } from '../admin/all-admins.component';

export default [
  {
    path: 'all-admin',
    component: AllAdminsComponent
  },
  {
    path: 'package-detail',
    component: TourPackageDetailsComponent
  },
  {
    path: 'add-new-package',
    component: TourAddPackageComponent
  },
  {
    path: 'add-new-admin',
    component: NewAdminComponent
  },
  {
    path: 'add-package-category',
    component: TourAddPackageCategoryComponent
  }
] as Routes;
