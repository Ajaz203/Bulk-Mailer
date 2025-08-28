import { Component } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  loading$: Observable<boolean> = this.loaderService.loading$; 
  message = 'Loading...';
  isHide = false;

  constructor(private loaderService: LoaderService) {
    // Hide animation after min time (2s)
    setTimeout(() => {
      this.isHide = true;
    }, 2000);
  }
}
