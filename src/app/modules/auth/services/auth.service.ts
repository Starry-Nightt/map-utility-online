import { Injectable } from '@angular/core';
import { ComponentService } from '@core/services/component.service';
import { HttpService } from '@core/services/http.service';
import {
  ChangePasswordDetail,
  ForgetPasswordDetail,
  LoginDetail,
  RegisterDetail,
  ResetPasswordDetail,
  UpdateProfileDetail,
  ValidateResetPasswordDetail,
} from '@shared/interfaces/auth.interface';
import {
  LoginSuccessResponse,
  SuccessResponse,
} from '@shared/interfaces/response';
import { UserInfo } from '@shared/interfaces/user.interface';
import { Role } from '@shared/utilities/enums';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl?: string = null;
  token?: string = null;
  currentUser?: UserInfo = null;
  resetPasswordToken?: string = null;

  constructor(private http: HttpService, private service: ComponentService) {}

  register(detail: RegisterDetail): Observable<SuccessResponse<UserInfo>> {
    return this.http.post('/auth/register', detail);
  }

  login(detail: LoginDetail): Observable<SuccessResponse<UserInfo>> {
    return this.http.post('/auth/login', detail).pipe(
      tap((res: LoginSuccessResponse) => {
        this.isLoggedIn = true;
        this.setToken(res.token);
      }),
      switchMap(() => this.getCurrentUser()),
      tap((res: SuccessResponse<UserInfo>) => {
        if (res.success) this.setUser(res.data);
      })
    );
  }

  changePassword(detail: ChangePasswordDetail): Observable<void> {
    return this.http.post('/auth/change-password', detail);
  }

  updateProfile(detail: UpdateProfileDetail): Observable<void> {
    return this.http.put(`/user/${this.currentUser.id}`, detail);
  }

  deleteAccount(): Observable<SuccessResponse<void>> {
    return this.http.delete(`/user/${this.currentUser.id}`);
  }

  getCurrentUser(): Observable<SuccessResponse<UserInfo>> {
    return this.http.post('/auth/me');
  }

  forgetPassword(
    detail: ForgetPasswordDetail
  ): Observable<SuccessResponse<string>> {
    return this.http.post('/auth/forget-password', detail);
  }

  validateOtp(
    detail: ValidateResetPasswordDetail
  ): Observable<SuccessResponse<void>> {
    return this.http.post('/auth/validate-otp', detail);
  }

  resetPassword(
    detail: ResetPasswordDetail
  ): Observable<SuccessResponse<void>> {
    return this.http.post('/auth/reset-password', detail);
  }

  logout(): Observable<SuccessResponse<void>> {
    this.removeToken();
    this.removeUser();
    this.isLoggedIn = false;
    return of();
  }

  setUser(userInfo: UserInfo) {
    this.currentUser = userInfo;
  }

  removeUser() {
    this.currentUser = null;
  }

  setToken(token: string) {
    this.token = token;
    this.service.storage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    this.service.storage.removeItem('token');
  }

  setResetPasswordToken(token: string) {
    this.resetPasswordToken = token;
  }

  removeResetPasswordToken() {
    this.resetPasswordToken = null;
  }

  get isAdmin(): boolean {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  get shortName(): string {
    return this.currentUser.firstName.charAt(0);
  }
}
