import { Routes } from '@angular/router';
import { ReviewComponent } from './subscription.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { AllSubscriptionComponent } from './all-subscription/all-subscription.component';

export default[
  {
    path: "",
    component: ReviewComponent
  },
  {
    path:"add-subscription",
    component:AddSubscriptionComponent
  },
  {
    path:'all-subscription',
    component:AllSubscriptionComponent
  }
] as Routes;

