import { Component,  } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './shared/services/loader.service';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./shared/components/ui/loader/loader.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'admin';
  showLoader = true;


  constructor(private router: Router, private loader: LoaderService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const route = this.router.routerState.snapshot.root.firstChild?.data;

        if (route?.['skipLoader']) {
          this.showLoader = false;
        } else {
          this.showLoader = true;
          this.loader.show();
        }
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loader.hide();
      }
    });
      this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

}
