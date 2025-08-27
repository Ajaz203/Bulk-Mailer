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
}








