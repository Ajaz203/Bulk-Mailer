import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
})
export class LoaderComponent {

  public isHide: boolean = false;

  constructor(){
    setTimeout(() => {
      this.isHide = true;
    }, 5000);
  }
}
