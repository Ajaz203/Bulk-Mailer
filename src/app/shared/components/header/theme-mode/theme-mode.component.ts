import { Component } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-theme-mode',
    templateUrl: './theme-mode.component.html',
    styleUrl: './theme-mode.component.scss',
    imports: [NgClass]
})
export class ThemeModeComponent {

  public dark: boolean = this.layout.config.settings.layout_version == 'dark-only' ? true : false;

constructor(public layout: LayoutService) {
  if(this.dark){
    document.body.classList.add('dark-only')
  }
}

layoutToggle() {
  this.dark = !this.dark;
  this.dark
    ? document.body.classList.add('dark-only')
    : document.body.classList.remove('dark-only');
  this.layout.config.settings.layout_version = this.dark
    ? 'dark-only'
    : 'light-only';

}
}
