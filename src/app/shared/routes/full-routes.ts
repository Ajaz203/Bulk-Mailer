import { Routes } from "@angular/router";

export const full : Routes = [
  {
    path: 'log-in',
    loadChildren: () => import('../../components/log-in/log-in.routes')
  },
  {
    path: 'register',
    loadChildren: () => import('../../components/register/register.routes')
  }
]
