import { Routes } from '@angular/router';
import { CatTableComponent } from './cat-table/cat-table.component';
import { UploadDashboardComponent } from './upload-dashboard/upload-dashboard.component';


export const routes: Routes = [
{path:'',component:UploadDashboardComponent},
{path:'cat-table',component:CatTableComponent}
];
