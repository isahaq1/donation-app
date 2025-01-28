import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Donation } from "./donation.entity";
import { CreateDonationDTO } from "./dto/create-donation.dto";

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private donationsRepository: Repository<Donation>
  ) {}

  async create(createDonationDto: CreateDonationDTO): Promise<Donation> {
    const donation = this.donationsRepository.create(createDonationDto);
    return this.donationsRepository.save(donation);
  }
  async findOne(id: number): Promise<Donation | null> {
    return this.donationsRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Donation[]> {
    return this.donationsRepository.find();
  }
}
