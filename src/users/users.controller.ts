import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Roles } from "../common/decorators/roles.decorator"; // Import the Roles decorator
import { RolesGuard } from "../common/guards/roles.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles("admin") // Only users with 'admin' role can access this endpoint
  @UseGuards(RolesGuard)
  async create(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles("admin", "user") // Only users with 'admin' role can access this endpoint
  @UseGuards(RolesGuard)
  async findAll() {
    return this.usersService.findAll();
  }
}
