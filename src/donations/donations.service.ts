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
    return this.donationsRepository.find({
      relations: ["user"],
      select: {
        user: {
          id: true,
          username: true,
          email: true,
          // Exclude sensitive fields like password
        },
      },
      where: { softDeleted: false },
    });
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

  async getMonthlyDonationSummary() {
    const today = new Date();
    const last12Months = new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      1
    );

    // Generate the last 12 months
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(
        last12Months.getFullYear(),
        last12Months.getMonth() + i,
        1
      );
      months.push({ month: date.getMonth() + 1, year: date.getFullYear() }); // Months are 0-based, so add 1
    }

    console.log("Query start date:", last12Months.toISOString().split("T")[0]);

    // Raw SQL query for donations
    const donations = await this.donationsRepository.query(
      `
    SELECT 
      EXTRACT(MONTH FROM "donation"."createdAt") as month,
      EXTRACT(YEAR FROM "donation"."createdAt") as year,
      SUM(COALESCE("donation"."amount", 0)) as "totalAmount",
      COUNT(*) as "count"
    FROM 
      "donation" "donation"
    WHERE 
      "donation"."createdAt" >= $1
      AND "donation"."softDeleted" = $2
    GROUP BY 
      EXTRACT(MONTH FROM "donation"."createdAt"), 
      EXTRACT(YEAR FROM "donation"."createdAt")
    ORDER BY 
      year DESC, month DESC
    `,
      [last12Months.toISOString().split("T")[0], false]
    );

    // Convert query results into a lookup object for easy merging
    const donationsMap = donations.reduce((map: any, item: any) => {
      const key = `${item.year}-${item.month}`;
      map[key] = {
        month: Number(item.month),
        year: Number(item.year),
        totalAmount: Number(item.totalAmount) || 0,
        count: Number(item.count) || 0,
      };
      return map;
    }, {});

    // Merge donations data with the full list of months
    const result = months.map(({ month, year }) => {
      const key = `${year}-${month}`;
      return donationsMap[key] || { month, year, totalAmount: 0, count: 0 };
    });

    return result;
  }
}
