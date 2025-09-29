import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass, NgTemplateOutlet, CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FeatherIconsComponent } from '../ui/feather-icons/feather-icons.component';
import { Menu, NavService } from '../../services/nav.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [FeatherIconsComponent, NgTemplateOutlet, RouterLinkActive, NgClass, RouterLink, CommonModule]
})
export class MenuComponent {
  public menus: Menu[] = [];
  public width: number;
  isBrowser = false;

  constructor(
    private navService: NavService,
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // ✅ Get role-based menu
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const role = userData?.role || 'user';
    this.menus = this.navService.getMenuForRole(role);

    // ✅ Initial sidebar state
    if (this.isBrowser && window.innerWidth < 992) {
      this.navService.closeSidebar = true;
    }

    // ✅ Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activateCurrentRoute(event.url);
      }
    });
  }

  // ✅ Window resize handler
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.width = (event.target as Window).innerWidth;
    this.navService.closeSidebar = this.width < 992;
  }

  // ✅ Activate menu item based on current route
  activateCurrentRoute(url: string) {
    this.menus.forEach(item => {
      if (item.path === url) this.setNavActive(item);
      item.children?.forEach(child => {
        if (child.path === url) this.setNavActive(child);
      });
    });
  }

  // ✅ Set active state for current item
  setNavActive(item: Menu) {
    this.menus.forEach(menuItem => {
      menuItem.active = menuItem === item || menuItem.children?.includes(item) || false;

      menuItem.children?.forEach(submenu => {
        submenu.active = submenu === item;
        if (submenu === item) menuItem.active = true;
      });
    });
  }

  // ✅ Sidebar toggle for mobile
  toggleSidebar() {
    this.navService.closeSidebar = true;
  }

  // ✅ Expand/Collapse menu
  toggleMenu(item: Menu) {
    if (!item.active) {
      this.menus.forEach(menu => {
        if (this.menus.includes(item)) menu.active = false;

        menu.children?.forEach(sub => {
          if (menu.children?.includes(item)) sub.active = false;
        });
      });
    }
    item.active = !item.active;
  }
}
