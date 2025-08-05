import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.routes')
  },
  {
    path: 'user',
    loadChildren: () => import('../../components/users/users.routes')
  },
  {
    path: 'Subscriptions',
    loadChildren: () => import('../../components/tour/tour.routes')
  },
  {
    path: 'hotel',
    loadChildren: () => import('../../components/hotel/hotel.routes')
  },
  {
    path: 'restaurant',
    loadChildren: () => import('../../components/restaurant/restaurant.routes')
  },
  {
    path: 'cab',
    loadChildren: () => import('../../components/cab/cab.routes')
  },
  {
    path: 'booking',
    loadChildren: () => import('../../components/booking/booking.routes')
  },
  {
    path: 'Subscriptions',
    loadChildren: () => import('../../components/subscription/subscription.routes')
  },
  {
    path: 'setting',
    loadChildren: () => import('../../components/setting/setting.routes')
  },
  {
    path: 'admin',
    loadChildren: () => import('../../components/admin/admin.routes'),
  },
{
  path:'contacts',
  loadChildren:() => import('../../components/contacts/contacts.routes') 
}

]
