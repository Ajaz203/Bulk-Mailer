import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel, NavigationError, ActivationEnd } from '@angular/router';
import { LoaderService } from './shared/services/loader.service';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./shared/components/ui/loader/loader.component";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'admin';
  showLoader = false;
  showEmailIcon = false;

  constructor(private router: Router, private loader: LoaderService) {
    // ✅ Get route data reliably on every activation (works on refresh too)
    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe((event: any) => {
        const data = event.snapshot.data;

        // Loader
        if (data?.['skipLoader']) {
          this.showLoader = false;
          this.loader.hide();
        } else {
          this.showLoader = true;
          this.loader.show();
        }

        // Email Icon
        this.showEmailIcon = !data?.['hideEmailIcon'];
      });

    // ✅ Hide loader after navigation finishes/cancels
    this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loader.hide();
      }
    });

    // ✅ Always scroll to top after navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  ngOnInit(): void {}

  openEmail() {
    this.router.navigate(['/mails/all-mails']);
  }
}
