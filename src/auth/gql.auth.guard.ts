import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AllowedRoles } from './roles.decorator';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AllowedRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // In production, this would be `request.user` populated by a JwtAuthGuard.
    const userId = request.headers['x-user-id'];
    const userRole = request.headers['x-user-role'];
    const userCountry = request.headers['x-user-country'];

    if (!userId || !userRole || !userCountry) {
      throw new UnauthorizedException('Missing user context headers (x-user-id, x-user-role, x-user-country)');
    }

    // Attach mock user to the request so our resolvers can use it for Re-BAC (Country restriction)
    request.user = { id: userId, role: userRole, country: userCountry };

    if (!requiredRoles) {
      return true; 
    }

    if (!requiredRoles.includes(userRole as AllowedRoles)) {
      throw new ForbiddenException(`Access denied. Requires one of: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}