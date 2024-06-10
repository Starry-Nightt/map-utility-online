import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import {
  ChangePasswordDetail,
  ResetPasswordDetail,
} from '@shared/interfaces/auth.interface';
import { SuccessResponse } from '@shared/interfaces/response';
import {
  passwordMatchValidator,
  passwordShouldNotMatchValidator,
} from '@shared/utilities/validator';
import { NgOtpInputConfig } from 'ng-otp-input';
import { filter, mergeMap, switchMap } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  canResetPassword: boolean = false;
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
              this.canResetPassword = true;
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
        this.redirect('auth/login');
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
    this.goBack();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.authService.removeResetPasswordToken();
  }
}
