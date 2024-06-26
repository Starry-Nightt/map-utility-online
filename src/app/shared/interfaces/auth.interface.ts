export interface LoginDetail {
  email: string;
  password: string;
}

export interface RegisterDetail {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface ChangePasswordDetail {
  oldPassword: string;
  changePassword: string;
}

export interface UpdateProfileDetail {
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface ForgetPasswordDetail {
  email: string;
}

export interface ValidateResetPasswordDetail {
  otp: string;
}

export interface ResetPasswordDetail {
  newPassword: string;
}
