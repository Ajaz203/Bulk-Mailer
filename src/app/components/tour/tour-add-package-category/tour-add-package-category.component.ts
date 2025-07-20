import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
    selector: 'app-tour-add-package-category',
    templateUrl: './tour-add-package-category.component.html',
    styleUrl: './tour-add-package-category.component.scss',
    imports: [TagInputModule, NgxEditorModule, FormsModule]
})

export class TourAddPackageCategoryComponent {

  public editor: Editor;
  public html = '';

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
