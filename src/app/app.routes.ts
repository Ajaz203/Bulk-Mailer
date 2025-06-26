import { Routes } from '@angular/router';
import { CatTableComponent } from './cat-table/cat-table.component';
import { UploadDashboardComponent } from './upload-dashboard/upload-dashboard.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';


export const routes: Routes = [
{path:'',component:UploadDashboardComponent},
{path:'cat-table',component:CatTableComponent},
{path:'candidate-list',component:CandidateListComponent},

];
