import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Donation } from "./donation.entity";
import {
  CreateDonationDTO,
  UpdateDonationDTO,
} from "./dto/create-donation.dto";

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

  async update(
    id: number,
    updateDonationDto: UpdateDonationDTO
  ): Promise<Donation | null> {
    await this.donationsRepository.update(id, updateDonationDto);
    return this.findOne(id);
  }

  async findAll(): Promise<Donation[]> {
    return this.donationsRepository.find({ where: { softDeleted: false } });
  }

  async softDelete(id: number): Promise<void> {
    await this.donationsRepository.update(id, {
      delatedAt: new Date(),
      softDeleted: true,
    });
  }

  async getDonationSummary() {
    const [activeDonations, deletedDonations] = await Promise.all([
      // Get active donations
      this.donationsRepository.find({
        where: { softDeleted: false },
      }),
      // Get deleted donations
      this.donationsRepository.find({
        where: { softDeleted: true },
      }),
    ]);

    const activeAmount = activeDonations.reduce(
      (sum, donation) => sum + donation.amount,
      0
    );
    const deletedAmount = deletedDonations.reduce(
      (sum, donation) => sum + donation.amount,
      0
    );

    return {
      totalAmount: activeAmount + deletedAmount,
      totalCount: activeDonations.length + deletedDonations.length,
      activeAmount: activeAmount,
      activeCount: activeDonations.length,
      deletedAmount: deletedAmount,
      deletedCount: deletedDonations.length,
    };
  }
}
