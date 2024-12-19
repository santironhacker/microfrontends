import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLibService } from 'auth-lib';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authLibService = inject(AuthLibService);
  router = inject(Router);

  user = this.authLibService.user;
  formEmail = signal('');
  formErrors = signal(false);

  onHandleClick() {
    if (this.formEmail().trim().length < 3) {
      this.formErrors.set(true);
    } else {
      this.formErrors.set(false);
      this.authLibService.login(this.formEmail());
      this.router.navigate(['/landing']);
    }
  }
}
