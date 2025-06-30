import { Routes } from '@angular/router';
import { CatTableComponent } from './cat-table/cat-table.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { VendorCandidateListComponent } from './vendor-candidate-list/vendor-candidate-list.component';
import { VendorBulkUploadComponent } from './vendor-bulk-upload/vendor-bulk-upload.component';
import { UploadDashboardComponent } from './upload-dashboard/upload-dashboard.component';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DraftsComponent } from './drafts/drafts.component';


export const routes: Routes = [
    { path:'login',component:LoginComponent},
    { path:'sign-up',component:CreateUserComponent},
    { path:'forgot-password',component:ForgotPasswordComponent},
    {path:'',component:UploadDashboardComponent},
    { path: 'cat-table', component: CatTableComponent },
    { path: 'candidate-list', component: CandidateListComponent },
    { path: 'vendor-list', component: VendorCandidateListComponent },
    {path:"vendorbulkupload",component:VendorBulkUploadComponent},
    {path:'drafts',component:DraftsComponent}

];
