import { Routes } from '@angular/router';
import { CatTableComponent } from './cat-table/cat-table.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { VendorCandidateListComponent } from './vendor-candidate-list/vendor-candidate-list.component';
import { VendorBulkUploadComponent } from './vendor-bulk-upload/vendor-bulk-upload.component';
import { UploadDashboardComponent } from './upload-dashboard/upload-dashboard.component';


export const routes: Routes = [
    {path:'',component:UploadDashboardComponent},
    { path: 'cat-table', component: CatTableComponent },
    { path: 'candidate-list', component: CandidateListComponent },
    { path: 'vendor-list', component: VendorCandidateListComponent },
    {path:"vendorbulkupload",component:VendorBulkUploadComponent}

];
