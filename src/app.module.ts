import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DonationsModule } from "./donations/donations.module";
import { User } from "./users/user.entity";
import { Donation } from "./donations/donation.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "postgres",
      entities: [User, Donation],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    DonationsModule,
  ],
})
export class AppModule {}
