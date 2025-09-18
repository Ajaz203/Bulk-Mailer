import { Component, HostListener, Input } from '@angular/core';
import { OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Menu, NavService } from '../../services/nav.service';
import { NavigationEnd, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { FeatherIconsComponent } from '../ui/feather-icons/feather-icons.component';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [FeatherIconsComponent, NgTemplateOutlet, RouterLinkActive, NgClass, RouterLink]
})
export class MenuComponent  {
  isBrowser: boolean = false;
  public width: number;
    public menus = this.navService.menuItem;
  generateNavId(title: string): string {
    if (!title) return '';
    return 'nav-' + title.toLowerCase().replace(/\s+/g, '-');
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.width = (event.target as Window).innerWidth;
    if (this.width < 992) {
      this.navService.closeSidebar = true;
    } else {
      this.navService.closeSidebar = false;
    }
  }

  constructor(private navService: NavService, private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const role = userData?.role || 'user';
    this.menus = this.navService.getMenuForRole(role);
    if (window.innerWidth < 992) {
      this.navService.closeSidebar = true;
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menus.filter(items => {
          if (items.path === event.url) {
            this.setNavActive(items);
          }
          items.children?.filter(subItems => {
            if (subItems.path === event.url) {
              this.setNavActive(subItems);
            }
          });
        });
      }
    });

  }

    setNavActive(item:Menu) {
    this.menus.filter(menuItem => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems === item) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }
  toggleSidebar() {
    this.navService.closeSidebar = true;
  }

   toggleMenu(item: Menu){
    if(!item.active){
      this.menus.forEach((child) => {
        if(this.menus.includes(item)){
          child.active = false;
        }

        if(child.children){
          child.children.forEach((subChild) => {
            if(child.children?.includes(item)){
              subChild.active = false
            }
          })
          return;
        }
      })
    }
    item.active =! item.active;
  }


}
