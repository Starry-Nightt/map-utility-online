import { Role } from './enums';

export const NAME_PATTERN = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;
export const USERNAME_PATTERN = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
export const ROLES = [Role.Admin, Role.User];
