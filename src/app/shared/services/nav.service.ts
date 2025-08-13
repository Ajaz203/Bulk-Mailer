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
      rolesAllowed: ['user','admin', 'superadmin']
    },
    {
      title: 'Admin',
      icon: 'shield',
      type: 'sub',
      active: false,
      level: 1,
      rolesAllowed: ['superadmin'],
      children: [
        { path: 'admin/all-admin', title: 'All Admins', type: 'link', level: 2 },
        { path: 'admin/add-new-admin', title: "Add New Admin", type: 'link', level: 2 },
      
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
      rolesAllowed: ['superadmin'],
      children: [
        { path: '/Subscriptions/all-subscription', title: "All Subscription", type: 'link', level: 2 },
        { path: '/Subscriptions/add-subscription', title: 'Add Subscription', type: 'link', level: 2 },
      ],
    },
    {
      title: 'Enquiries',
      icon: 'user-check',
      type: 'link',
      level: 1,
      path: '/contacts',
      rolesAllowed: ['superadmin'],
     
    },
      {
      title: 'Vendors',
      icon: 'briefcase',
      type: 'link',
      level: 1,
      rolesAllowed: [ 'user', 'superadmin'],
      children: [
        { path: '/vendors/upload', title: 'Upload Vendors', type: 'link', level: 2 },
        { path: '/vendors/by-user', title: 'Vendors By User', type: 'link', level: 2 },
        // { path: '/vendors/list', title: "Vendors List", type: 'link', level: 2 },
       
      ],
    },
      {
      title: 'Candidates',
      icon: 'user-plus',
      type: 'link',
      level: 1,
      rolesAllowed: [ 'user', 'superadmin'],
      children: [
        { path: '/candidates/upload', title: "Upload Candidate", type: 'link', level: 2 },
        { path: '/candidates/list', title: 'candidates list', type: 'link', level: 2 },
      ],
    },
    {
      title: 'Technology',
      icon: 'cpu',
      type: 'link',
      level: 1,
      path: '/technology',
      rolesAllowed: ['user', 'superadmin'],
     
    },
      {
      title: 'Mails',
      icon: 'mail',
      type: 'link',
      level: 1,
      rolesAllowed: [ 'user', 'superadmin'],
      children: [
        { path: '/mails/all-mails', title: 'All Mails', type: 'link', level: 2 },
        { path: '/mails/drafts', title: "All Drafts", type: 'link', level: 2 },
      ],
    },


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
