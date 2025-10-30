import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-grievance',
  imports: [FormsModule,CommonModule],
  templateUrl: './admin-grievance.component.html',
  styleUrl: './admin-grievance.component.scss'
})
export class AdminGrievanceComponent {
    grievances: any[] = [];
  selectedGrievance: any = null;
  loading = false;
constructor(private service: UserService) {}

  ngOnInit() {
    this.loadAllGrievances();
  }

loadAllGrievances() {
  this.loading = true;

  this.service.getGrievanceDetails().subscribe({
    next: (res: any) => {
      this.loading = false;

      // Ensure safe mapping
      this.grievances = (res.data || []).map((g: any) => ({
        grievanceId: g.grievanceId,
        userId: g.userId,
        subject: g.subject,
        category: g.category,
        priority: g.priority,
        department: g.department,
        description: g.description,
        attachment: g.attachment,
        status: g.status || 'Open',
        adminRemark: g.adminRemark || '-',
        date: g.createdAt,
        name: g.user?.name || 'Unknown',
        email: g.user?.email || 'N/A'
      }));

      console.log('Fetched grievances:', this.grievances);
    },
    error: (err) => {
      this.loading = false;
      console.error('Error fetching grievances:', err);
      Swal.fire('Error', 'Failed to load grievance list.', 'error');
    }
  });
}


  viewGrievance(g: any) {
    this.selectedGrievance = g;
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('viewGrievanceModal')
    );
    modal.show();
  }

 updateStatus(grievance: any, newStatus: string) {
  Swal.fire({
    title: `Change status to ${newStatus}?`,
    text: `Are you sure you want to mark this grievance as ${newStatus}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, update',
    cancelButtonText: 'Cancel'
  }).then(result => {
    if (result.isConfirmed) {

      const payload = {
        grievanceId: grievance.grievanceId,
        userId: grievance.userId,
        status: newStatus,
        adminRemark: grievance.adminRemark || '' // optional, if you have remark
      };

      // Show loading indicator
      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while we update the grievance status.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      this.service.updateGrievanceStatus(payload).subscribe({
        next: (res: any) => {
          Swal.close();
          if (res?.status === 200 || res?.success) {
            grievance.status = newStatus; // update UI
            Swal.fire('Updated!', `Status changed to ${newStatus}.`, 'success');
          } else {
            Swal.fire('Failed', 'Could not update grievance status.', 'error');
          }
        },
        error: (err) => {
          console.error(err);
          Swal.close();
          Swal.fire('Error', 'Something went wrong while updating status.', 'error');
        }
      });
    }
  });
}

    openViewModal(g: any) {
    this.selectedGrievance = { ...g };
  }

  closeViewModal() {
    this.selectedGrievance = null;
  }



updateGrievance() {
  if (!this.selectedGrievance) return;

  Swal.fire({
    title: 'Update Grievance?',
    text: 'Are you sure you want to update this grievance status?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, update it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#00457c'
  }).then((result) => {
    if (result.isConfirmed) {
      const statusMap: any = {
       
        'in progress': 'In-Progress',
        resolved: 'Resolved',
        closed: 'Closed',
        open: 'Open'
      };

   const payload = {
  grievanceId: this.selectedGrievance.grievanceId,
  status: statusMap[(this.selectedGrievance.status || '').toLowerCase()] || this.selectedGrievance.status,
  adminRemark: (this.selectedGrievance.adminRemark || '').trim(),
 userId: this.selectedGrievance.userId
};

      console.log('Payload sent to API:', payload);

      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while the grievance is being updated.',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        showConfirmButton: false
      });

      this.service.updateGrievanceStatus(payload).subscribe({
        next: (res: any) => {
          Swal.fire('Updated!', 'The grievance has been updated successfully.', 'success');
          this.closeViewModal();
          this.loadAllGrievances();
        },
        error: (err) => {
          console.error('Error updating grievance:', err);
          Swal.fire('Error', 'Failed to update grievance status.', 'error');
        }
      });
    }
  });
}





}