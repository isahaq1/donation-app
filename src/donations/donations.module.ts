import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { DonationsService } from "./donations.service";
import { DonationsController } from "./donations.controller";
import { Donation } from "./donation.entity";
import { AuthModule } from "@/auth/auth.module";
import { User } from "@/users/user.entity";
import { UsersController } from "@/users/users.controller";
import { UsersService } from "@/users/users.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation]),
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}
