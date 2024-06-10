import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { ForgetPasswordDetail } from '@shared/interfaces/auth.interface';
import { timer } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent extends BaseComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    public service: ComponentService,
    public fb: FormBuilder,
    public authService: AuthService
  ) {
    super(service);
  }

  ngOnInit() {}

  onSubmit() {
    this.subscribeUntilDestroy(
      this.authService.forgetPassword(this.form.value as ForgetPasswordDetail),
      (res) => {
        this.authService.setResetPasswordToken(res.data);
        this.redirect('/auth/reset-password');
      },
      (error) => {
        this.showError(
          this.trans('common.error'),
          this.trans(error?.error?.message ?? 'common.request.error')
        );
      }
    );
  }

  get emailCtrl() {
    return this.form.get('email');
  }
}
