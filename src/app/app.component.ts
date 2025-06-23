import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadDashboardComponent } from "./upload-dashboard/upload-dashboard.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, UploadDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bulkEmailAppFrontend';
}
