import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { CreateDonationDTO } from "./dto/create-donation.dto";
import { Donation } from "./donation.entity";

@Controller("donations")
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(@Body() createDonationDto: CreateDonationDTO): Promise<Donation> {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  findAll(): Promise<Donation[]> {
    return this.donationsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<Donation | null> {
    return this.donationsService.findOne(id);
  }
}
