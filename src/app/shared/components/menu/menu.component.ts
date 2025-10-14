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

  // constructor(
  //   private navService: NavService,
  //   private router: Router,
  //   private userService: UserService,
  //   @Inject(PLATFORM_ID) private platformId: Object
  // ) {
  //   this.isBrowser = isPlatformBrowser(this.platformId);

  //   const userData = JSON.parse(localStorage.getItem('user') || '{}');
  //   const role = userData?.role || 'user';
  //   this.menus = this.navService.getMenuForRole(role);
  //   if (this.isBrowser && window.innerWidth < 992) {
  //     this.navService.closeSidebar = true;
  //   }
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.activateCurrentRoute(event.url);
  //     }
  //   });
  // }

  // ✅ Window resize handler

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

  generateNavId(title: string): string {
    if (!title) return '';
    return 'nav-' + title.toLowerCase().replace(/\s+/g, '-');
  }
  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData?.userId;
    if (!userId) return;

    this.userService.getUserProfileUpdate(+userId).subscribe({
      next: async (res: any) => {

        if (res?.suggestion) return;

        setTimeout(async () => {
          const introJs = (await import('intro.js')).default;

          const steps: any[] = [
            {
              intro: `
                      <div style="display:flex;align-items:center;gap:10px;flex-direction:column;text-align:center;">
                        <i class="bi bi-lightning-charge-fill text-primary" style="font-size:30px;"></i>
                        <div>
                          <b>Welcome to MailCept!</b><br>
                          Let’s take a quick tour of your workspace and explore the tools to manage emails, vendors, candidates, and validate your lists efficiently.
                        </div>
                      </div>
                    `
            }

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
              title: 'Email Validator',
              intro: `
              <div style="display:flex;align-items:center;gap:10px;">
                <i class="bi bi-envelope-check-fill text-info" style="font-size:20px;"></i>
                <div>
                  <b>Email Validator</b><br>
                  Upload a sheet of emails and the system will automatically remove invalid or non-working addresses,
                  ensuring your email list is clean and effective.
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
                  Efficiently manage and collaborate with your vendor network. Upload vendor in bulk, track performance, and maintain up-to-date information for smooth operations.
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
                  Organize and manage candidate profiles effortlessly, upload Emails in bulk, and keep your talent pipeline up to date.
                </div>
              </div>
            `
            }
            ,
            {
              title: 'Mails',
              intro: `
              <div style="display:flex;align-items:center;gap:10px;">
                <i class="bi bi-envelope-paper-fill text-danger" style="font-size:20px;"></i>
                <div>
                  <b>Mails</b><br>
                  Access all your emails in one place, including sent, draft, and scheduled messages, ensuring efficient communication with candidates and vendors.
                </div>
              </div>
            `
            }

          ];

          // 🧩 Collect available elements dynamically
          titles.forEach(({ title, intro }) => {
            const id = this.generateNavId(title);
            const el = document.getElementById(id);
            console.log('Looking for ID:', id, 'Found?', !!el);
            if (el) {
              steps.push({ element: el, intro });
            }
          });

          // ⚠️ If nothing found, skip to avoid blank tour
          if (steps.length <= 1) {
            console.warn('Intro skipped: No sidebar elements found.');
            return;
          }

          const intro = introJs()
            .setOptions({
              steps,
              tooltipClass: 'customIntroTooltip',
              showProgress: true,
              showBullets: true,
              exitOnEsc: true,
              scrollToElement: false,
              disableInteraction: false,
              nextLabel: 'Next →',
              prevLabel: '← Back',
              doneLabel: '🚀 Got it!'
            })
            .onbeforechange(() => {
              document.body.style.overflow = 'hidden';
              return true;
            })
            .onexit(() => {
              document.body.style.overflow = '';
              this.disableIntroApi(userId);
            })
            .oncomplete(() => {
              document.body.style.overflow = '';
              this.disableIntroApi(userId);
            });

          // ✅ Start the tour safely
          intro.start();
        }, 100); // delay increased to ensure full render
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
