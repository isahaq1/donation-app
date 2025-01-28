import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/user.entity";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserById(userId: number): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    if (!user.id) {
      throw new UnauthorizedException("Invalid user data");
    }

    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
      data: {
        username: user.username,
        email: user.email,
        role: user.role,
        id: user.id,
      },
      status: true,
      message: "Login Success",
      isAdmin: user.role === "admin",
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException("User no longer exists");
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
