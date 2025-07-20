import { Component } from '@angular/core';
import { FeatherIconsComponent } from '../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.scss',
    imports: [RouterLink, FeatherIconsComponent]
})
export class LogInComponent {

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
