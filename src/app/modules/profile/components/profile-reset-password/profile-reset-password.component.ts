import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { ResetPasswordDetail } from '@shared/interfaces/auth.interface';
import { passwordMatchValidator } from '@shared/utilities/validator';
import { NgOtpInputConfig } from 'ng-otp-input';
import { filter } from 'rxjs';

@Component({
  selector: 'app-profile-reset-password',
  templateUrl: './profile-reset-password.component.html',
  styleUrls: ['./profile-reset-password.component.css'],
})
export class ProfileResetPasswordComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  pages = {
    begin: 'begin',
    otp: 'otp',
    reset: 'reset',
  };
  currentPage = this.pages.begin;

  otpLength = 6;
  otp: FormControl = new FormControl();
  otpConfig: NgOtpInputConfig = {
    length: this.otpLength,
    allowNumbersOnly: true,
  };

  form = this.fb.group(
    {
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordMatchValidator],
    }
  );

  constructor(
    service: ComponentService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    super(service);
  }

  ngOnInit() {
    this.trackOnOtpInput();
  }

  trackOnOtpInput() {
    this.otp.valueChanges
      .pipe(filter((res) => res.length === this.otpLength))
      .subscribe((res: string) => {
        this.subscribeUntilDestroy(
          this.authService.validateOtp({ otp: res }),
          (res) => {
            if (res.success) {
              this.loading = false;
              this.currentPage = this.pages.reset;
            }
          },
          (error) => {
            this.showError(
              this.trans('common.fail'),
              this.trans(error?.error?.message ?? 'common.request.error')
            );
          }
        );
      });
  }

  onSubmit() {
    this.subscribeUntilDestroy(
      this.authService.resetPassword(this.form.value as ResetPasswordDetail),
      () => {
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.resetPassword.success')
        );
        this.form.reset();
        this.authService.removeResetPasswordToken();
      },
      (error) => {
        this.showError(
          this.trans('common.error'),
          this.trans(error?.error?.message ?? 'common.request.error')
        );
      }
    );
  }

  get newPasswordCtrl() {
    return this.form.get('newPassword');
  }

  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword');
  }

  back() {
    this.currentPage = this.pages.begin;
  }

  onResetPassword() {
    this.subscribeUntilDestroy(
      this.authService.forgetPassword({
        email: this.authService.currentUser.email,
      }),
      () => {
        this.currentPage = this.pages.otp;
        this.showInfo(
          this.trans('common.notice'),
          this.trans('usernav.otp.info')
        );
      }
    );
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.authService.removeResetPasswordToken();
  }
}
