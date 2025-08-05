import { Routes, CanActivateFn } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UploadDashboardComponent } from './upload-dashboard/upload-dashboard.component';
import { CatTableComponent } from './cat-table/cat-table.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { VendorCandidateListComponent } from './vendor-candidate-list/vendor-candidate-list.component';
import { VendorBulkUploadComponent } from './vendor-bulk-upload/vendor-bulk-upload.component';
import { DraftsComponent } from './drafts/drafts.component';
import { AllMailsComponent } from './all-mails/all-mails.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WebHeaderComponent } from './webPages/web-header/web-header.component';
import { HomeComponent } from './webPages/home/home.component';
import { AboutUsComponent } from './webPages/about-us/about-us.component';
import { ContactUsComponent } from './webPages/contact-us/contact-us.component';
import { PackegesComponent } from './webPages/packeges/packeges.component';

const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: CreateUserComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'candidate-upload', component: UploadDashboardComponent, canActivate: [authGuard] },
  { path: 'cat-table', component: CatTableComponent, canActivate: [authGuard] },
  { path: 'candidate-list', component: CandidateListComponent, canActivate: [authGuard] },
  { path: 'vendor-list', component: VendorCandidateListComponent, canActivate: [authGuard] },
  { path: 'vendorbulkupload', component: VendorBulkUploadComponent, canActivate: [authGuard] },
  { path: 'drafts', component: DraftsComponent, canActivate: [authGuard] },
  { path: 'all-mails', component: AllMailsComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  {path:'web-header',component:WebHeaderComponent,canActivate:[authGuard]},
  {path:'about-us',component:AboutUsComponent},
  {path:'contact-us',component:ContactUsComponent},
  {path:'packages',component:PackegesComponent},

  {path:'home',component:HomeComponent},


  
  { path: '**', redirectTo: 'home' }
];
