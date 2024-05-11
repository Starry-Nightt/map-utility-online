import { Role } from '@shared/utilities/enums';

export interface UserInfo {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  username: string;
}

export interface UserCreateDetail {
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
  username: string;
}
