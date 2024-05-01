import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { ComponentService } from '@core/services/component.service';
import { Observable, catchError, filter, of, switchMap, tap } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';
import { ErrorResponse } from '@shared/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private service: ComponentService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isLoggedIn) return true;
    if (this.service.storage.getItem('token') != null) {
      return this.authService.getCurrentUser().pipe(
        catchError(() => {
          return of({ success: false, data: null });
        }),
        tap((res) => {
          if (res.success) {
            this.authService.setUser(res.data);
            this.authService.isLoggedIn = true;
            this.authService.setToken(this.service.storage.getItem('token'));
          }
        }),
        switchMap((res) => {
          if (!res.success) {
            this.authService.redirectUrl = state.url;
            return this.service.router.navigateByUrl('/auth');
          }
          return of(res.success);
        })
      );
    } else {
      this.authService.redirectUrl = state.url;
      return this.service.router.navigateByUrl('/auth');
    }
  }
}
