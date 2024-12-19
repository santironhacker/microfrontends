import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
  {
    path: 'landing',
    component: LandingComponent,
  },
  {
    path: 'user',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4301/remoteEntry.js',
        exposedModule: './routes'
      })
        .then(m => m.MFE_USER_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
