import { SetMetadata } from "@nestjs/common";

// Key for storing roles metadata
export const ROLES_KEY = "roles";

// Roles decorator
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// export const Roles = (...roles: string[]) => {
//   return (target: any, key: string, descriptor: PropertyDescriptor) => {
//     Reflect.defineMetadata('roles', roles, target, key);
//     return descriptor;
//   };
// };
