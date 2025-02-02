import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Donation } from "./donation.entity";
import {
  CreateDonationDTO,
  UpdateDonationDTO,
} from "./dto/create-donation.dto";

interface DateRangeDto {
  startDate: Date;
  endDate: Date;
}

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

  async findAll(user: any): Promise<Donation[]> {
    // If user is admin, return all donations
    if (user.role === "admin") {
      return this.donationsRepository.find({
        relations: ["user"],
        select: {
          user: {
            id: true,
            username: true,
            email: true,
          },
        },
        where: { softDeleted: false },
      });
    }

    // If user is not admin, return only their donations
    return this.donationsRepository.find({
      relations: ["user"],
      select: {
        user: {
          id: true,
          username: true,
          email: true,
        },
      },
      where: {
        softDeleted: false,
        userId: user.id, // Filter by the authenticated user's ID
      },
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

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Generate the last 12 months
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(
        last12Months.getFullYear(),
        last12Months.getMonth() + i,
        1
      );
      months.push({
        month: date.getMonth() + 1,
        monthName: monthNames[date.getMonth()],
        year: date.getFullYear(),
      });
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
        monthName: monthNames[Number(item.month) - 1], // Convert month number to name
        year: Number(item.year),
        totalAmount: Number(item.totalAmount) || 0,
        count: Number(item.count) || 0,
      };
      return map;
    }, {});

    // Merge donations data with the full list of months
    const result = months.map(({ month, monthName, year }) => {
      const key = `${year}-${month}`;
      return (
        donationsMap[key] || {
          month,
          monthName,
          year,
          totalAmount: 0,
          count: 0,
        }
      );
    });

    return result;
  }

  async getDonationReportByDateRange(dateRange: DateRangeDto) {
    try {
      const { startDate, endDate } = dateRange;

      // Get all dates between start and end date
      const getDatesInRange = (start: Date, end: Date) => {
        const dates = [];
        const current = new Date(start);
        const last = new Date(end);

        while (current <= last) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        return dates;
      };

      const allDates = getDatesInRange(new Date(startDate), new Date(endDate));

      // Get donations within date range
      const donations = await this.donationsRepository
        .createQueryBuilder("donation")
        .select([
          "to_char(donation.createdAt, 'YYYY-MM-DD') as date",
          "COALESCE(SUM(donation.amount), 0) as total_amount",
          "COUNT(*) as count",
          "donation.softDeleted",
        ])
        .where("donation.createdAt >= :startDate", {
          startDate: new Date(startDate).toISOString().split("T")[0],
        })
        .andWhere("donation.createdAt <= :endDate", {
          endDate: new Date(endDate).toISOString().split("T")[0] + " 23:59:59",
        })
        .groupBy(
          "to_char(donation.createdAt, 'YYYY-MM-DD'), donation.softDeleted"
        )
        .orderBy("date", "DESC")
        .getRawMany();

      // Create a map of donations by date
      const donationsByDate = new Map();

      // Initialize all dates with zero values
      allDates.forEach((date) => {
        const dateStr = date.toISOString().split("T")[0];
        donationsByDate.set(dateStr, {
          date: dateStr,
          activeAmount: 0,
          activeCount: 0,
          deletedAmount: 0,
          deletedCount: 0,
          totalAmount: 0,
          totalCount: 0,
        });
      });

      // Fill in actual donation data
      donations.forEach((item) => {
        const dateStr = item.date;
        const dayData = donationsByDate.get(dateStr);

        if (dayData) {
          const amount = Number(item.total_amount) || 0;
          const count = Number(item.count) || 0;

          if (item.donation_softdeleted) {
            dayData.deletedAmount += amount;
            dayData.deletedCount += count;
          } else {
            dayData.activeAmount += amount;
            dayData.activeCount += count;
          }

          dayData.totalAmount = dayData.activeAmount + dayData.deletedAmount;
          dayData.totalCount = dayData.activeCount + dayData.deletedCount;
        }
      });

      // Convert map to array and sort by date
      const dailyReports = Array.from(donationsByDate.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Calculate overall totals
      const summary = {
        startDate,
        endDate,
        totalAmount: 0,
        totalCount: 0,
        activeAmount: 0,
        activeCount: 0,
        deletedAmount: 0,
        deletedCount: 0,
        dailyReports,
      };

      // Sum up totals from daily reports
      dailyReports.forEach((day) => {
        summary.activeAmount += day.activeAmount;
        summary.activeCount += day.activeCount;
        summary.deletedAmount += day.deletedAmount;
        summary.deletedCount += day.deletedCount;
      });

      summary.totalAmount = summary.activeAmount + summary.deletedAmount;
      summary.totalCount = summary.activeCount + summary.deletedCount;

      return summary;
    } catch (error) {
      console.error("Error in getDonationReportByDateRange:", error);
      throw error;
    }
  }
}
