import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FeatherIconsComponent } from '../../shared/components/ui/feather-icons/feather-icons.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [RouterLink, FeatherIconsComponent]
})
export class LoginComponent {

  public show: boolean = true;
  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, public router: Router) {
    const userData = localStorage.getItem('user');
      if(userData?.length != null){
        router.navigate(['/dashboard'])
      }

    this.loginForm = this.fb.group({
      email: ["Test@gmail.com", [Validators.required, Validators.email]],
      password: ["test123", Validators.required],
    });

  }

  ngOnInit() { }

  showPassword() {
    this.show = !this.show;
  }

  // Simple Login
  login() {
    if (this.loginForm.value["email"] == "Test@gmail.com" && this.loginForm.value["password"] == "test123") {
      let user = {
        email: "Test@gmail.com",
        password: "test123",
        name: "test user",
      };
      localStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["/dashboard"]);
    }
  }
}
