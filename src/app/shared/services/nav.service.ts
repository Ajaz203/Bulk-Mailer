import { Injectable } from '@angular/core';

export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  type?: string;
  icon?: string;
  active?: boolean;
  bookmark?: boolean;
  items?: Menu[]
  children?: Menu[];
  level?: number;
  badge?: boolean,
  badgeText?: string;
  rolesAllowed?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NavService {

  public closeSidebar: boolean = false;

  constructor() { }

  public menuItem: Menu[] = [
    {
      title: 'Dashboard',
      icon: 'home',
      type: 'link',
      active: true,
      level: 1,
      path: '/dashboard',
      rolesAllowed: ['admin', 'superadmin']
    },
    {
      title: 'Admins',
      icon: 'shield',
      type: 'sub',
      active: false,
      level: 1,
      rolesAllowed: ['superadmin'],
      children: [
        { path: 'admin/all-admin', title: 'All Admins', type: 'link', level: 2 },
        { path: 'admin/add-new-admin', title: "Add New Admin", type: 'link', level: 2 },
        // { path: '/tour/add-new-package', title: 'Add New Package', type: 'link', level: 2 },
        // { path: '/tour/add-new-admin', title: 'All Package Categories', type: 'link', level: 2 },
        // { path: '/tour/add-package-category', title: 'Add Package Category', type: 'link', level: 2 },
      ],
    },
    {
      title: 'Users',
      icon: 'users',
      type: 'sub',
      active: false,
      level: 1,
      rolesAllowed: ['admin', 'superadmin'],
      children: [
        { path: '/user/all-user', title: 'All users', type: 'link', level: 2, rolesAllowed: ['admin', 'superadmin'] },
        { path: '/user/add-new-user', title: 'Add new user', type: 'link', level: 2, rolesAllowed: ['admin', 'superadmin'] }
      ]
    },
    {
      title: 'Subscription',
      icon: 'credit-card',
      type: 'link',
      level: 1,
      // path: '/Subscriptions',
      rolesAllowed: ['superadmin'],
      children: [
        { path: '/Subscriptions/add-subscription', title: 'Add Subscription', type: 'link', level: 2 },
        { path: '/Subscriptions/all-subscription', title: "All Subscription", type: 'link', level: 2 },
      ],
    },
    // {
    //   title: 'hotel',
    //   icon: 'briefcase',
    //   type: 'sub',
    //   active: false,
    //   level: 1,
    //   children: [
    //     { path: '/hotel/all-hotels', title: 'All Hotels', type: 'link',level: 2 },
    //     { path: '/hotel/hotel-detail', title: "Hotel's Detail", type: 'link',level: 2 },
    //     { path: '/hotel/add-new-hotel', title: 'Add New Hotel', type: 'link',level: 2 },
    //   ],
    // },
    // {
    //   title: 'Restaurant',
    //   icon: 'coffee',
    //   type: 'sub',
    //   active: false,
    //   level: 1,
    //   children: [
    //     { path: '/restaurant/all-restaurant', title: 'All Restaurant', type: 'link',level: 2 },
    //     { path: '/restaurant/restaurant-detail', title: "Restaurant's Detail", type: 'link',level: 2 },
    //     { path: '/restaurant/add-new-restaurant', title: 'Add New Restaurant', type: 'link',level: 2 },
    //     { path: '/restaurant/menu-item', title: "Menu Items", type: 'link',level: 2 },
    //     { path: '/restaurant/add-menu-item', title: 'Add Menu item', type: 'link',level: 2 },
    //   ],
    // },
    // {
    //   title: 'Cab',
    //   icon: 'navigation',
    //   type: 'sub',
    //   active: false,
    //   level: 1,
    //   children: [
    //     { path: '/cab/all-car', title: 'All Cars', type: 'link',level: 2 },
    //     { path: '/cab/car-detail', title: "Cars's Detail", type: 'link',level: 2 },
    //     { path: '/cab/add-new-car', title: 'Add New Cars', type: 'link',level: 2 },
    //     { path: '/cab/all-driver', title: "All Drivers", type: 'link',level: 2 },
    //     { path: '/cab/add-driver', title: 'Add Drivers', type: 'link',level: 2 },
    //   ],
    // },
    // {
    //   title: 'Booking',
    //   icon: 'bookmark',
    //   type: 'link',
    //   level: 1,
    //   path: '/booking'
    // },
    // {
    //   title: 'Setting',
    //   icon: 'settings',
    //   type: 'link',
    //   level: 1,
    //   path: '/setting'
    // },
    // {
    //   title: 'Log In',
    //   icon: 'log-in',
    //   type: 'link',
    //   level: 1,
    //   path: '/log-in'
    // },
    // {
    //   title: 'Register',
    //   icon: 'plus-circle',
    //   type: 'link',
    //   level: 1,
    //   path: '/register'
    // },
  ]
  public getMenuForRole(role: string): Menu[] {
    const filterMenu = (menus: Menu[]): Menu[] => {
      return menus
        .filter(menu => !menu.rolesAllowed || menu.rolesAllowed.includes(role))
        .map(menu => ({
          ...menu,
          children: menu.children ? filterMenu(menu.children) : []
        }));
    };

    return filterMenu(this.menuItem);
  }
}
