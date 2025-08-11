import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './shared/components/layouts/layout/layout.component';
import { AdminGuard } from './shared/guard/admin.guard';
import { content } from './shared/routes/routes';
import { FullComponent } from './shared/components/layouts/full/full.component';
import { full } from './shared/routes/full-routes';

// export const routes: Routes = [
//     {
//         path: '',
//         redirectTo: '/dashboard',
//         pathMatch: 'full'
//     },
//     {
//         path: 'auth/login',
//         component: LoginComponent
//     },
      
//     {
//         path: '',
//         component: LayoutComponent,
//         canActivate: [AdminGuard],
//         children: content
//     },
//     {
//         path: '',
//         component: FullComponent,
//         canActivate: [AdminGuard],
//         children: full
//     }
// ];



export const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent
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
        redirectTo: 'auth/login'
    }
];
