import { Component } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';

@Component({
    selector: 'app-add-new-car',
    templateUrl: './add-new-car.component.html',
    styleUrl: './add-new-car.component.scss',
    imports: [TagInputModule, DropzoneModule]
})

export class AddNewCarComponent {

    public config: DropzoneConfigInterface = {
        // Change this to your upload POST address:
        url: 'https://httpbin.org/post',
        maxFilesize: 50,
        addRemoveLinks:true,
        acceptedFiles: 'image/*'
    };

    public text = '<i class="icon-cloud-up"></i><h6>Drop files here or click to upload.</h6><span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span>';

    onUploadError(args: any): void { }

    onUploadSuccess(args: any): void {}


}
