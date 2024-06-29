import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { ChangePasswordDetail } from '@shared/interfaces/auth.interface';
import {
  passwordMatchValidator,
  passwordShouldNotMatchValidator,
} from '@shared/utilities/validator';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.css'],
})
export class ProfilePasswordComponent extends BaseComponent implements OnInit {
  form = this.fb.group(
    {
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [passwordMatchValidator, passwordShouldNotMatchValidator],
    }
  );
  constructor(
    service: ComponentService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    super(service);
  }

  ngOnInit() {}

  onSubmit() {
    const formValue = this.form.value;
    delete formValue.confirmPassword;
    this.subscribeUntilDestroy(
      this.authService.changePassword(formValue as ChangePasswordDetail),
      () => {
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.changePassword.success')
        );
        this.form.reset();
      },
      (error) => {
        this.showError(
          this.trans('common.fail'),
          this.trans(error?.error?.message ?? 'common.request.error')
        );
      }
    );
  }

  get oldPasswordCtrl() {
    return this.form.get('oldPassword');
  }

  get newPasswordCtrl() {
    return this.form.get('newPassword');
  }

  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword');
  }
}
