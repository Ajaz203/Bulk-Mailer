import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css'],
})
export class ConfirmationPopupComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Output() closed = new EventEmitter<void>();

  countdown: number = 5;
  intervalId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.type === 'success' && this.show) {
      this.startCountdown();
    }
  }

  ngOnChanges(): void {
    if (this.type === 'success' && this.show) {
      this.countdown = 5;
      this.startCountdown();
    }
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.onClose();
      }
    }, 1000);
  }

  onClose() {
    clearInterval(this.intervalId);
    this.closed.emit();
    this.router.navigate(['/login']);
  }
}
