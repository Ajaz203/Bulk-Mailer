import { Component, Input } from '@angular/core';
import { tourHighlight } from '../../../../shared/interface/tours';

@Component({
    selector: 'app-tour-highlight',
    templateUrl: './tour-highlight.component.html',
    styleUrl: './tour-highlight.component.scss',

})
export class TourHighlightComponent {

  @Input() highlights: tourHighlight[];

}
