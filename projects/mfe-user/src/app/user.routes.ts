import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';

export const MFE_USER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'details',
  },
  {
    path: 'details',
    component: DetailsComponent,
  },
  {
    path: 'edit',
    component: EditComponent,
  },
];
