import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { TROLES } from '../types';
import { JWTAuthGuard } from '../guard/auth-guard';
import { ROLES } from '../config';

export const RoleAllowed = (roles: TROLES) => SetMetadata(ROLES, roles);

export const Message = (message: string = 'Success') =>
  SetMetadata('message', message);

export const GuardRoute = () => {
  return applyDecorators(UseGuards(JWTAuthGuard));
};
