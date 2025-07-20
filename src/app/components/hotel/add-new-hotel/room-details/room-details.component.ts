import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { addHotelDetails } from '../../../../shared/interface/hotel';

@Component({
    selector: 'app-room-details',
    templateUrl: './room-details.component.html',
    styleUrl: './room-details.component.scss',
    imports: [DropzoneModule, NgxEditorModule, FormsModule]
})

export class RoomDetailsComponent {

    @Input() roomDetails: addHotelDetails;

    public editor: Editor;
    public html = '';
    public text = '<i class="icon-cloud-up"></i><h6>Drop files here or click to upload.</h6><span class="note needsclick">(This is just a demo dropzone. Selected files are <strong>not</strong> actually uploaded.)</span>';
    public config: DropzoneConfigInterface = {
        // Change this to your upload POST address:
        url: 'https://httpbin.org/post',
        maxFilesize: 50,
        addRemoveLinks:true,
        acceptedFiles: 'image/*'
    };

    ngOnInit(): void {
        this.editor = new Editor();
    }

    onUploadError(args: any): void {}

    onUploadSuccess(args: any): void {}

    ngOnDestroy(): void {
        this.editor.destroy();
    }

}
