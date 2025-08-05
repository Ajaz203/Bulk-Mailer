import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-web-header',
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './web-header.component.html',
  styleUrl: './web-header.component.css'
})
export class WebHeaderComponent {
isMobileMenuActive: boolean = false;
  toggleMobileMenu(): void {
    this.isMobileMenuActive = !this.isMobileMenuActive;
  }






}
