import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ForbiddenException("No token provided");
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      const hasRole = roles.some((role) => decoded.role === role);
      if (!hasRole) {
        throw new ForbiddenException(
          "You do not have permission to access this resource"
        );
      }

      return true;
    } catch (error) {
      throw new ForbiddenException("Invalid token or insufficient permissions");
    }
  }
}
