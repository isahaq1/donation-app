import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ForbiddenException,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { Roles } from "../common/decorators/roles.decorator"; // Import the Roles decorator
import { RolesGuard } from "../common/guards/roles.guard";
import {
  CreateDonationDTO,
  UpdateDonationDTO,
} from "./dto/create-donation.dto";
import { Donation } from "./donation.entity";

@Controller("donations")
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  // @Roles("admin", "user") // Only users with 'admin' role can access this endpoint
  // @UseGuards(RolesGuard)
  create(@Body() createDonationDto: CreateDonationDTO): Promise<Donation> {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  // @Roles("admin", "user") // Only users with 'admin' role can access this endpoint
  // @UseGuards(RolesGuard)
  findAll(): Promise<Donation[]> {
    return this.donationsService.findAll();
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updatedonationDto: UpdateDonationDTO
  ) {
    // First check if the donation belongs to the user
    const donation = await this.donationsService.findOne(id);

    // if (donation?.user.id !== 1) {
    //   throw new ForbiddenException("You can only update your own donations");
    // }

    return this.donationsService.update(id, updatedonationDto);
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<Donation | null> {
    return this.donationsService.findOne(id);
  }

  @Delete(":id")
  async softDelete(@Param("id") id: number): Promise<void> {
    const donation = await this.donationsService.findOne(id);
    if (!donation) {
      throw new ForbiddenException("Donation not found");
    }
    return this.donationsService.softDelete(id);
  }

  @Get("summary/report")
  @Roles("admin") // Only users with 'admin' role can access this endpoint
  @UseGuards(RolesGuard)
  async getDonationSummary() {
    return this.donationsService.getDonationSummary();
  }

  @Get("summary/monthly")
  @Roles("admin") // Only users with 'admin' role can access this endpoint
  @UseGuards(RolesGuard)
  async getMonthlyDonationSummary() {
    return this.donationsService.getMonthlyDonationSummary();
  }
}
