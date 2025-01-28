import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Donation } from "../donations/donation.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ default: "user" })
  role: string;

  @OneToMany(() => Donation, (donation: Donation) => donation.user)
  donations!: Donation[]; // Definite assignment assertion

  constructor(
    id: number,
    email: string,
    password: string,
    name: string,
    username: string,
    role: string = "user"
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.username = username;
    this.role = role;
  }
}
