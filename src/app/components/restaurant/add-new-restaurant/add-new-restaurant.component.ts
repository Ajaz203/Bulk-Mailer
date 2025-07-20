import { Component } from '@angular/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { addRestaurantDetails } from '../../../shared/interface/restaurant';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

@Component({
    selector: 'app-add-new-restaurant',
    templateUrl: './add-new-restaurant.component.html',
    styleUrl: './add-new-restaurant.component.scss',
    imports: [OwlDateTimeModule, OwlNativeDateTimeModule, DropzoneModule]
})

export class AddNewRestaurantComponent {

  public restaurant: addRestaurantDetails[];

  public config: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    addRemoveLinks:true,
    acceptedFiles: 'image/*'
  };

  public text = '<i class="icon-cloud-up"></i><h6>Drop files here or click to upload.</h6><span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span>';

  constructor(private restaurantService: RestaurantService) {
    this.restaurantService.restaurant().subscribe(response => {
      this.restaurant = response.addRestaurantDetails;
    })
  }

  onUploadError(args: any): void {}

  onUploadSuccess(args: any): void {}

}
