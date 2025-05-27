import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/role.enum';

/**
 * @description
 * Guard that restricts route access to users with specific roles.
 * Uses metadata defined via the @Roles decorator to enforce role-based access control.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  /**
   * Determines whether the current request is permitted based on user roles.
   * Compares the user's role against the list of required roles from metadata.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler()) ||
      this.reflector.get<UserRole[]>(ROLES_KEY, context.getClass());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request context');
    }

    if (!requiredRoles.includes(user.role as UserRole)) {
      throw new UnauthorizedException(
        `Access denied. User with role ${user.role} is not authorized to access this route.`,
      );
    }

    return true;
  }
}
