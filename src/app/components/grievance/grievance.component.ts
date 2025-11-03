import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-grievance',
  imports: [FormsModule, CommonModule],
  templateUrl: './grievance.component.html',
  styleUrl: './grievance.component.scss'
})
export class GrievanceComponent implements OnInit, OnDestroy {
  grievance = {
    subject: '',
    category: '',
    description: '',
    file: null as File | null,
    department: '',
    priority: '',
    status: 'Open',
    contactPreference: 'Email'
  };

  grievances: any[] = [];
  loading = false;
  userId: number | null = null;
  showPolicy = false;
  baseUrl: string;

  // 🕒 interval subscription for auto-refresh
  private refreshSub!: Subscription;

  constructor(private service: UserService) {
    this.baseUrl = this.service.getBaseUrl();
  }

  ngOnInit() {
    // ✅ Get logged-in user ID from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      this.userId = userData.id || userData.userId || null;
    }

    if (!this.userId) {
      Swal.fire('Error', 'User not logged in. Please sign in again.', 'error');
      return;
    }

    // 🟢 Initial Load
    this.loadGrievances();

    // 🕒 Auto refresh every 5 seconds
    this.refreshSub = interval(5000).subscribe(() => {
      this.loadGrievances();
    });
  }

  // ✅ API call for user grievances
  loadGrievances() {
    if (!this.userId) return;

    const payload = { userId: this.userId };
    this.service.getUserGrievances(payload).subscribe({
      next: (res: any) => {
        this.grievances = res.data || [];
        console.log('Grievance Data:', JSON.stringify(this.grievances, null, 2));
      },
      error: () => {
        Swal.fire('Error', 'Failed to load grievances.', 'error');
      }
    });
  }

  // ✅ Unsubscribe when component destroyed
  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  // ✅ File upload handler
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Invalid File', 'Only JPG, PNG, or PDF files are allowed.', 'warning');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('File Too Large', 'Maximum allowed size is 5MB.', 'warning');
        return;
      }
      this.grievance.file = file;
    }
  }

  // ✅ Submit grievance
  submitGrievance() {
    if (!this.grievance.subject || !this.grievance.category || !this.grievance.description) {
      Swal.fire('Missing Fields', 'Please fill out all required fields.', 'warning');
      return;
    }

    if (!this.userId) {
      Swal.fire('Error', 'User not found. Please login again.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('subject', this.grievance.subject);
    formData.append('category', this.grievance.category);
    formData.append('description', this.grievance.description);
    formData.append('department', this.grievance.department);
    formData.append('priority', this.grievance.priority);
    formData.append('status', 'Open');
    formData.append('contactPreference', this.grievance.contactPreference);
    formData.append('userId', this.userId.toString());

    if (this.grievance.file) {
      formData.append('file', this.grievance.file);
    }

    this.loading = true;
    this.service.createGrievance(formData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Submitted!', 'Your grievance has been submitted successfully.', 'success');
        this.resetForm();
        this.loadGrievances();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        Swal.fire('Error', 'Failed to submit grievance. Please try again.', 'error');
      }
    });
  }

  // ✅ Reset form
  resetForm() {
    this.grievance = {
      subject: '',
      category: '',
      description: '',
      status: 'Open',
      file: null,
      department: '',
      priority: '',
      contactPreference: 'Email'
    };
  }

  // ✅ View grievance details
  viewGrievanceDetails(g: any) {
    const payload = {
      userId: g.userId,
      grievanceId: g.grievanceId
    };

    this.service.getUserGrievances(payload).subscribe({
      next: (res: any) => {
        if (res?.data && res.data.length > 0) {
          const grievance = res.data.find((item: any) => item.grievanceId === g.grievanceId);
          grievance
            ? this.showGrievanceModal(grievance)
            : Swal.fire('Not Found', 'No matching grievance found for this ID.', 'info');
        } else {
          Swal.fire('No Data', 'No grievance details found.', 'info');
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to fetch grievance details.', 'error');
      }
    });
  }

  // ✅ Modal display logic
  showGrievanceModal(g: any) {
    const formattedDate = new Date(g.createdAt).toLocaleString();
    const baseUrl = this.service.getBaseUrl();
    const fileUrl = g.attachment?.startsWith('http') ? g.attachment : `${baseUrl}${g.attachment}`;

    Swal.fire({
      title: `<h4 style="font-weight:600; color:#00457c;">${g.subject}</h4>`,
      html: `
        <div style="text-align:left; font-size:14px; line-height:1.6;">
          <p><strong>Category:</strong> ${g.category}</p>
          <p><strong>Priority:</strong> ${g.priority}</p>
          <p><strong>Status:</strong> 
            <span style="padding:3px 8px; border-radius:4px; background:${this.getStatusColor(g.status)}; color:#fff;">
              ${g.status || 'Pending'}
            </span>
          </p>
          <hr>
          <p><strong>Description:</strong></p>
          <p>${g.description || '<em>No description provided.</em>'}</p>
          <hr>
          <p><strong>Admin Remark:</strong> ${g.adminRemark || '-'}</p>
          ${g.attachment
            ? `<hr><p><strong>Attachment:</strong> 
                <a href="${fileUrl}" target="_blank" 
                   style="color:#00457c; font-weight:500; text-decoration:underline;">
                   View File
                </a></p>` : ''}
          <p style="font-size:13px; color:#777;"><i class="bi bi-calendar3 me-1"></i>${formattedDate}</p>
        </div>
      `,
      width: 600,
      confirmButtonText: 'Close',
      confirmButtonColor: '#00457c'
    });
  }

  // ✅ Status color
  getStatusColor(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'in-progress': return '#ffc107';
      case 'resolved': return '#28a745';
      case 'closed': return '#ef3f3e';
      default: return '#6c757d';
    }
  }

  openPolicy() { this.showPolicy = true; }
  closePolicy() { this.showPolicy = false; }
}
