import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LearnComponent } from './learn/learn.component';

export const MFE_RESOURCES_ROUTES: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "about",
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "learn",
    component: LearnComponent,
  },
];
