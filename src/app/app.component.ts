import { Component } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const publicRoutes = ['/login', '/sign-up', '/forgot-password'];
        const isLoggedIn = !!localStorage.getItem('token'); 
        const currentUrl = event.url;
        this.hideHeader = publicRoutes.includes(currentUrl);
        if (!isLoggedIn && !publicRoutes.includes(currentUrl)) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
