import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public config  = {
    settings: {
      layout_type: 'ltr',
      layout_version: ''
    }
  };

  constructor() {
    document.getElementsByTagName('html')[0].setAttribute('dir', this.config.settings.layout_type);
  }
}
