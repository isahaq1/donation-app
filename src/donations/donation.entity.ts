import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.donations)
  user: User;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  constructor(
    id: number,
    amount: number,
    description: string,
    user: User,
    createdAt: Date
  ) {
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.user = user;
    this.createdAt = createdAt;
  }
}
