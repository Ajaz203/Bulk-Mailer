import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FeatherIconsComponent } from '../../ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-full-screen',
    templateUrl: './full-screen.component.html',
    styleUrl: './full-screen.component.scss',
    imports: [FeatherIconsComponent]
})
export class FullScreenComponent {

  public elem: any;
  public fullScreen: boolean;

  constructor( @Inject(DOCUMENT) private document:any ) { }

  ngOnInit(): void {
    this.elem = document.documentElement;
  }
  toggleFullScreen() {
    this.fullScreen = !this.fullScreen;
    if (this.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
   
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
    
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
     
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
    
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
    
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
   
        this.document.msExitFullscreen();
      }
    }
  }
}
