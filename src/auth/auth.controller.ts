import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Request() req: any) {
    // Returns the decoded token payload
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post("verify")
  async verifyToken(@Request() req: any) {
    // Returns the full token information
    const token = req.headers.authorization?.split(" ")[1];
    return {
      token,
      decoded: req.user,
    };
  }
}
