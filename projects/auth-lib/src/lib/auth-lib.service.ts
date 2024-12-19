import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthLibService {
  private readonly USER_STORAGE_KEY = 'user';

  private userName: WritableSignal<string | null> = signal(this.checkUserInMemory());

  public get user(): Signal<string | null> {
    return this.userName.asReadonly();
  }

  public login(userName: string): void {
    this.userName.set(userName);
    sessionStorage.setItem(this.USER_STORAGE_KEY, userName);
  }

  private checkUserInMemory(): string | null {
    const storedUser: string | null = sessionStorage.getItem(this.USER_STORAGE_KEY);
    return storedUser ? storedUser : null;
  }
}
