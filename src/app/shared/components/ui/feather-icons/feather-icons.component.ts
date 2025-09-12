import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import feather from 'feather-icons';

@Component({
  selector: 'app-feather-icons',
  templateUrl: './feather-icons.component.html',
  styleUrl: './feather-icons.component.scss',
})
export class FeatherIconsComponent {

  @Input('icon') public icon: string | undefined;
  @Input('class') public class: string | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        feather.replace();
      });
    }
  }
}
