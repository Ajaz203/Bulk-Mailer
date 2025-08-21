import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoaderComponent } from "./shared/components/ui/loader/loader.component";
import { UserService } from './shared/services/user.service';
import { StorageService } from './shared/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent implements OnInit {
  title = 'admin';

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getLocal<any>('user');
    if (user) {
      this.userService.setUser(user);
      this.userService.broadcastUser(user);
      if (this.router.url === '/login') {
        this.router.navigate(['/dashboard']);
      }
    }
  }
  
}
