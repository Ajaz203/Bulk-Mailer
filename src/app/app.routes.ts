import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './shared/components/layouts/layout/layout.component';
import { AdminGuard } from './shared/guard/admin.guard';
import { content } from './shared/routes/routes';
import { FullComponent } from './shared/components/layouts/full/full.component';
import { full } from './shared/routes/full-routes';
import { HomeComponent } from './components/web/home/home.component';
import { AboutUsComponent } from './components/web/about-us/about-us.component';
import { ContactUsComponent } from './components/web/contact-us/contact-us.component';
import { WebPackagesComponent } from './components/web/web-packages/web-packages.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' 
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'packages',
    component: WebPackagesComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: content // Make sure content contains /dashboard
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AdminGuard],
    children: full
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

