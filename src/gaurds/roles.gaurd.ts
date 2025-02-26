import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../constants/app.constant';
import { UserRole } from 'src/modules/auth/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLE_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const { user: tokenInfo } = context.switchToHttp().getRequest();
    return requiredRoles.includes(tokenInfo.role);
  }
}
