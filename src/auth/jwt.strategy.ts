import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        "2fe75646e85ef3c9432ab5866f9eb7578fe90f9dc734f90dec5b72f71ea981eb8f4216436a2338b1c9bc2692da972791893a46d5a0dd5e520d550e59e2487a235d0331b0d359cb67f8953757cba6547e21008b42e188f66210e2e4bda895f598d5f08a1dba75901603a87e6fdbce8e17c172b41cbbfbbdf08ebecbba712ff9beb00bebc302f29e7bde743a2725128a92daa458a7c399a68f27cb10dea5752c25b0fd45843f23d4383c626661b54b1d6996aa9aa9da5f18ec215ff70664c3731a877f86ac891cca6a91ca13e9afdb05bfd925f84dd1847a49d23cc8a8f5d1922f6a2193c64787174bbaf4f10a368dba812b47a5b73141d7cef30aeb6c1a393531",
    });
  }

  // async validate(payload: JwtPayload) {
  //   return this.authService.validateUserById(payload.sub);
  // }
  async validate(payload: any) {
    try {
      // This attaches the decoded payload to the request object as `req.user`
      return {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid token payload");
    }
  }
}
