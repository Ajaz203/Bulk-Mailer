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
export class MenuComponent implements AfterViewInit {
  isBrowser: boolean = false;
  public width: number;
  public menus: Menu[] = [];
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

  setNavActive(item: Menu) {
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

  toggleMenu(item: Menu) {
    if (!item.active) {
      this.menus.forEach((child) => {
        if (this.menus.includes(item)) {
          child.active = false;
        }

        if (child.children) {
          child.children.forEach((subChild) => {
            if (child.children?.includes(item)) {
              subChild.active = false
            }
          })
          return;
        }
      })
    }
    item.active = !item.active;
  }
async ngAfterViewInit(): Promise<void> {
  if (!isPlatformBrowser(this.platformId)) return;

  const isLoggedIn = localStorage.getItem('token');
  if (!isLoggedIn) return;

  const userId = localStorage.getItem('userId');
  if (!userId) return;

  this.userService.getUserProfileUpdate(+userId).subscribe({
    next: async (res: any) => {
      if (res?.suggestion) return; // skip if intro already seen

      setTimeout(async () => {
        const introJs = (await import('intro.js')).default;

        const steps: any[] = [
          { intro: '👋 <b>Welcome to MailCept!</b><br>Let’s take a quick tour of your workspace.' }
        ];

        const titles = [
          {
            title: 'Dashboard',
            intro: `
            <div style="display:flex;align-items:center;gap:10px;">
              <i class="bi bi-speedometer2 text-primary" style="font-size:20px;"></i>
              <div>
                <b>Dashboard</b><br>
                Track your email performance and activities at a glance.
              </div>
            </div>
            `
          },
          {
            title: 'Vendors',
            intro: `
            <div style="display:flex;align-items:center;gap:10px;">
              <i class="bi bi-people-fill text-success" style="font-size:20px;"></i>
              <div>
                <b>Vendors</b><br>
                Manage and collaborate with all your vendors here.
              </div>
            </div>
            `
          },
          {
            title: 'Candidates',
            intro: `
            <div style="display:flex;align-items:center;gap:10px;">
              <i class="bi bi-person-badge-fill text-warning" style="font-size:20px;"></i>
              <div>
                <b>Candidates</b><br>
                Upload and organize candidate profiles effortlessly.
              </div>
            </div>
            `
          },
          {
            title: 'Mails',
            intro: `
            <div style="display:flex;align-items:center;gap:10px;">
              <i class="bi bi-envelope-paper-fill text-danger" style="font-size:20px;"></i>
              <div>
                <b>Mails</b><br>
                View all your sent emails, drafts, and schedules.
              </div>
            </div>
            `
          }
        ];

        titles.forEach(({ title, intro }) => {
          const id = this.generateNavId(title);
          const el = document.getElementById(id);
          if (el) {
            steps.push({ element: el, intro });
          }
        });

        introJs()
          .setOptions({
            steps,
            tooltipClass: 'customIntroTooltip',
            showProgress: true,
            showBullets: true,
            exitOnEsc: true,
            scrollToElement: false,
            scrollTo: 'off',
            disableInteraction: false,
            nextLabel: 'Next →',
            prevLabel: '← Back',
            doneLabel: '🚀 Got it!'
          })
          .onbeforechange(() => {
            document.body.style.overflow = 'hidden';
            return true; // must return true or a Promise<boolean>
          })
          .onexit(() => {
            document.body.style.overflow = '';
            this.disableIntroApi(userId); // mark as seen if user exits early
          })
          .oncomplete(() => {
            document.body.style.overflow = '';
            this.disableIntroApi(userId); // mark as seen when finished
          })
          .start();

      }, 500); // wait for DOM to render
    },
    error: (err) => console.error('Intro check failed', err)
  });
}

disableIntroApi(userId: string) {
  this.userService.disableIntro({ userId }).subscribe({
    next: (res) => console.log('Intro disabled via API', res),
    error: (err) => console.error('Intro disable API error', err)
  });
}


}
