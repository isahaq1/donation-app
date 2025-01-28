import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("donations")
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.donations)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: false })
  softDeleted: boolean;

  @Column({ nullable: true, type: "timestamp" })
  delatedAt: Date;

  constructor(
    id: number,
    amount: number,
    description: string,
    userId: number,
    user: User,
    createdAt: Date,
    delatedAt: Date,
    softDeleted: boolean
  ) {
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.user = user;
    this.userId = userId;
    this.createdAt = createdAt;
    this.delatedAt = delatedAt;
    this.softDeleted = softDeleted;
  }
}
