import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-web-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './web-header.component.html',
  styleUrl: './web-header.component.css'
})
export class WebHeaderComponent {
isMobileMenuActive: boolean = false;
  toggleMobileMenu(): void {
    this.isMobileMenuActive = !this.isMobileMenuActive;
  }






}
