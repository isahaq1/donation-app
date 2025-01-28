import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // First run the JWT authentication
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = this.jwtService.decode(token);
      if (decoded && decoded["sub"]) {
        // Get the full user object from the database
        const user = await this.usersService.findOne(decoded["sub"]);
        request.user = user;
      }
    }

    return true;
  }
}
