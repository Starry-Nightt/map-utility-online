import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  let password = control.get('password');
  if (!password) password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (!password && !confirmPassword) return null;

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
};

export const passwordShouldNotMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  let oldPassword = control.get('oldPassword');
  const newPassword = control.get('newPassword');

  if (!oldPassword && !newPassword) return null;

  return oldPassword.value !== newPassword.value
    ? null
    : { passwordShouldNotMatch: true };
};
