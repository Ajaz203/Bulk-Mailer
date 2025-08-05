import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ToastrModule } from 'ngx-toastr';
import { EmailService } from './services/bulk-email.service';

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
 currentUrl: string | undefined;

  publicRoutes: string[] = ['/login', '/sign-up', '/forgot-password', '/home', '/about-us', '/contact-us', '/packages'];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private bulkEmailService: EmailService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const cleanedUrl = event.urlAfterRedirects.split('?')[0].split('#')[0].replace(/\/$/, '');
        this.currentUrl = cleanedUrl;

        this.hideHeader = this.publicRoutes.includes(cleanedUrl);

        if (this.isBrowser) {
          const isLoggedIn = !!localStorage.getItem('token');
          if (!isLoggedIn && !this.publicRoutes.includes(cleanedUrl)) {
            this.router.navigate(['/login']);
          }
        }
      }
    });
  }
}
