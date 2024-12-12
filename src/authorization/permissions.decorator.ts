import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export type Permission = {
  permission: string;
  objectType: string;
  objectIdParam: string; // The name of the route parameter containing the object ID
};

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
