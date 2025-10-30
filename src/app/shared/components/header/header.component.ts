import { Component } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { CommonModule, SlicePipe } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FullScreenComponent } from './full-screen/full-screen.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ThemeModeComponent } from './theme-mode/theme-mode.component';
import { NotificationComponent } from './notification/notification.component';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FeatherIconsComponent } from '../ui/feather-icons/feather-icons.component';
import { ClickOutsideDirective } from '../../directive/click-outside.directive';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [FeatherIconsComponent, ReactiveFormsModule,NotificationComponent, FormsModule,
    ThemeModeComponent,CommonModule,
    FullScreenComponent, UserProfileComponent,RouterLink]
})

export class HeaderComponent {

  public isSearch: boolean = false;
  public menuItems: Menu[] = [];
  public items: Menu[] = [];
  public isOpen: boolean = false;
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string = '';
  planStatus: 'active' | 'expiring' | 'expired' = 'active';
    daysLeft: number = 0;

  constructor(public navService: NavService, private userService: UserService) {
    this.items = navService.menuItem;
  }



  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.checkSubscription(userId);
    }
  }

  /** 🔍 Check subscription status */
  checkSubscription(userId: number) {
    const payload = { userId };

    this.userService.subscription(payload).subscribe({
      next: (res: any) => {
        const subscription = res.subscription;

        if (subscription) {
          const daysRemaining = subscription.daysRemaining;

          if (daysRemaining <= 3 && daysRemaining > 0) {
            this.planStatus = 'expiring';
            this.daysLeft = daysRemaining;
          } else if (daysRemaining <= 0) {
            this.planStatus = 'expired';
          } else {
            this.planStatus = 'active';
          }
        } else {
          this.planStatus = 'active';
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.planStatus = 'expired';
        } else {
          console.error('Subscription check failed:', err);
        }
      }
    });
  }

  /** 🔁 Redirect for renewal */
  renewPlan() {
    localStorage.setItem('renewalTriggered', 'true');
    window.location.href = '/enrollment';
  }
  searchTerm(term: string) {
    term ? this.addFix() : this.removeFix();
    if (!term) return this.menuItems = [];
    let items: Menu[] = [];
    term = term.toLowerCase();
    this.items.filter(menuItems => {
      if (!menuItems?.title) return false
      if (menuItems.title.toLowerCase().includes(term) && menuItems.type === 'link') {
        items.push(menuItems);
      }
      if (!menuItems.children) return false
      menuItems.children.filter(subItems => {
        if (subItems.title?.toLowerCase().includes(term) && subItems.type === 'link') {
          subItems.icon = menuItems.icon
          items.push(subItems);
        }
        if (!subItems.children) return false
        subItems.children.filter(suSubItems => {
          if (suSubItems.title?.toLowerCase().includes(term)) {
            suSubItems.icon = menuItems.icon
            items.push(suSubItems);
          }
        })
        return
      })
      this.checkSearchResultEmpty(items)
      this.menuItems = items
      return
    }
    );
    return

  }

  checkSearchResultEmpty(items: Menu[]) {
    if (!items.length)
      this.searchResultEmpty = true;
    else
      this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
  }

  removeFix() {
    this.searchResult = false;
    this.text = "";
  }

  clickOutside(): void {
    this.searchResult = false;
    this.searchResultEmpty = false;
    this.text = "";
  }

  toggleSidebar() {
    this.navService.closeSidebar = !this.navService.closeSidebar;
  }

  openSearch() {
    this.isSearch = true;
  }

  closeSearch() {
    this.isSearch = false;
  }
}
