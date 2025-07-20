import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherIconsComponent } from '../../shared/components/ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [FeatherIconsComponent, RouterLink]
})
export class RegisterComponent {

  public type: string = 'password';
  public isShow: boolean = true;

  showPassword(){
    this.isShow =! this.isShow;
    if(this.isShow){
      this.type = 'password'
    }else{
      this.type = 'text'
    }
  }
}
