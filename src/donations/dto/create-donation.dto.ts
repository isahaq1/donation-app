import { User } from "../../users/user.entity";
export class CreateDonationDTO {
  readonly amount?: number;
  readonly description?: string;
  readonly user?: User;
  readonly createdAt?: string;
}
export class UpdateDonationDTO {
  readonly amount?: number;
  readonly description?: string;
  readonly user?: User;
  readonly createdAt?: string;
}
