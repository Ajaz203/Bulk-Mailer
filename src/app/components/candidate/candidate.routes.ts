import { Routes } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateUploadComponent } from './candidate-upload/candidate-upload.component';


const routes: Routes = [
  {
    path: 'list',
    component: CandidateListComponent,
  },
  {
    path: 'upload',
    component:CandidateUploadComponent
  }
];

export default routes;
