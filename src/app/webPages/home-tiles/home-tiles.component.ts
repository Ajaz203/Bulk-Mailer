import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home-tiles',
  imports: [CarouselModule,CommonModule],
  templateUrl: './home-tiles.component.html',
  styleUrl: './home-tiles.component.css'
})
export class HomeTilesComponent implements OnInit {

    constructor(
        public router: Router
    ) { }

    ngOnInit(): void {}

    teamSlides: OwlOptions = {
		nav: true,
		margin: 25,
		loop: true,
		dots: false,
		autoplay: false,
		smartSpeed: 1000,
		autoplayHoverPause: true,
		navText: [
            '<i class="flaticon-chevron-1"></i>',
            '<i class="flaticon-chevron"></i>'
		],
        responsive: {
            0: {
                items: 1
            },
            515: {
                items: 2
            },
            695: {
                items: 2
            },
            935: {
                items: 3
            },
            1200: {
                items: 3
            }
        }
    }
    teamWrapSlides: OwlOptions = {
		nav: true,
		margin: 25,
		loop: true,
		dots: false,
		autoplay: false,
		smartSpeed: 1000,
		autoplayHoverPause: true,
		navText: [
            '<i class="flaticon-chevron-1"></i>',
            '<i class="flaticon-chevron"></i>'
		],
        responsive: {
            0: {
                items: 1
            },
            515: {
                items: 2
            },
            695: {
                items: 2
            },
            935: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    }

}