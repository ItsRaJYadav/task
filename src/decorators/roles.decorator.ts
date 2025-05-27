import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Custom decorator to set roles for a route handler or class.
 * This can be applied to both methods and classes.
 * @param roles The roles that are allowed to access the decorated route or class.
 * @returns A method or class decorator to attach the roles metadata.
 */
export const Roles = (
  ...roles: UserRole[]
): MethodDecorator & ClassDecorator => {
  return SetMetadata(ROLES_KEY, roles);
};
