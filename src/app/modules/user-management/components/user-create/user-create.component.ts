import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { UserService } from '@modules/user-management/services/user.service';
import { RegisterDetail } from '@shared/interfaces/auth.interface';
import { UserCreateDetail } from '@shared/interfaces/user.interface';
import {
  NAME_PATTERN,
  ROLES,
  USERNAME_PATTERN,
} from '@shared/utilities/constants';
import { Role } from '@shared/utilities/enums';
import { passwordMatchValidator } from '@shared/utilities/validator';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent extends BaseComponent implements OnInit {
  roles: any[] = ROLES.map((it) => ({ value: it, name: 'common.' + it }));

  form = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      role: [null, [Validators.required]],
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
    public userService: UserService
  ) {
    super(service);
  }

  ngOnInit() {}

  onSubmit() {
    const formValue = this.form.value;
    delete formValue.confirmPassword;
    this.subscribeUntilDestroy(
      this.userService.create(formValue as UserCreateDetail),
      () => {
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.register.success')
        );
        this.form.reset();
      },
      (error) => {
        this.showError(
          this.trans('common.error'),
          this.trans(error?.error?.message ?? 'common.request.error')
        );
      }
    );
  }

  back() {
    this.redirect('/user');
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

  get roleCtrl() {
    return this.form.get('role');
  }
}
