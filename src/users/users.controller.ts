import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../common/decorators/roles.decorator"; // Import the Roles decorator
import { RolesGuard } from "../common/guards/roles.guard";
import { User } from "./user.entity";

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

  @Put(":id")
  async update(@Param("id") id: number, @Body() updateUserdto: UpdateUserDto) {
    return this.usersService.update(id, updateUserdto);
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
