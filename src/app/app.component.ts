import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./shared/components/ui/loader/loader.component";
import { UserService } from './shared/services/user.service';
import { Router,NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'admin';
  constructor(private userService: UserService, private router: Router) {}
// app.component.ts (second app)
ngOnInit() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const role = params.get('role');
  const name = params.get('name');
  const email = params.get('email');
  const userId = params.get('userId');

  if (token) {
    localStorage.setItem('token', token);
    if (role) localStorage.setItem('role', role);
    if (name) localStorage.setItem('name', name);
    if (email) localStorage.setItem('email', email);
    if (userId) localStorage.setItem('userId', userId);

    // Remove query params from URL
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }
 this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
  
  
}

}








