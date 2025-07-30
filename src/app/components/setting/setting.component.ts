import { Component } from '@angular/core';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { UserPersonalDetailsComponent } from './user-personal-details/user-personal-details.component';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrl: './setting.component.scss',
    imports: [UserPersonalDetailsComponent]
})
export class SettingComponent {

}
