import { Component, Input } from '@angular/core';
import { tourGallery } from '../../../../shared/interface/tours';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

@Component({
  selector: 'app-tour-gallery',
  templateUrl: './tour-gallery.component.html',
  styleUrl: './tour-gallery.component.scss',
  imports: [LightboxModule],
})
export class TourGalleryComponent {

  @Input() gallery: tourGallery[];

  public images: tourGallery[];
  public items: GalleryItem[];

  constructor(public galleryImage: Gallery, public lightbox: Lightbox) { }

  openLightBox() {
    this.images = [];
    this.gallery.forEach((image) => {
      this.images.push(image)
    })

    this.items = this.images.map((item) => new ImageItem({ src: item.url, thumb: item.url }));

    const lightboxRef = this.galleryImage.ref('lightbox');

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });

    this.lightbox.open()
    lightboxRef.load(this.items)
  }
}
