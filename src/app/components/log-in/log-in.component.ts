import { Component } from '@angular/core';
import { FeatherIconsComponent } from '../../shared/components/ui/feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.scss',
    imports: [RouterLink, FeatherIconsComponent]
})
export class LogInComponent {

  public type: string = 'password';
  public isShow: boolean = true;
constructor(private titleService: Title) {
  this.titleService.setTitle('MailCept-Log In');
}
  showPassword(){
    this.isShow =! this.isShow;
    if(this.isShow){
      this.type = 'password'
    }else{
      this.type = 'text'
    }
  }
}
