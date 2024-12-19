import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthLibService {
  private readonly USER_STORAGE_KEY = 'user';
  private readonly UNDEFINED = 'undefined';

  private userName: WritableSignal<string> = signal(this.checkUserInMemory());

  public get user(): Signal<string> {
    return this.userName.asReadonly();
  }

  public login(userName: string): void {
    this.userName.set(userName);
    sessionStorage.setItem(this.USER_STORAGE_KEY, this.userName());
  }

  private checkUserInMemory(): string {
    const storedUser: string | null = sessionStorage.getItem(this.USER_STORAGE_KEY);
    return storedUser ? storedUser : this.UNDEFINED;
  }
}
