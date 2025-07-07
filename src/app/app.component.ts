import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, ToastrModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bulkEmailAppFrontend';
  hideHeader: boolean = false;
  isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const publicRoutes = ['/login', '/sign-up', '/forgot-password'];
        const currentUrl = event.url;

        if (this.isBrowser) {
          const isLoggedIn = !!localStorage.getItem('token');
          this.hideHeader = publicRoutes.includes(currentUrl);
          if (!isLoggedIn && !publicRoutes.includes(currentUrl)) {
            this.router.navigate(['/login']);
          }
        } else {
          this.hideHeader = publicRoutes.includes(currentUrl);
        }
      }
    });
  }
}
