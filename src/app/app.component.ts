import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent,ToastrModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bulkEmailAppFrontend';
    hideHeader: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/login', '/sign-up', '/forgot-password',]; 
        this.hideHeader = hiddenRoutes.includes(event.url);
      }
    });
  }
}
