import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthLibService } from "auth-lib";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  authLibService = inject(AuthLibService);

  user = this.authLibService.user;
  formEmail = signal('');

  onHandleClick() {
    this.authLibService.login(this.formEmail());
  }
}
