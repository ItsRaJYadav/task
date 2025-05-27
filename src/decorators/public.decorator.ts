import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublic';

/**
 * @description
 * Custom decorator to mark a route or controller as public.
 * This will be used to indicate that the route or controller is publicly accessible.
 * @returns A method or class decorator to attach the 'isPublic' metadata.
 */
export const Public = (): MethodDecorator & ClassDecorator => {
  return SetMetadata(PUBLIC_KEY, true);
};
