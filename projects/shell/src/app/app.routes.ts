import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';

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
    path: 'login',
    component: LoginComponent,
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
    path: 'about',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4302/remoteEntry.js',
        exposedModule: './About'
      })
        .then(m => m.AboutComponent)
  },
  {
    path: 'learn',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4302/remoteEntry.js',
        exposedModule: './Learn'
      })
        .then(m => m.LearnComponent)
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
