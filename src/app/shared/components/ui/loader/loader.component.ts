import { Component } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  imports: [CommonModule],
})
export class LoaderComponent {
  loading$: Observable<boolean>;
 
  message = 'Loading Inner Data....';
  public isHide: boolean = false;

  constructor(private loaderService: LoaderService) {
    setTimeout(() => {
      this.isHide = true;
    }, 3000);
    this.loading$ = this.loaderService.loading$;
  }

}
