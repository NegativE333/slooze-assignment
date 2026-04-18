import { SetMetadata } from '@nestjs/common';

export type AllowedRoles = 'ADMIN' | 'MANAGER' | 'MEMBER';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AllowedRoles[]) => SetMetadata(ROLES_KEY, roles);