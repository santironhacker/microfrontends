import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4301/remoteEntry.js',
        exposedModule: './routes'
      })
        .then(m => m.MFE_USER_ROUTES)
  }
];
