import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthLibService } from 'auth-lib';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  authLibService = inject(AuthLibService);
  userEmail = signal<string>(this.authLibService.user() || '');

  handleOnClick(): void {
    if (this.userEmail()?.trim().length > 3) {
      this.authLibService.login(this.userEmail());
    }
  }
}
