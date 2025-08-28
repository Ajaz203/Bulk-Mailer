// shared/services/loading.service.ts
import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingToast?: ActiveToast<any>;

  constructor(private toastr: ToastrService) {}

  showLoading(message: string = 'Loading data...') {
    if (!this.loadingToast) {
      this.loadingToast = this.toastr.info(message, 'Please wait', {
        disableTimeOut: true, 
        tapToDismiss: false,
        closeButton: false,
        progressBar: true,
      });
    }
  }

  hideLoading() {
    if (this.loadingToast) {
      this.toastr.clear(this.loadingToast.toastId);
      this.loadingToast = undefined;
    }
  }
}
