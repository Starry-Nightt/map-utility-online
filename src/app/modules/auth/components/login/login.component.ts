import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { LoginDetail } from '@shared/interfaces/auth.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
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
    const formValue = this.form.value;
    this.subscribeUntilDestroy(
      this.authService.login(formValue as LoginDetail),
      () => {
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.login.success')
        );
        this.redirect(this.authService.redirectUrl ?? '/');
      },
      (error) => {
        this.showError(this.trans('common.error'), error.error.message);
      }
    );
  }

  get emailCtrl() {
    return this.form.get('email');
  }

  get passwordCtrl() {
    return this.form.get('password');
  }
}
