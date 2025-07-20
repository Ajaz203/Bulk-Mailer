import { Component } from '@angular/core';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from '../../../shared/components/ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-user-personal-details',
    templateUrl: './user-personal-details.component.html',
    styleUrl: './user-personal-details.component.scss',
    imports: [FeatherIconsComponent, NgbInputDatepicker]
})
export class UserPersonalDetailsComponent {

}
