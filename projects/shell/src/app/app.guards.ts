import { inject } from "@angular/core";
import { CanMatchFn, RedirectCommand, Router } from "@angular/router";
import { AuthLibService } from "auth-lib";

export const isAuth: CanMatchFn = (route, segments) => {
  const authLibService = inject(AuthLibService);

  if (authLibService.user()) {
    return true;
  }

  const router = inject(Router);
  return new RedirectCommand(router.parseUrl('/login'));
};
