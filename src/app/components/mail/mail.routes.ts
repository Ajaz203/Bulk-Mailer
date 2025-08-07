import { Routes } from '@angular/router';
import { AllMailsComponent } from './all-mails/all-mails.component';
import { DraftsComponent } from './drafts/drafts.component';


const routes: Routes = [
  {
    path: 'all-mails',
    component: AllMailsComponent,
  },
  {
    path: 'drafts',
    component:DraftsComponent
  }
];

export default routes;
