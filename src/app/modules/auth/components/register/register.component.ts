import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { RegisterDetail } from '@shared/interfaces/auth.interface';
import { NAME_PATTERN, USERNAME_PATTERN } from '@shared/utilities/constants';
import { passwordMatchValidator } from '@shared/utilities/validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent extends BaseComponent implements OnInit {
  form = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      username: [
        '',
        [Validators.required, Validators.pattern(USERNAME_PATTERN)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator,
    }
  );
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
    delete formValue.confirmPassword;
    this.subscribeUntilDestroy(
      this.authService.register(formValue as RegisterDetail),
      () => {
        this.redirect('/auth/login');
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.register.success')
        );
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

  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword');
  }

  get firstNameCtrl() {
    return this.form.get('firstName');
  }
  get lastNameCtrl() {
    return this.form.get('lastName');
  }
  get usernameCtrl() {
    return this.form.get('username');
  }
}
