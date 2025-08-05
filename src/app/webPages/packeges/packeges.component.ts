import { Component, OnInit } from '@angular/core';
import { WebHeaderComponent } from "../web-header/web-header.component";
import { EmailService } from '../../services/bulk-email.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-packeges',
  standalone: true,
  imports: [WebHeaderComponent,CommonModule],
  templateUrl: './packeges.component.html',
  styleUrls: ['./packeges.component.css']
})
export class PackegesComponent implements OnInit {
  plans: any[] = [];

  constructor(private service: EmailService) {}

 ngOnInit(): void {
  this.service.getPlans({}).subscribe((res: any) => {
    if (res?.plans) {
      this.plans = res.plans.filter((p: any) => p.isActive);
    }
  });
}

}
