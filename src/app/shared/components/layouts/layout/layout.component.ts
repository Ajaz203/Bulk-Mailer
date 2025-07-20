import { Component, HostListener } from '@angular/core';
import { NavService } from '../../../services/nav.service';
import { CustomizerComponent } from '../../ui/customizer/customizer.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';
import { HeaderComponent } from '../../header/header.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    imports: [HeaderComponent, MenuComponent, RouterOutlet, FooterComponent, CustomizerComponent]
})
export class LayoutComponent {

  public width: number;

	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		this.width = (event.target as Window).innerWidth;
    if(this.width < 992){
      this.navService.closeSidebar = true;
    }else{
      this.navService.closeSidebar = false;
    }
	}

  constructor(public navService: NavService){
    if(window.innerWidth < 992){
      this.navService.closeSidebar = true;
    }
  }
}
