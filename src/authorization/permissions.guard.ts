import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, Permission } from './permissions.decorator';
import { AuthorizationService } from './authorization.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzService: AuthorizationService,
    private configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<Permission[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!permissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    for (const permission of permissions) {
      let objectId: string;

      // Check where the objectIdParam is located: params, query, or body
      if (request.params && request.params[permission.objectIdParam]) {
        objectId = request.params[permission.objectIdParam];
      } else if (request.query && request.query[permission.objectIdParam]) {
        objectId = request.query[permission.objectIdParam];
      } else if (request.body && request.body[permission.objectIdParam]) {
        objectId = request.body[permission.objectIdParam];
      } else {
        throw new ForbiddenException(
          `Cannot find parameter '${permission.objectIdParam}' in request`,
        );
      }

      const hasPermission = await this.authzService.checkPermission(
        user.sub,
        permission.permission,
        permission.objectType,
        objectId,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Insufficient permissions for ${permission.permission} on ${permission.objectType}`,
        );
      }
    }

    return true;
  }
}
