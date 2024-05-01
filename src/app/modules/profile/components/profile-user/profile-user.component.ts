import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { UserInfo } from '@shared/interfaces/user.interface';
import { NAME_PATTERN, USERNAME_PATTERN } from '@shared/utilities/constants';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
})
export class ProfileUserComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  currentUser: UserInfo;
  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
    lastName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
    username: ['', [Validators.required, Validators.pattern(USERNAME_PATTERN)]],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
  });
  constructor(
    service: ComponentService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    super(service);
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.form.setValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      username: this.currentUser.username,
      email: this.currentUser.email,
    });
  }

  onSubmit() {
    const formValue = this.form.value;
    delete formValue.email;
    if (formValue.username === this.currentUser.username)
      delete formValue.username;
    this.subscribeUntilDestroy(
      this.authService.updateProfile(formValue),
      () => {
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.updateProfile.success')
        );
        this.authService.setUser({ ...this.currentUser, ...formValue });
        this.currentUser = this.authService.currentUser;
        this.isEdit = false;
      },
      () => {
        this.showError(
          this.trans('common.error'),
          this.trans('common.request.error')
        );
      }
    );
  }

  onEdit() {
    this.isEdit = true;
  }

  onCancel() {
    this.isEdit = false;
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

  get emailCtrl() {
    return this.form.get('email');
  }
}
