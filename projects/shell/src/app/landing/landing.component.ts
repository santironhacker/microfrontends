import { Component, inject } from '@angular/core';
import { AuthLibService } from 'auth-lib';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  authLibService = inject(AuthLibService);

  user = this.authLibService.user;
}
