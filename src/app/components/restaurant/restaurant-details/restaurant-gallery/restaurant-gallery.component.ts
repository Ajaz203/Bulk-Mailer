import { Component, Input } from '@angular/core';
import { gallery } from '../../../../shared/interface/restaurant';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

@Component({
    selector: 'app-restaurant-gallery',
    imports: [LightboxModule],
    templateUrl: './restaurant-gallery.component.html',
    styleUrl: './restaurant-gallery.component.scss',
})
export class RestaurantGalleryComponent {

  @Input() restaurantGallery: gallery[];

  public images: gallery[];
  public items: GalleryItem[];

  constructor(public gallery: Gallery, public lightbox: Lightbox){}

  openLightBox(){
    this.images = [];
    this.restaurantGallery.forEach((image) => {
        this.images.push(image)
    })

    this.items = this.images.map((item) => new ImageItem({ src: item.image, thumb: item.image }));

    const lightboxRef = this.gallery.ref('lightbox');

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });

    this.lightbox.open()
    lightboxRef.load(this.items)
  }
}
