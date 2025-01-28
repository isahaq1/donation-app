import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/user.entity";
import * as bcrypt from "bcrypt";

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
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      role: user.role,
      sub: user.userId,
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
      isAdmin: user.role === "admin" ? true : false,
    };
  }
}
