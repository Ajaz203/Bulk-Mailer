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
  publicRoutes: any;
  currentUrl:any
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private bulkEmailService: EmailService) {
    // this.bulkEmailService.checkloginStatus()
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
         this.publicRoutes = ['/login', '/sign-up', '/forgot-password'];
         this.currentUrl = event.url;

        if (this.isBrowser) {
          const isLoggedIn = !!localStorage.getItem('token');
          this.hideHeader = this.publicRoutes.includes(this.currentUrl);
          if (!isLoggedIn && !this.publicRoutes.includes(this.currentUrl)) {
            this.router.navigate(['/login']);
          }
        } else {
          this.hideHeader = this.publicRoutes.includes(this.currentUrl);
        }
      }
    });
  }
}
